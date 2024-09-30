"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newPatient } from "@/app/admin/action";
import { PatientSchema, PatientFormValues } from "@/app/types";
import PatientFields from "./patientFields";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { PatientCol } from "@/app/schema";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export function NewPatientForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  // Fetch patient data
  const { data: responseData, error } = useSWR("/api/patients/", fetcher);

  // Extract the array of patients from the response data
  const patients = responseData?.data || [];

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
  const checkEmailExists = async (email: string): Promise<boolean> => {
    return patients.some((patient: PatientCol) => patient.email === email);
  };

  async function onSubmit(data: PatientFormValues) {
    // Check if email already exists in fetched data
    const emailExists = await checkEmailExists(data.email);

    if (emailExists) {
      form.setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      return;
    }

    newPatient(data);

    setOpen(false);

    form.reset();
  }

  return <PatientFields form={form} onSubmit={onSubmit} />;
}
