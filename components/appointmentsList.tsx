import {
  acceptAppointment,
  cancelAppointment,
  rejectAppointment,
} from "@/app/(admin)/action";
import type { AppointmentsCol, TimeSlot } from "@/app/schema";
import { Separator } from "./ui/separator";
import { EditAppointment } from "./modal/appointment/editAppointment";
import { useState } from "react";
import { Button } from "./ui/button"; // Assuming this is where Button is located
import { toast } from "./hooks/use-toast";
import { cn } from "@/lib/utils";

interface AppointmentsMapProps {
  timeSlots: TimeSlot[];
  appointments: AppointmentsCol[];
  mutate: any;
}

export default function AppointmentsMap({
  timeSlots,
  appointments,
  mutate,
}: AppointmentsMapProps) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleAction = async (
    action: () => Promise<void>,
    aptId: number,
    actionType: string
  ) => {
    setLoading(aptId);
    try {
      await action();
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: `Appointment ${actionType} successfully.`,
        duration: 2000,
      });
    } catch (error: any) {
      console.error("Failed to perform action", error);
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to ${actionType.toLowerCase()} appointment: ${
          error.message
        }`,
      });
    } finally {
      setLoading(null);
    }
  };

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
                      {apt.status?.id === 1 && (
                        <Button
                          type="button"
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          disabled={loading === apt.id}
                          onClick={() =>
                            handleAction(
                              () => cancelAppointment({ aptId: apt.id }),
                              apt.id,
                              "cancelled"
                            )
                          }
                        >
                          {loading === apt.id ? "Cancelling..." : "Cancel"}
                        </Button>
                      )}

                      {apt.status?.id === 2 && (
                        <>
                          <Button
                            type="button"
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            disabled={loading === apt.id}
                            onClick={() =>
                              handleAction(
                                () => acceptAppointment({ aptId: apt.id }),
                                apt.id,
                                "accepted"
                              )
                            }
                          >
                            {loading === apt.id ? "Accepting..." : "Accept"}
                          </Button>

                          <Button
                            type="button"
                            className="bg-red-700 text-white px-3 py-1 rounded"
                            disabled={loading === apt.id}
                            onClick={() =>
                              handleAction(
                                () => rejectAppointment({ aptId: apt.id }),
                                apt.id,
                                "rejected"
                              )
                            }
                          >
                            {loading === apt.id ? "Rejecting..." : "Reject"}
                          </Button>
                        </>
                      )}

                      <EditAppointment
                        appointment={apt}
                        text={true}
                        disabled={loading === apt.id} // Disable while loading
                        mutate={mutate}
                      />
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
