import React, { useState } from "react";

import { createToothHistory, updateToothHistory } from "@/app/(admin)/action";
import { ToothHistory, ToothHistoryFormValue } from "@/app/types";
import ToothConditionFields from "@/components/forms/patients/tooth-condition-field";
import { toast } from "@/components/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { LiaToothSolid } from "react-icons/lia";
import { z } from "zod";
import ToothHistoryCard from "@/components/cards/toothHistoryCard";
import { getToothDescription } from "@/components/ui/tooth-description";
import { useTeethArray } from "@/app/store";

interface NewToothConditionProps {
  children: React.ReactNode;
  history: any;
  id: number;
  form: UseFormReturn<ToothHistoryFormValue>;
  newPatient?: boolean;
}

export function NewToothCondition({
  children,
  form,
  history,
  newPatient = false,
}: NewToothConditionProps) {
  const [open, setOpen] = useState(false);
  const { teethLocations, addTeethLocation, updateToothLocation } =
    useTeethArray();

  const formatToothTitle = (location: number) => {
    const description = getToothDescription(location);
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <LiaToothSolid size={30} />
          <div className="ml-2">
            <div className="font-medium">Tooth Number: {location}</div>
            <div className="text-sm text-muted-foreground capitalize">
              {description}
            </div>
          </div>
        </div>
      </div>
    );
  };

  async function onSubmit(data: z.infer<typeof ToothHistory>) {
    try {
      if (newPatient) {
        // Check if tooth location already exists for this patient
        const existingTooth = teethLocations.find(
          (tooth) =>
            tooth.tooth_location === data.tooth_location &&
            tooth.patient_id === Number(data.patient_id)
        );

        const toothData = {
          tooth_location: data.tooth_location,
          tooth_condition: data.tooth_condition,
          tooth_history: data.tooth_history,
          history_date: data.history_date,
          patient_id: Number(data.patient_id),
        };

        if (existingTooth) {
          // Update existing tooth
          updateToothLocation(toothData);
        } else {
          // Add new tooth
          addTeethLocation(toothData);
        }
      } else {
        // Save to database if it's an existing patient
        await createToothHistory(data);
      }

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Patient updated successfully.",
        duration: 2000,
      });
      setOpen(false);
    } catch (error) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: "An unexpected error occurred",
        duration: 3000,
      });
      console.error("Error in onSubmit:", error);
    }
  }

  const tooth_location = form.watch("tooth_location");
  const historyForTooth = history.filter(
    (h: any) => h.tooth_location === tooth_location
  );
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-full md:w-[400px] overflow-auto"
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
          <SheetTitle>Tooth History</SheetTitle>
          <Separator className="my-2" />

          <div className="font-thin italic">
            {formatToothTitle(tooth_location)}
          </div>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription> */}
        </SheetHeader>
        <Separator className="my-2" />
        <ToothConditionFields form={form} onSubmit={onSubmit} />
        {/* {historyForTooth ||
          (history.length > 0 && (
            <div>
              <Separator className="my-2" />

              <div className="flex items-center  gap-2">
                <LiaToothSolid size={20} />
                <p className="font-medium text-sm">Treatment History</p>
              </div>
              <Separator className="my-2" />

              <ToothHistoryCard treatments={historyForTooth} edit={true} />
            </div>
          ))} */}

        <Separator className="my-2" />

        <div className="flex items-center  gap-2">
          <LiaToothSolid size={20} />
          <p className="font-medium text-sm">Treatment History</p>
        </div>
        <Separator className="my-2" />
        <ToothHistoryCard treatments={historyForTooth} />

        {/* {history.length < 0 ? (
          <ToothHistoryCard treatments={historyForTooth} edit={true} />
        ) : (
          <div className="flex justify-center items-center w-full text-muted-foreground">
            No treatment history found.
          </div>
        )} */}
      </SheetContent>
    </Sheet>
  );
}
