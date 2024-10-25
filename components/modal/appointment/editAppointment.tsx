"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { rescheduleAppointment } from "@/app/(admin)/action";
import { toast } from "@/components/hooks/use-toast";
import { AppointmentField } from "@/components/forms/appointment/appointmentField";
import { cn } from "@/lib/utils";

export function EditAppointment({
  appointment,
  text,
  disabled,
  mutate,
}: {
  appointment: AppointmentsCol;
  text: boolean;
  disabled: boolean;
  mutate: any;
}) {
  const [open, setOpen] = useState(false);
  // Fetch patient data
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
    form.setValue("service", appointment?.service || 0); // Adjust here if `service` is directly accessible
    form.setValue("type", appointment?.type || "");
    form.setValue("patient", appointment?.patients?.name || "");
  };

  //   const checkEmailExists = async (email: string): Promise<boolean> => {
  //     return patients.some((patient: PatientCol) => patient.email === email);
  //   };
  // async function onSubmit(data: z.infer<typeof AppointmentSchema>) {
  //   // const emailExists = await checkEmailExists(data.email);
  //   // if (emailExists) {
  //   //   form.setError("email", {
  //   //     type: "manual",
  //   //     message: "Email already exists",
  //   //   });
  //   //   return;
  //   // }
  //   rescheduleAppointment(data);
  //   console.log(data);
  //   toast({
  //     title: "You submitted the following values:",
  //     description: (
  //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //       </pre>
  //     ),
  //   });
  //   form.reset();
  // }

  async function onSubmit(formData: z.infer<typeof AppointmentSchema>) {
    mutate();

    try {
      await rescheduleAppointment(formData); // Make sure this function returns a promise
      setOpen(false); // Close the modal

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

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {text ? (
          <Button disabled={disabled} onClick={() => set()}>
            Edit
          </Button>
        ) : (
          <SquarePen
            className="text-sm w-5 text-muted-foreground  cursor-pointer"
            onClick={() => set()}
          />
        )}
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
            Make changes to your profile here. Click save when youre done.
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
