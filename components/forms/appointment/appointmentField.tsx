import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as React from "react";
import { CalendarForm } from "../../buttons/selectDate";
import TimeSlot from "../../buttons/selectTime";
import { UseFormReturn } from "react-hook-form";

import { useGetDate } from "@/app/store";
import Field from "../../forms/formField";
import { Input } from "../../ui/input";
import { AppointmentSchemaType } from "@/app/types";
import { Appointment } from "@/app/schema";
import { useBranches } from "@/components/hooks/useBranches";
import { useStatuses } from "@/components/hooks/useStatuses";
import { useService } from "@/components/hooks/useService";
import { useAppointments } from "@/components/hooks/useAppointment";

interface AppointmentFieldsProps {
  form: UseFormReturn<AppointmentSchemaType>;
  onSubmit: (data: AppointmentSchemaType) => void;
  appointment: Appointment;
}

const type = [
  { name: "Walk in", id: "walk in" },
  { name: "Phone Call", id: "phone call" },
  { name: "Online", id: "online" },
] as const;

export function AppointmentField({
  appointment,
  form,
  onSubmit,
}: AppointmentFieldsProps) {
  const selectedBranch = useGetDate((state) => state.setBranch);

  const { statuses, statusLoading } = useStatuses();
  const { branches, branchLoading } = useBranches();
  const { services, serviceError, serviceLoading } = useService();
  const { appointments, appointmentsLoading } = useAppointments();

  const patientAppointments =
    appointments?.data
      .filter((item: any) => item.patient_id === appointment.id)
      .map((item: any) => item.date) || [];

  const appointmentDate = appointment.date ? new Date(appointment.date) : null;
  const { isSubmitting } = form.formState;

  if (statusLoading || branchLoading || serviceLoading || appointmentsLoading)
    return <>Loading</>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {appointment?.patients?.name && (
            <FormField
              control={form.control}
              name="patient"
              render={() => (
                <FormItem>
                  <FormLabel>Patients Name</FormLabel>
                  <Input disabled defaultValue={appointment?.patients?.name} />
                </FormItem>
              )}
            />
          )}
          <Field
            form={form}
            name={"branch"}
            label={"Branch"}
            data={branches}
            num={true}
          />
          <Field
            form={form}
            name={"service"}
            label={"Service"}
            data={services?.data}
            num={true}
          />
          <Field
            form={form}
            name={"status"}
            label={"Status"}
            data={statuses}
            num={true}
          />
          <Field
            form={form}
            name={"type"}
            label={"Appointment type"}
            data={type}
          />
          {appointmentDate && (
            <FormField
              name="date"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <CalendarForm
                    field={field}
                    form={form}
                    patientAppointments={patientAppointments}
                    dontdis={appointmentDate}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {appointmentDate && ( // Render TimeSlot only if appointmentDate is not null
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <TimeSlot
                    branch={
                      selectedBranch.length < 0
                        ? selectedBranch
                        : branches[0]?.id
                    }
                    field={field}
                    date={appointmentDate}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
