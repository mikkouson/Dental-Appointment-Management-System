"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CalendarForm } from "@/components/buttons/selectDate";
import TimeSlot from "@/components/buttons/selectTime";
import { toast } from "@/components/hooks/use-toast";
import { useAppointments } from "@/components/hooks/useAppointment";
import { useBranches } from "@/components/hooks/useBranches";
import { usePatients } from "@/components/hooks/usePatient";
import { useService } from "@/components/hooks/useService";
import { useStatuses } from "@/components/hooks/useStatuses";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import Field from "../formField";
import FormSkeleton from "./loading";
import { newApp } from "@/app/(admin)/appointments/action";

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
  const { branches, branchLoading } = useBranches();
  const { services, serviceError, serviceLoading } = useService();
  const { appointments, appointmentsLoading } = useAppointments();
  const { patients, patientError, patientLoading } = usePatients();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    mutate();

    try {
      await newApp(formData); // Make sure this function returns a promise
      setOpen(false); // Close the modal

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Appointment created successfully.",
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
        description: `Failed to create appointment`,
      });
    }
  }

  if (branchLoading || serviceLoading || appointmentsLoading || patientLoading)
    return <FormSkeleton />;

  const date = form.watch("date");
  const selectedBranch = form.watch("branch");
  const patient = form.watch("id");

  const patientAppointments = (appointments?.data as Appointment[])
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
            data={patients?.data}
            num={true}
            search={true}
          />
          <Field
            form={form}
            name={"branch"}
            label={"Branch"}
            data={branches}
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
            data={services?.data}
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
