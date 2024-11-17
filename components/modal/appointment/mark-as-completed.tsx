"use client";

import { useTeethArray } from "@/app/store";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ToothHistoryCard from "@/components/cards/toothHistoryCard";
import { completeAppointment } from "@/app/(admin)/appointments/action";

type UseTeethArrayReturn = {
  teethArray: number[];
  // add other properties returned by the hook
};
export function CompleteAppointment({
  text,
  disabled,
  appointmentId,
  patientId,
  brachId,
}: {
  text: boolean;
  disabled: boolean;
  appointmentId: any;
  patientId: any;
  brachId: any;
}) {
  const [open, setOpen] = useState(false);
  const { clearTeethLocations } = useTeethArray();
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
    }>
  >([]);
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
    shouldUnregister: false, // Add this line
    resetOptions: {
      keepDirtyValues: true, // Keep form values on reset
      keepValues: true, // Keep values on unmount
    },
  });
  const { teethLocations } = useTeethArray();

  async function onSubmit(formData: z.infer<typeof UpdateInventorySchema>) {
    try {
      await completeAppointment(formData, teethLocations); // Make sure this function returns a promise
      // setOpen(false); // Close the modal
      setOpen(false); // Close the modal

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: `Appointment marked as done successfully.`,
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: "Update appointment status failed",
        duration: 2000,
      });
    }
  }

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          onClick={() => clearTeethLocations()}
        >
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
          <SheetTitle>Complete Appointment</SheetTitle>
          <SheetDescription>
            Make changes to the appointment here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="chart" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Teeth Chart</TabsTrigger>
            <TabsTrigger value="items">Items Used</TabsTrigger>
          </TabsList>

          <TabsContent
            value="chart"
            className="flex flex-col justify-center items-center gap-4"
          >
            <TeethChart
              history={[]}
              newPatient={true}
              id={patientId}
              showTitle={false}
            />
            <ToothHistoryCard
              edit={true}
              treatments={teethLocations}
              newPatient={true}
            />
          </TabsContent>
          <TabsContent value="items">
            <ItemUsedField
              form={form}
              onSubmit={onSubmit}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              branchId={brachId}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
