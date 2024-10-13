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
import { newApp } from "@/app/(admin)/action";
import TimeSlot from "@/components/buttons/selectTime";
import { CalendarForm } from "@/components/buttons/selectDate";
import Field from "../formField";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  patient_id: number;
  date: Date;
};

const FormSchema = z.object({
  id: z.number(),
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

const statuses = [
  { name: "Pending", id: 2 },
  { name: "Completed", id: 4 },
] as const;

const type = [
  { name: "Walk in", id: "walk in" },
  { name: "Phone Call", id: "phone call" },
] as const;

interface NewServiceFormProps {
  setOpen: (open: boolean) => void;
  mutate: any; // It's better to type this more specifically if possible
}
export function NewAppointmentForm({ setOpen, mutate }: NewServiceFormProps) {
  const { data, error } = useSWR("/api/data/", fetcher);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    mutate();

    try {
      await newApp(formData); // Make sure this function returns a promise
      // setOpen(false); // Close the modal

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Service added successfully.",
        duration: 2000,
      });
      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to add service: ${error.message}`,
      });
    }
  }

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

  const patientAppointments = (appointmentsTable.row_data as Appointment[])
    .filter((item) => item.patient_id === patient)
    .map((item) => item.date);
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        {/* <ScrollArea className="h-80 w-full "> */}
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
            data={statuses}
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
        {/* </ScrollArea> */}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
