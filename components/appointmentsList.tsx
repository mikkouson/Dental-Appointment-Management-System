import { acceptAppointment, cancelAppointment } from "@/app/(admin)/action";
import type {
  Appointment,
  AppointmentsCol,
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
  appointments: AppointmentsCol[];
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
              <div className="space-y-4">
                {filteredAppointments.map((apt: any) => (
                  <div
                    className="border-2 p-2 rounded-lg flex flex-col space-y-3 md:flex-row md:items-center md:justify-between"
                    key={apt.id}
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      <span className="text-base md:text-lg font-semibold mr-2">
                        {apt.services?.name || "Unknown Service"} -
                      </span>

                      <div className="flex flex-col">
                        <span className="text-sm md:text-base">
                          Patient: {apt.patients?.name || "Unknown Patient"}
                        </span>
                        <span className="text-sm md:text-base">
                          Status: {apt.status?.name || "Not specified"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center space-x-2 mt-3 md:mt-0">
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
                        {apt.status?.id === 2 && (
                          <SubmitButton
                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                            formAction={async () => {
                              try {
                                await acceptAppointment({ aptId: apt.id });
                              } catch (error) {
                                console.error(
                                  "Failed to cancel appointment",
                                  error
                                );
                              }
                            }}
                            pendingText="Accepting..."
                          >
                            Accept
                          </SubmitButton>
                        )}

                        <EditAppointment appointment={apt} text={true} />
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-700 mt-4 text-sm md:text-base">
                No appointments
              </p>
            )}
          </div>
        );
      })}
    </>
  );
}
