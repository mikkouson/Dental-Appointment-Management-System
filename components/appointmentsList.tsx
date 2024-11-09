import {
  acceptAppointment,
  cancelAppointment,
  rejectAppointment,
} from "@/app/(admin)/action";
import type { AppointmentsCol, TimeSlot } from "@/app/schema";
import { Separator } from "./ui/separator";
import { EditAppointment } from "./modal/appointment/editAppointment";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./hooks/use-toast";
import { cn } from "@/lib/utils";
import { CompleteAppointment } from "./modal/appointment/mark-as-completed";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Stethoscope, User, Info, Phone, Ticket, Hospital } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const handleAction = async (
    action: () => Promise<void>,
    aptId: number,
    actionType: string
  ) => {
    setLoading(aptId);
    setLoadingType(actionType);
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
      setLoadingType(null);
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
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2 whitespace-nowrap">
                {time.time}
              </h3>
              {timeSlots.length && <Separator className="my-2 max-w-30" />}
            </div>

            {filteredAppointments.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAppointments.map((apt: any) => (
                  <Card key={apt.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center"></CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm md:text-base flex items-center">
                          <User className="w-5 h-5 mr-2 " />
                          Patient:
                          <Link
                            href={`/patients/${apt.patients?.id}`}
                            className="ml-1 text-blue-600 hover:text-blue-800 underline"
                          >
                            {apt.patients?.name || "Unknown Patient"}
                          </Link>
                        </span>
                        <span className="text-sm md:text-base flex items-center">
                          <Stethoscope className="w-5 h-5 mr-2" />
                          Service: {apt.services?.name || "Unknown Service"}
                        </span>
                        <span className="text-sm md:text-base flex items-center">
                          <Info className="w-5 h-5 mr-2" />
                          Status:{" "}
                          <Badge
                            variant={
                              apt.status?.id === 1
                                ? "success"
                                : apt.status?.id === 2
                                ? "default"
                                : apt.status?.id === 5 || apt.status?.id === 3
                                ? "destructive"
                                : apt.status?.id === 6
                                ? "rescheduled"
                                : "success"
                            }
                            className="ml-2"
                          >
                            {apt.status?.name || "Not specified"}
                          </Badge>
                        </span>
                        <span className="text-sm md:text-base flex items-center">
                          <Hospital className="w-5 h-5 mr-2" />
                          Branch: {apt.branch?.name || "No branch specified"}
                        </span>
                        <span className="text-sm md:text-base flex items-center">
                          <Ticket className="w-5 h-5 mr-2" />
                          Appointment Ticket: {apt.appointment_ticket || "N/A"}
                        </span>
                        <span className="text-sm md:text-base flex items-center">
                          <Phone className="w-5 h-5 mr-2" />
                          Phone Number:{" "}
                          {apt.patients?.phone_number || "No phone number"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <EditAppointment
                          appointment={apt}
                          text={true}
                          disabled={loading === apt.id}
                          mutate={mutate}
                        />
                        {apt.status?.id === 1 && (
                          <>
                            <CompleteAppointment
                              appointmentId={apt.id}
                              text={false}
                              disabled={loading === apt.id}
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={loading === apt.id}
                              onClick={() =>
                                handleAction(
                                  () => cancelAppointment({ aptId: apt.id }),
                                  apt.id,
                                  "cancelled"
                                )
                              }
                            >
                              {loading === apt.id && loadingType === "cancelled"
                                ? "Cancelling..."
                                : "Cancel"}
                            </Button>
                          </>
                        )}
                        {apt.status?.id === 2 && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={loading === apt.id}
                              onClick={() =>
                                handleAction(
                                  () => acceptAppointment({ aptId: apt.id }),
                                  apt.id,
                                  "accepted"
                                )
                              }
                            >
                              {loading === apt.id && loadingType === "accepted"
                                ? "Accepting..."
                                : "Accept"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={loading === apt.id}
                              onClick={() =>
                                handleAction(
                                  () => rejectAppointment({ aptId: apt.id }),
                                  apt.id,
                                  "rejected"
                                )
                              }
                            >
                              {loading === apt.id && loadingType === "rejected"
                                ? "Rejecting..."
                                : "Reject"}
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
