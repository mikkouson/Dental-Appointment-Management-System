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

export function CompleteAppointment({
  text,
  disabled,
  appointmentId,
  patientId,
  brachId,
  mutate,
}: {
  text: boolean;
  disabled: boolean;
  appointmentId: any;
  patientId: any;
  brachId: any;
  mutate: any;
}) {
  const [open, setOpen] = useState(false);
  const { clearTeethLocations, teethLocations } = useTeethArray();
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
    }>
  >([]);
  const [activeTab, setActiveTab] = useState("chart");

  // Form setup with validation
  const form = useForm<z.infer<typeof UpdateInventorySchema>>({
    resolver: zodResolver(UpdateInventorySchema),
    defaultValues: {
      id: appointmentId,
    },
    shouldUnregister: false,
    resetOptions: {
      keepDirtyValues: true,
      keepValues: true,
    },
  });

  async function onSubmit(formData: z.infer<typeof UpdateInventorySchema>) {
    mutate();

    try {
      mutate();

      await completeAppointment(formData, teethLocations);
      setOpen(false);
      mutate();

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Appointment marked as done successfully.",
        duration: 2000,
      });
    } catch (error: any) {
      mutate();

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
        </SheetHeader>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">
              Teeth Chart{" "}
              {teethLocations.length === 0 && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </TabsTrigger>
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
