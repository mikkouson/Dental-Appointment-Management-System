"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";

import { newPatient } from "@/app/admin/action";
import { PatientSchema } from "@/app/types";
import PatientFields from "./patients/patientFields";

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
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return <PatientFields form={form} onSubmit={onSubmit} />;
}
