"use client";

import { completeAppoinment } from "@/app/(admin)/action";
import { UpdateInventorySchema } from "@/app/types";
import ItemUsedField from "@/components/forms/appointment/item-used-field";
import { toast } from "@/components/hooks/use-toast";
import TeethChart from "@/components/teeth-permanent";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function CompleteAppointment({
  text,
  disabled,
  appointmentId,
}: {
  text: boolean;
  disabled: boolean;
  appointmentId: any;
}) {
  const [open, setOpen] = useState(false);
  // Fetch patient data
  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });
  // Use z.infer to derive the type from UpdateInventorySchema
  const form = useForm<z.infer<typeof UpdateInventorySchema>>({
    resolver: zodResolver(UpdateInventorySchema),
    defaultValues: {
      id: appointmentId,
    },
  });

  async function onSubmit(formData: z.infer<typeof UpdateInventorySchema>) {
    try {
      await completeAppoinment(formData); // Make sure this function returns a promise
      // setOpen(false); // Close the modal

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        // description: "Service added successfully. ",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(formData, null, 2)}
            </code>
          </pre>
        ),
        duration: 2000,
      });
    } catch (error: any) {
      // Revert the optimistic update in case of an error
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
        <Button disabled={disabled} variant="outline">
          Complete
        </Button>
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
        <ItemUsedField form={form} onSubmit={onSubmit} />
        <TeethChart />
      </SheetContent>
    </Sheet>
  );
}
