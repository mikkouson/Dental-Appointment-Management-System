import { cancelAppointment } from "@/app/admin/action";
import type {
  Appointment,
  Patient,
  Service,
  Status,
  TimeSlot,
} from "@/app/schema";
import SubmitButton from "./buttons/submitBtn";
import { Separator } from "./ui/separator";
import { EditAppointment } from "./modal/appointment/editAppointment";

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
          (apt: any) => apt.time === time.id
        );

        return (
          <div key={time.id} className="mb-4 overflow-x-hidden">
            <div className="flex items-center ">
              <h3 className="text-lg font-semibold mr-2 whitespace-nowrap">
                {time.time}
              </h3>
              {timeSlots.length && <Separator className="my-2 max-w-30 " />}
            </div>

            {filteredAppointments.length > 0 ? (
              <div>
                {filteredAppointments.map((apt: any) => (
                  <div
                    className="flex items-center border-2 p-2 px-4 mb-2 rounded-lg justify-between"
                    key={apt.id}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">
                        {apt.services?.name || "Unknown Service"} -
                      </span>

                      <div className="flex flex-col">
                        <span>
                          Patient: {apt.patients?.name || "Unknown Patient"}
                        </span>
                        <span>
                          Status: {apt.status?.name || "Not specified"}
                        </span>
                      </div>
                    </div>
                    <form>
                      {apt.status?.id === 1 && (
                        <SubmitButton
                          className="bg-red-500 text-white px-3 py-1 rounded mr-2"
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

                      <EditAppointment appointment={apt} text={true} />
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
