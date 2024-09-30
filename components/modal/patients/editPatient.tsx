"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { updatePatient } from "@/app/admin/action";
import { PatientCol } from "@/app/schema";
import { PatientSchema } from "@/app/types";
import PatientFields from "@/components/forms/patients/patientFields";
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

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export function EditPatient({ patient }: { patient: PatientCol }) {
  const [open, setOpen] = useState(false);
  // Fetch patient data
  const { data: responseData, error } = useSWR("/api/patients/", fetcher);

  // Extract the array of patients from the response data
  const patients = responseData?.data || [];

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });

  // Use z.infer to derive the type from PatientSchema
  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      id: patient.id || 0,
      name: patient.name || "",
      email: patient.email || "",
      sex: patient.sex || "",
      status: patient.status || "",
      dob: patient.dob ? new Date(patient.dob) : undefined,
      phoneNumber: patient.phone_number || 0,
      address: {
        id: patient.address?.id || 0,
        address: patient.address?.address || "",
        latitude: patient.address?.latitude ?? 0,
        longitude: patient.address?.longitude ?? 0,
      },
    },
  });
  const checkEmailExists = async (email: string): Promise<boolean> => {
    return patients.some((patient: PatientCol) => patient.email === email);
  };
  async function onSubmit(data: z.infer<typeof PatientSchema>) {
    const emailExists = await checkEmailExists(data.email);

    if (emailExists) {
      form.setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      return;
    }
    setOpen(false);
    updatePatient(data);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SquarePen
          className="text-sm w-5 text-green-700 cursor-pointer"
          onClick={() => form.reset()}
        />
      </SheetTrigger>
      <SheetContent
        className="w-[800px]"
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
            Make changes to your profile here. Click save when you’re done.
          </SheetDescription>
        </SheetHeader>
        <PatientFields form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
