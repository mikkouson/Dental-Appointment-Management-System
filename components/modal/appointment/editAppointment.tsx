"use client";

import { rescheduleAppointment } from "@/app/(admin)/action";
import { AppointmentsCol } from "@/app/schema";
import { AppointmentSchema } from "@/app/types";
import { AppointmentField } from "@/components/forms/appointment/appointmentField";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
          <Button disabled={disabled} onClick={() => set()} variant="outline">
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
          <SheetTitle>Edit appointment</SheetTitle>
          <SheetDescription>
            Make changes to the appointment here. Click save when youre done.
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
