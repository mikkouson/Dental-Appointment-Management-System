import type { Database } from "@/app/schema"; // Adjust path as necessary
import { cancelAppointment } from "@/app/admin/action";
import { SheetDemo } from "./Sheet";
import SubmitButton from "./submitBtn";

// Define types based on the `Database` schema
type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];
type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type Status = Database["public"]["Tables"]["status"]["Row"];
type Patient = Database["public"]["Tables"]["patients"]["Row"];

// Ensure that appointments are mapped with service, patient, and status information
interface AppointmentsMapProps {
  timeSlots: TimeSlot[];
  appointments: (Appointment & {
    services?: Service;
    patients?: Patient;
    status?: Status;
  })[];
}

export default function AppointmentsMap({
  timeSlots,
  appointments,
}: AppointmentsMapProps) {
  return (
    <>
      {timeSlots.map((time) => {
        const filteredAppointments = appointments.filter(
          (apt) => apt.time === time.id
        );

        return (
          <div key={time.id}>
            <h3 className="text-lg font-semibold mb-2">{time.time}</h3>
            {filteredAppointments.length > 0 ? (
              <div>
                {filteredAppointments.map((apt) => (
                  <div
                    className="flex items-center border-2 p-2 mb-2 rounded-lg"
                    key={apt.id}
                  >
                    <span className="mr-2">
                      {apt.services?.name || "Unknown Service"} -
                    </span>

                    <div className="flex flex-col">
                      <span>
                        Patient: {apt.patients?.name || "Unknown Patient"}
                      </span>
                      <span>Status: {apt.status?.name || "Not specified"}</span>
                    </div>
                    <form>
                      <SheetDemo
                        date={apt.date || ""}
                        pid={String(apt.patients?.id || "")} // Convert to string
                        time={Number(apt.time || "")}
                        aptId={apt.id}
                      />
                      {apt.status?.id === 1 && (
                        <SubmitButton
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          formAction={async () => {
                            try {
                              await cancelAppointment({ aptId: apt.id });
                            } catch (error) {
                              console.error(
                                "Failed to cancel appointment",
                                error
                              );
                            }
                          }}
                          pendingText="Cancelling..."
                        >
                          Cancel
                        </SubmitButton>
                      )}
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p>No appointments</p>
            )}
          </div>
        );
      })}
    </>
  );
}
