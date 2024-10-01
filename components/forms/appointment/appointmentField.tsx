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

const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());

import { useGetDate } from "@/app/store";
import useSWR from "swr";
import Field from "../../forms/formField";
import { Input } from "../../ui/input";
import { AppointmentSchemaType } from "@/app/types";
import { Appointment } from "@/app/schema";

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
  const [open, setOpen] = React.useState(false);
  const selectedBranch = useGetDate((state) => state.setBranch);
  const { data, error } = useSWR("/api/data/", fetcher);

  if (!data) return <>Loading ...</>;

  const appointmentsTable = data.find(
    (item) => item.table_name === "appointments"
  );
  const branchTable = data.find((item) => item.table_name === "branch");
  const services = data.find((item) => item.table_name === "services");
  const statuses = data.find((item) => item.table_name === "status");

  const patientAppointments =
    appointmentsTable?.row_data
      .filter((item: any) => item.patient_id === appointment.id)
      .map((item: any) => item.date) || [];

  const appointmentDate = appointment.date ? new Date(appointment.date) : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <FormField
            control={form.control}
            name="patient"
            render={() => (
              <FormItem>
                <FormLabel>Patients Name</FormLabel>
                <Input disabled defaultValue={appointment.patients?.name} />
              </FormItem>
            )}
          />
          <Input disabled defaultValue={appointment.id} />
          <Field form={form} name={"branch"} label={"Branch"} />
          <Field
            form={form}
            name={"branch"}
            label={"Branch"}
            data={branchTable.row_data}
            num={true}
          />
          <Field
            form={form}
            name={"service"}
            label={"Service"}
            data={services.row_data}
            num={true}
          />
          <Field
            form={form}
            name={"status"}
            label={"Status"}
            data={statuses.row_data}
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
                        : branchTable?.row_data[0]?.id
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
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
