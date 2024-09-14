"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
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
import useSWR from "swr";
import { CalendarForm } from "../buttons/selectDate";
import TimeSlot from "../buttons/selectTime";
import Field from "./formField";
import { newApp } from "@/app/admin/action";

type Appointment = {
  id: string;
  patient_id: number;
  date: Date;
};

const FormSchema = z.object({
  patient: z.number(),
  service: z.number({
    required_error: "Please select an email to display.",
  }),
  branch: z.number({
    required_error: "Please select an email to display.",
  }),
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  time: z.number({
    required_error: "A date of birth is required.",
  }),
  type: z.string({
    required_error: "A date of birth is required.",
  }),
  status: z.number({
    required_error: "Please select an email to display.",
  }),
});

const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());

const type = [
  { name: "Walk in", id: "walk in" },
  { name: "Phone Call", id: "phone call" },
] as const;

export function SelectForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { data, error } = useSWR("/api/data/", fetcher);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    newApp(data);
    setOpen(false);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  if (!data) return <>Loading ...</>;
  const date = form.watch("date");
  const selectedBranch = form.watch("branch");
  const patient = form.watch("patient");

  const patientsTable = data.find((item) => item.table_name === "patients");
  const appointmentsTable = data.find(
    (item) => item.table_name === "appointments"
  );

  const services = data.find((item) => item.table_name === "services");
  const branch = data.find((item) => item.table_name === "branch");
  const statuses = data.find((item) => item.table_name === "status");

  const patientAppointments = (appointmentsTable.row_data as Appointment[])
    .filter((item) => item.patient_id === patient)
    .map((item) => item.date);

  console.log(patientAppointments);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field
            form={form}
            name={"patient"}
            label={"patient"}
            data={patientsTable.row_data}
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

          <FormField
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
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
