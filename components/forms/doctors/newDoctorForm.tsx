"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newDoctor } from "@/app/(admin)/action"; // Adjust path as needed
import { DoctorSchema } from "@/app/types";
import DoctorFields from "./doctorField"; // Adjust path as needed
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Doctor } from "@/app/schema"; // Adjust path as needed
import { useDoctor } from "@/components/hooks/useDoctor";// Adjust path as needed

interface NewDoctorFormProps {
  setOpen: (open: boolean) => void;
  mutate: any; // It's better to type this more specifically if possible
}

export function NewDoctorForm({ setOpen, mutate }: NewDoctorFormProps) {
  const { doctors: responseData, doctorError, doctorLoading } = useDoctor();

  // Extract the array of doctors from the response data
  const doctors = responseData?.data || [];

  const form = useForm<z.infer<typeof DoctorSchema>>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const validateEmail = async (email: string): Promise<boolean> => {
    const trimmedEmail = email.trim();
    return doctors.some(
      (doctor: Doctor | null) => doctor?.email?.trim() === trimmedEmail
    );
  };

  async function onSubmit(data: z.infer<typeof DoctorSchema>) {
    const emailExists = await validateEmail(data.email);

    if (emailExists) {
      form.setError("email", {
        type: "manual",
        message: "Doctor with this email already exists",
      });
      return;
    }

    // Optimistically update the UI without assigning a temporary id
    const newItem = data;

    interface DoctorData {
      data: Doctor[];
      count: number;
    }

    mutate(
      (currentData: DoctorData) => ({
        data: [newItem, ...currentData.data],
        count: currentData.count + 1,
      }),
      false // Do not revalidate yet
    );

    setOpen(false); // Close the modal

    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "success",
      description: "Doctor added successfully.",
      duration: 2000,
    });

    try {
      await newDoctor(data);

      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to add doctor: ${error.message}`,
        duration: 2000,
      });
    }
  }

  return <DoctorFields form={form} onSubmit={onSubmit} />;
}
