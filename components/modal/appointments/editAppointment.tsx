"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as React from "react";
import { z } from "zod";
import { CalendarForm } from "../../buttons/selectDate";
import TimeSlot from "../../buttons/selectTime";

const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());

import { rescheduleAppointment } from "@/app/(admin)/action";
import { useGetDate } from "@/app/store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import Field from "../../forms/formField";
import { toast } from "../../hooks/use-toast";
import { Input } from "../../ui/input";

interface Appointment {
  branch: number;
  status: { id: number };
  service: number;
  type: string;
  patients: { name: string };
  id: number;
}

interface SheetDemoProps {
  pid: string;
  date: string;
  time: number;
  aptId: number;
  apt: Appointment;
}

const FormSchema = z.object({
  id: z.number(),
  patient: z.string().optional(),
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
    required_error: "A date of birth is required.",
  }),
});
type FormSchemaType = z.infer<typeof FormSchema>;
const type = [
  { name: "Walk in", id: "walk in" },
  { name: "Phone Call", id: "phone call" },
  { name: "Online", id: "online" },
] as const;

export function SheetDemo({ date, pid, time, aptId, apt }: SheetDemoProps) {
  const [open, setOpen] = React.useState(false);
  const selectedBranch = useGetDate((state) => state.setBranch);
  const { data, error } = useSWR("/api/data/", fetcher);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const appointmentsTable = data?.find(
    (item) => item.table_name === "appointments"
  );
  const branchTable = data?.find((item) => item.table_name === "branch");

  const patientAppointments =
    appointmentsTable?.row_data
      .filter((item: any) => item.patient_id === pid)
      .map((item: any) => item.date) || [];

  const set = () => {
    form.setValue("date", new Date(date));
    form.setValue("id", aptId);
    form.setValue("time", time);
    form.setValue("branch", apt.branch);
    form.setValue("status", apt.status.id);
    form.setValue("service", apt.service);
    form.setValue("type", apt.type);
    form.setValue("patient", apt.patients.name);
  };

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    rescheduleAppointment(data);
    setOpen(false);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  };

  if (!data) return <>Loading ...</>;
  const services = data.find((item) => item.table_name === "services");
  const statuses = data.find((item) => item.table_name === "status");
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => set()}>Edit</Button>
      </SheetTrigger>
      <SheetContent className="w-[800px]">
        <SheetHeader>
          <SheetTitle>Edit Appointment</SheetTitle>
          <SheetDescription>
            Make changes to the appointment here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <FormField
                control={form.control}
                name="patient"
                render={() => (
                  <FormItem>
                    <FormLabel>Patients Name</FormLabel>
                    <Input disabled defaultValue={apt.patients.name} />
                  </FormItem>
                )}
              />
              <Input disabled defaultValue={apt.id} />

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
                      dontdis={new Date(date)}
                    />
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
                    <TimeSlot
                      branch={
                        selectedBranch.length < 0
                          ? selectedBranch
                          : branchTable?.row_data[0]?.id
                      }
                      field={field}
                      date={new Date(date)}
                    />
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
      </SheetContent>
    </Sheet>
  );
}
