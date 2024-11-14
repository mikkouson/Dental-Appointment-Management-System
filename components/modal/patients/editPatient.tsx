"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updatePatient } from "@/app/(admin)/action";
import { PatientCol } from "@/app/schema";
import { PatientSchema } from "@/app/types";
import PatientFields from "@/components/forms/patients/patientFields";
import { toast } from "@/components/hooks/use-toast";
import { usePatients } from "@/components/hooks/usePatient";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";

type EditPatientProps = {
  patient: PatientCol;
  mutate: any;
};
export function EditPatient({ patient, mutate }: EditPatientProps) {
  const [open, setOpen] = useState(false);
  // Fetch patient data
  const {
    patients: responseData,
    patientError,
    patientLoading,
  } = usePatients();
  // Extract the array of patients from the response data
  const patients = responseData?.data || [];

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });

  // Use z.infer to derive the type from PatientSchema
  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
  });

  const set = () => {
    form.setValue("id", patient.id ?? 0);
    form.setValue("name", patient.name ?? "");
    form.setValue("email", patient.email ?? "");
    form.setValue("sex", patient.sex ?? "");
    form.setValue("status", patient.status ?? "");
    form.setValue("dob", patient.dob ? new Date(patient.dob) : new Date());
    form.setValue("phoneNumber", patient.phone_number ?? 0);
    form.setValue("address.id", patient.address?.id ?? 0);
    form.setValue("address.address", patient.address?.address ?? "");
    form.setValue("address.latitude", patient.address?.latitude ?? 0);
    form.setValue("address.longitude", patient.address?.longitude ?? 0);
  };
  async function checkEmailExists(email: string): Promise<boolean> {
    // Filter out the current patient from patients array
    const filteredPatients = patients.filter(
      (p: PatientCol) => p.id !== patient.id
    );
    return filteredPatients.some((p: PatientCol) => p.email === email);
  }
  // async function onSubmit(data: z.infer<typeof PatientSchema>) {
  //   const emailExists = await checkEmailExists(data.email);

  //   if (emailExists) {
  //     form.setError("email", {
  //       type: "manual",
  //       message: "Email already exists",
  //     });
  //     return;
  //   }
  //   setOpen(false);
  //   updatePatient(data);
  //   // Optional: Display toast message
  //   // toast({
  //   //   title: "You submitted the following values:",
  //   //   description: (
  //   //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //   //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //   //     </pre>
  //   //   ),
  //   // });
  // }

  async function onSubmit(formData: z.infer<typeof PatientSchema>) {
    const emailExists = await checkEmailExists(formData.email);

    if (emailExists) {
      form.setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      return;
    }

    // Prepare the updated inventory item
    const updatedItem: any = {
      ...patient,
      ...formData,
      updated_at: new Date().toISOString(),
    };

    // Optimistically update the UI
    mutate(
      (currentData: { data: PatientCol[]; count: number }) => {
        let updatedData = currentData.data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );

        updatedData = updatedData.sort((a, b) => {
          return (
            new Date(b.updated_at ?? "").getTime() -
            new Date(a.updated_at ?? "").getTime()
          );
        });

        return { ...currentData, data: updatedData };
      },
      false // Do not revalidate yet
    );

    setOpen(false); // Close the modal

    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "success",
      description: "Inventory item updated successfully.",
      duration: 2000,
    });

    try {
      await updatePatient(formData); // Make sure this function returns a promise

      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to update inventory item: ${error.message}`,
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
        <SquarePen
          className="text-sm w-5 text-green-700 cursor-pointer"
          onClick={() => set()}
        />
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
          <SheetTitle>Edit Patients</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you’re done.
          </SheetDescription>
        </SheetHeader>
        <PatientFields form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
