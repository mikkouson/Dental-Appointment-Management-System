"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newApp } from "@/app/admin/action";
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
import { CalendarForm } from "./DateSelect";
import { RadioBtn } from "./RadioBtn";
import TimeSlot from "./SelectTime";
type Patient = {
  id: string;
  // Add other patient properties as needed
};

type Appointment = {
  id: string;
  patient_id: number;
  date: Date;
};

const FormSchema = z.object({
  patient: z.string({
    required_error: "Please select a patient to display.",
  }),
  service: z.string({
    required_error: "Please select an email to display.",
  }),
  branch: z.string({
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

  const clear = () => {};

  const patientsTable = data.find((item) => item.table_name === "patients");
  const appointmentsTable = data.find(
    (item) => item.table_name === "appointments"
  );

  const services = data.find((item) => item.table_name === "services");
  const branch = data.find((item) => item.table_name === "branch");
  const patientId = parseInt(patient);

  const patientAppointments = (appointmentsTable.row_data as Appointment[])
    .filter((item) => item.patient_id === patientId)
    .map((item) => item.date);

  console.log(patientAppointments);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <FormField
            control={form.control}
            name="patient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <RadioBtn field={field} data={patientsTable.row_data} />
                <FormMessage />
                {patient}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <RadioBtn
                  field={field}
                  data={branch.row_data}
                  form={form}
                  timeclear={true}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Services</FormLabel>
                <RadioBtn field={field} data={services.row_data} form={form} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between">
                <FormLabel>Appointment Type</FormLabel>
                <RadioBtn field={field} data={type} />
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <TimeSlot branch={selectedBranch} field={field} date={date} />
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
