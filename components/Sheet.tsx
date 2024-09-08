"use client";

import { z } from "zod";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarForm } from "./DateSelect";
import TimeSlot from "./SelectTime";

const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());

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
import moment from "moment";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWR from "swr";
import { toast } from "./hooks/use-toast";
import { rescheduleAppointment } from "@/app/admin/action";

interface SheetDemoProps {
  pid: string;
  date: string;
  time: number;
  aptId: number;
}

const FormSchema = z.object({
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  time: z.number({
    required_error: "A time is required.",
  }),
  id: z.number(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export function SheetDemo({ date, pid, time, aptId }: SheetDemoProps) {
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
  };

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    rescheduleAppointment(data);
    setOpen(false);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  if (!data) return <>Loading ...</>;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => set()}>Open</Button>
      </SheetTrigger>
      <SheetContent>
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
                name="date"
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
