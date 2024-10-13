"use client";

import { AppointmentSchemaType } from "@/app/types";
import { CalendarForm } from "@/components/buttons/selectDate";
import TimeSlot from "@/components/buttons/selectTime";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import useSWR from "swr";
import Field from "../formField";

type Appointment = {
  id: string;
  patient_id: number;
  date: Date;
};

const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());

const type = [
  { name: "Walk in", id: "walk in" },
  { name: "Phone Call", id: "phone call" },
] as const;
interface PatientFieldsProps {
  form: UseFormReturn<AppointmentSchemaType>;
  onSubmit: (data: AppointmentSchemaType) => void;
}
export function NewAppointmentField({ form, onSubmit }: PatientFieldsProps) {
  const { data, error } = useSWR("/api/data/", fetcher);

  if (!data) return <>Loading ...</>;
  const date = form.watch("date");
  const selectedBranch = form.watch("branch");
  const patient = form.watch("id");

  const patientsTable = data.find((item) => item.table_name === "patients");
  const patients = patientsTable?.row_data?.filter(
    (item: { deleteOn: null | Date }) => item.deleteOn === null
  );
  const appointmentsTable = data.find(
    (item) => item.table_name === "appointments"
  );

  const services = data.find((item) => item.table_name === "services");
  const branch = data.find((item) => item.table_name === "branch");
  const statuses = data.find((item) => item.table_name === "status");

  const patientAppointments = (appointmentsTable.row_data as Appointment[])
    .filter((item) => item.patient_id === patient)
    .map((item) => item.date);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field
            form={form}
            name={"id"}
            label={"Patient"}
            data={patients}
            num={true}
            search={true}
          />
          <Field
            form={form}
            name={"branch"}
            label={"Branch"}
            data={branch.row_data}
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
            form={services}
            name={"service"}
            label={"Service"}
            data={services.row_data}
            num={true}
          />
          <Field form={form} name={"type"} label={"Type"} data={type} />

          {/* <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                {selectedBranch ? (
                  <CalendarForm
                    field={field}
                    form={form}
                    patientAppointments={patientAppointments}
                  />
                ) : (
                  <div className="cursor-not-allowed">
                    <Button
                      variant="outline"
                      className="w-full flex justify-between "
                      disabled
                    >
                      Select Date <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                    <FormDescription>
                      Please select clinic branch to enable date button
                    </FormDescription>
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                {date ? (
                  <TimeSlot
                    branch={selectedBranch.toString()}
                    field={field}
                    date={date}
                  />
                ) : (
                  <div className="cursor-not-allowed">
                    <Button
                      variant="outline"
                      className="w-full flex justify-between"
                      disabled
                    >
                      Select Time <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                    <FormDescription>
                      Please select available date to enable time button
                    </FormDescription>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        {/* <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div> */}
      </form>
    </Form>
  );
}
