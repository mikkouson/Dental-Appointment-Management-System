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
import { getToothDescription } from "@/components/ui/tooth-description";
import { cn } from "@/lib/utils";
import { useForm, UseFormReturn } from "react-hook-form";
import { LiaToothSolid } from "react-icons/lia";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

export function EditToothCondition({
  treatment,
  form,
}: {
  treatment: any;
  form: UseFormReturn<ToothHistoryFormValue>;
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    form.reset();

    if (treatment?.history_date) {
      form.setValue(
        "history_date",
        new Date(treatment.history_date) || new Date()
      );
    }

    form.setValue("id", treatment?.id || undefined);
    form.setValue("tooth_location", Number(treatment.tooth_location) || 0);
    form.setValue("tooth_condition", treatment?.tooth_condition || "");
    form.setValue("tooth_history", treatment?.tooth_history || "");
    form.setValue("patient_id", Number(treatment.patient_id) || 0);
  };
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-full text-left justify-start"
          onClick={() => handleClick()}
        >
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full md:w-[400px] overflow-auto">
        <SheetHeader>
          <SheetTitle>Tooth History</SheetTitle>
          <Separator className="my-2" />

          <div className="font-thin italic">
            {formatToothTitle(treatment.tooth_location)}
          </div>
        </SheetHeader>
        <Separator className="my-2" />
        <ToothConditionFields form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
