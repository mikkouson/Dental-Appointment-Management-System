"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";

import { newPatient } from "@/app/admin/action";
import { PatientSchema } from "@/app/types";
import PatientFields from "./patientFields";
import { cn } from "@/lib/utils";

export function NewPatientForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      name: "",
      email: "",
      sex: "",
    },
  });

  function onSubmit(data: z.infer<typeof PatientSchema>) {
    setOpen(false);
    newPatient(data);
    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "success",
      description: "Patient added successfully.",
    });
  }

  return <PatientFields form={form} onSubmit={onSubmit} />;
}
