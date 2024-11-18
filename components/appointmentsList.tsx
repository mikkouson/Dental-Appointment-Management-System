import type { AppointmentsCol, TimeSlot } from "@/app/schema";
import { Separator } from "./ui/separator";
import { EditAppointment } from "./modal/appointment/editAppointment";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./hooks/use-toast";
import { cn } from "@/lib/utils";
import { CompleteAppointment } from "./modal/appointment/mark-as-completed";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Stethoscope,
  User,
  Info,
  Phone,
  Ticket,
  Hospital,
  MoreVertical,
  Timer,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  acceptAppointment,
  acceptReschedule,
  cancelAppointment,
  deleteAppointment,
  rejectAppointment,
  rejectReschedule,
} from "@/app/(admin)/appointments/action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DeleteModal } from "./modal/deleteModal";
import { AcceptAppointment } from "./modal/appointment/acceptAppointment";
import moment from "moment";

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
    mutate();

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
      mutate();
    } catch (error: any) {
      console.error("Failed to perform action", error);
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: "Update appointment status failed",
      });
      mutate();
    } finally {
      setLoading(null);
      setLoadingType(null);
    }
  };

  const handleAcceptReschedule = async (
    aptId: number,
    time: number,
    date: Date
  ) => {
    await handleAction(
      async () => await acceptReschedule(aptId, date, time),
      aptId,
      "rescheduled"
    );
  };

  const handleRejectReschedule = async (aptId: number) => {
    await handleAction(
      async () => await rejectReschedule(aptId),
      aptId,
      "rejected"
    );
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
                    <CardHeader className="pb-0 flex flex-row justify-between items-center text-center">
                      <div>
                        <CardTitle className="text-base flex">
                          Appointment Details
                        </CardTitle>
                      </div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <EditAppointment
                              appointment={apt}
                              text={true}
                              disabled={loading === apt.id}
                              mutate={mutate}
                            />
                            <DropdownMenuSeparator />
                            <DeleteModal
                              label="appointment"
                              formAction={async () => {
                                await deleteAppointment(apt.id);
                                mutate();
                              }}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <Separator className="my-2" />

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

                        {apt.status?.id === 6 && (
                          <>
                            <Separator />
                            <h4 className="text-lg font-semibold">
                              Reschedule Request
                            </h4>
                            <span className="text-sm md:text-base flex items-center">
                              <Calendar className="w-5 h-5 mr-2" />
                              Rescheduled Date:{" "}
                              {apt.rescheduled_date
                                ? moment(apt.rescheduled_date).format(
                                    "MMMM D, YYYY"
                                  )
                                : "No rescheduled date"}
                            </span>
                            <span className="text-sm md:text-base flex items-center">
                              <Timer className="w-5 h-5 mr-2" />
                              Rescheduled Time:{" "}
                              {timeSlots.find(
                                (slot) => slot.id === apt.rescheduled_time
                              )?.time || "No rescheduled time"}
                            </span>

                            <Separator />

                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={loading === apt.id}
                                onClick={() =>
                                  handleAcceptReschedule(
                                    apt.id,
                                    apt.rescheduled_time,
                                    apt.rescheduled_date
                                  )
                                }
                              >
                                {loading === apt.id &&
                                loadingType === "rescheduled"
                                  ? "Accepting..."
                                  : "Accept Reschedule"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={loading === apt.id}
                                onClick={() => handleRejectReschedule(apt.id)}
                              >
                                {loading === apt.id &&
                                loadingType === "rejected"
                                  ? "Rejecting..."
                                  : "Reject Reschedule"}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
                        {apt.status?.id === 1 && (
                          <>
                            <CompleteAppointment
                              appointmentId={apt.id}
                              text={false}
                              disabled={loading === apt.id}
                              patientId={apt.patients?.id}
                              brachId={apt.branch?.id}
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
                            <AcceptAppointment
                              disabled={loading === apt.id}
                              appointment={apt}
                              patientId={apt.patients?.id}
                            />
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
