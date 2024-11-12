"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newPatient } from "@/app/(admin)/action";
import { PatientSchema, PatientFormValues } from "@/app/types";
import PatientFields from "./patientFields";
import { cn } from "@/lib/utils";
import useSWR, { mutate as globalMutate } from "swr";
import { Patient, PatientCol } from "@/app/schema";
import { toast } from "@/components/hooks/use-toast";
import { usePatients } from "@/components/hooks/usePatient";
import TeethChart from "@/components/teeth-permanent";
import { useTeethArray } from "@/app/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToothHistoryCard from "@/components/cards/toothHistoryCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewPatientFormProps {
  setOpen: (open: boolean) => void;
  mutate: (
    data?: any | Promise<any> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<any>; // More specific typing can be applied based on your mutate usage
}

export function NewPatientForm({ setOpen, mutate }: NewPatientFormProps) {
  // Fetch patient data
  const {
    patients: responseData,
    patientError,
    patientLoading,
  } = usePatients();
  if (patientError) {
    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "destructive",
      description: `Failed to load patients: ${patientError.message}`,
      duration: 2000,
    });
  }

  // Extract the array of patients from the response data
  const patients: PatientCol[] = responseData?.data || [];

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      name: "",
      email: "",
      sex: "",
    },
  });

  // Function to check if email already exists
  const checkEmailExists = (email: string): boolean => {
    return patients.some((patient: PatientCol) => patient.email === email);
  };
  const { teethLocations } = useTeethArray();

  async function onSubmit(data: PatientFormValues) {
    // Check if email already exists in fetched data
    const emailExists = checkEmailExists(data.email);

    if (emailExists) {
      form.setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      return;
    }

    // Optimistically update the UI without assigning a temporary id
    const newItem = data; // Use the new data directly

    interface PatientData {
      data: Patient[];
      count: number;
    }

    mutate(
      (currentData: PatientData) => ({
        data: [newItem, ...currentData.data],
        count: currentData.count + 1,
      }),
      false // Do not revalidate yet
    );

    // setOpen(false); // Close the modal

    try {
      await newPatient(data, teethLocations); // Ensure this function returns a promise
      // Show success toast immediately
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Patient added successfully.",
        duration: 2000,
      });

      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();

      // Show error toast below the success message
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to add patient: ${error.message}`,
        duration: 2000,
      });
    }
  }

  return (
    <>
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Patient Info</TabsTrigger>
          <TabsTrigger value="teeth">Teeth Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <PatientFields form={form} onSubmit={onSubmit} />
        </TabsContent>
        <TabsContent value="teeth" className="flex gap-6 ">
          <div className="flex justify-center items-center">
            <TeethChart history={[]} newPatient={true} />
          </div>
          {/* {teethLocations.map((tooth) => (
            <ToothHistoryCard
              key={tooth.tooth_location}
              treatments={tooth.treatments}
              edit={true}
            />
          ))} */}

          {teethLocations.length === 0 ? (
            <div className="flex justify-center items-center w-full text-muted-foreground">
              No treatment history. Click a tooth to add treatment history.{" "}
            </div>
          ) : (
            <ScrollArea className="h-[200px] w-full">
              <ToothHistoryCard edit={true} treatments={teethLocations} />
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
