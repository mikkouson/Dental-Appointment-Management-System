import React, { useState } from "react";

import { updateToothHistory } from "@/app/(admin)/action";
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

const getToothDescription = (location: number) => {
  const toothMap: Record<number, string> = {
    // Upper Right (1st Quadrant)
    11: "permanent upper right central incisor",
    12: "permanent upper right lateral incisor",
    13: "permanent upper right canine",
    14: "permanent upper right first premolar",
    15: "permanent upper right second premolar",
    16: "permanent upper right first molar",
    17: "permanent upper right second molar",
    18: "permanent upper right third molar",

    // Upper Left (2nd Quadrant)
    21: "permanent upper left central incisor",
    22: "permanent upper left lateral incisor",
    23: "permanent upper left canine",
    24: "permanent upper left first premolar",
    25: "permanent upper left second premolar",
    26: "permanent upper left first molar",
    27: "permanent upper left second molar",
    28: "permanent upper left third molar",

    // Lower Left (3rd Quadrant)
    31: "permanent lower left central incisor",
    32: "permanent lower left lateral incisor",
    33: "permanent lower left canine",
    34: "permanent lower left first premolar",
    35: "permanent lower left second premolar",
    36: "permanent lower left first molar",
    37: "permanent lower left second molar",
    38: "permanent lower left third molar",

    // Lower Right (4th Quadrant)
    41: "permanent lower right central incisor",
    42: "permanent lower right lateral incisor",
    43: "permanent lower right canine",
    44: "permanent lower right first premolar",
    45: "permanent lower right second premolar",
    46: "permanent lower right first molar",
    47: "permanent lower right second molar",
    48: "permanent lower right third molar",
  };

  return toothMap[location] || "unknown tooth";
};

const getUniversalNumber = (isoNumber: number) => {
  const universalMap: Record<number, number> = {
    // Upper Right (1st Quadrant)
    11: 8,
    12: 7,
    13: 6,
    14: 5,
    15: 4,
    16: 3,
    17: 2,
    18: 1,

    // Upper Left (2nd Quadrant)
    21: 9,
    22: 10,
    23: 11,
    24: 12,
    25: 13,
    26: 14,
    27: 15,
    28: 16,

    // Lower Left (3rd Quadrant)
    31: 24,
    32: 23,
    33: 22,
    34: 21,
    35: 20,
    36: 19,
    37: 18,
    38: 17,

    // Lower Right (4th Quadrant)
    41: 25,
    42: 26,
    43: 27,
    44: 28,
    45: 29,
    46: 30,
    47: 31,
    48: 32,
  };

  return universalMap[isoNumber] || isoNumber;
};

interface EditToothConditionProps {
  children: React.ReactNode;
  selectedToothHistory: any;
  id: number;
  form: UseFormReturn<ToothHistoryFormValue>;
}

export function EditToothCondition({
  children,
  form,
}: EditToothConditionProps) {
  const [open, setOpen] = useState(false);

  const formatToothTitle = (location: number) => {
    const universalNumber = getUniversalNumber(location);
    const description = getToothDescription(location);
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <LiaToothSolid size={30} />
          <div className="ml-2">
            <div className="font-medium">
              ISO: {location} - Universal: {universalNumber}
            </div>
            <div className="text-sm text-muted-foreground capitalize">
              {description}
            </div>
          </div>
        </div>
      </div>
    );
  };

  async function onSubmit(data: z.infer<typeof ToothHistory>) {
    //get the type of the history_date

    try {
      await updateToothHistory(data);
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
      </SheetContent>
    </Sheet>
  );
}
