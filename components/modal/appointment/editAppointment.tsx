"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppointmentsCol } from "@/app/schema";
import { AppointmentSchema } from "@/app/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { rescheduleAppointment } from "@/app/admin/action";
import { toast } from "@/components/hooks/use-toast";
import { AppointmentField } from "@/components/forms/appointment/appointmentField";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export function EditAppointment({
  appointment,
}: {
  appointment: AppointmentsCol;
}) {
  console.log(appointment);
  const [open, setOpen] = useState(false);
  // Fetch patient data
  const { data: responseData, error } = useSWR("/api/apt/", fetcher);

  // Extract the array of patients from the response data
  const patients = responseData?.data || [];

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });
  // Use z.infer to derive the type from AppointmentSchema
  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
  });
  const set = () => {
    if (appointment.date) {
      form.setValue("date", new Date(appointment.date));
    }
    form.setValue("id", appointment.id);
    form.setValue("time", appointment?.time || 0);
    form.setValue(
      "branch",
      appointment?.branch?.id || appointment?.branch || 0
    );
    form.setValue("status", appointment?.status?.id || 0);
    form.setValue("service", appointment?.service || 0);
    form.setValue("type", appointment?.type || "");
    form.setValue("patient", appointment?.patients?.name || "");
  };

  //   const checkEmailExists = async (email: string): Promise<boolean> => {
  //     return patients.some((patient: PatientCol) => patient.email === email);
  //   };
  async function onSubmit(data: z.infer<typeof AppointmentSchema>) {
    // const emailExists = await checkEmailExists(data.email);
    // if (emailExists) {
    //   form.setError("email", {
    //     type: "manual",
    //     message: "Email already exists",
    //   });
    //   return;
    // }
    rescheduleAppointment(data);
    setOpen(false);
    console.log(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    form.reset();
  }

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SquarePen
          className="text-sm w-5 text-[#fde68a] cursor-pointer"
          onClick={() => set()}
        />
      </SheetTrigger>
      <SheetContent
        className="w-full md:w-[800px] overflow-auto"
        onInteractOutside={(e) => {
          const hasPacContainer = e.composedPath().some((el: EventTarget) => {
            if ("classList" in el) {
              return Array.from((el as Element).classList).includes(
                "pac-container"
              );
            }
            return false;
          });

          if (hasPacContainer) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you’re done.
          </SheetDescription>
        </SheetHeader>
        <AppointmentField
          form={form}
          onSubmit={onSubmit}
          appointment={appointment}
        />
      </SheetContent>
    </Sheet>
  );
}
