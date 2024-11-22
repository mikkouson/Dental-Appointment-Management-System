"use server";
import {
  DoctorFormValues,
  DoctorSchema,
  InventoryFormValues,
  InventorySchema,
  PatientFormValues,
  PatientSchema,
  ServiceFormValues,
  ServiceSchema,
  ToothHistoryFormValue,
  UpdateInventoryFormValues,
  UpdateInventorySchema,
  UpdateUser,
  UpdateUserForm,
  UserForm,
} from "@/app/types";
import DentalAppointmentCancellationEmail from "@/components/emailTemplates/cancelAppointment";
import DentalAppointmentEmail from "@/components/emailTemplates/newAppointment";
import DentalAppointmentPendingEmail from "@/components/emailTemplates/pendingAppointment";
import DentalAppointmentRejectionEmail from "@/components/emailTemplates/rejectAppointment";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as React from "react";
import { Resend } from "resend";
import { z } from "zod";
import { createMultipleToothHistory } from "../action";

type patientInput = z.infer<typeof PatientSchema>;

export async function newPatient(data: patientInput, teethLocations?: any) {
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    const validationErrors = result.error.format();
    console.log("Validation errors:", validationErrors);
    throw new Error("Validation errors occurred.");
  }

  const supabase = createClient();

  // Step 1: Insert address and get the ID
  const { data: addressData, error: addressError } = await supabase
    .from("addresses")
    .insert([
      {
        address: data.address.address,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      },
    ])
    .select("id")
    .single();

  if (addressError || !addressData) {
    const errorMessage = addressError
      ? addressError.message
      : "Failed to insert address.";
    throw new Error(`Error inserting address: ${errorMessage}`);
  }

  const addressId = addressData.id;

  // Step 2: Insert patient with the address ID and get the patient ID
  const { data: patientData, error: patientError } = await supabase
    .from("patients")
    .insert([
      {
        name: data.name,
        email: data.email,
        sex: data.sex,
        address: addressId,
        phone_number: data.phoneNumber,
        dob: data.dob,
        status: data.status,
      },
    ])
    .select("id")
    .single();

  if (patientError) {
    throw new Error(`Error inserting patient: ${patientError.message}`);
  }

  // Step 3: Create tooth history records if teethLocations are provided
  // Step 3: If teethLocations are provided, call createMultipleToothHistory
  if (teethLocations && teethLocations.length > 0) {
    const toothHistoryData = teethLocations.map((location: any) => ({
      tooth_location: location.tooth_location,
      tooth_condition: location.tooth_condition,
      tooth_history: location.tooth_history,
      history_date: new Date(),
      patient_id: patientData.id,
    }));

    try {
      await createMultipleToothHistory(toothHistoryData);
    } catch (error) {
      console.error("Error creating multiple tooth history records:", error);
      // Continue execution even if tooth history creation fails
    }
  }
  console.log("Patient data inserted successfully");
  revalidatePath("/", "layout");
  redirect(`/patients/${patientData.id}`);
}

export async function deletePatient(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("patients")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting patient", error.message);
  }
}

export async function updatePatient(data: PatientFormValues) {
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Handle address update or creation
  let addressId: number; // Changed from string to number

  if (data.address.id) {
    // Update existing address
    const { error: addressError } = await supabase
      .from("addresses")
      .update({
        address: data.address.address,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      })
      .eq("id", data.address.id);

    if (addressError) {
      console.error("Error updating address:", addressError.message);
      return;
    }
    addressId = data.address.id;
  } else {
    // Create new address
    const { data: newAddress, error: createError } = await supabase
      .from("addresses")
      .insert({
        address: data.address.address,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating address:", createError.message);
      return;
    }

    addressId = newAddress.id;
  }

  // Update patient with potentially new address ID
  const { error: patientError } = await supabase
    .from("patients")
    .update({
      name: data.name,
      email: data.email,
      sex: data.sex,
      phone_number: data.phoneNumber,
      dob: data.dob,
      status: data.status,
      address: addressId,
    })
    .eq("id", data.id);

  if (patientError) {
    console.error("Error updating patient:", patientError.message);
  } else {
    console.log("Patient data updated successfully");
  }
}

export async function uploadImage(patientId: string, formData: FormData) {
  const supabase = createClient();
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${patientId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("patients")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Error uploading image: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("patients").getPublicUrl(filePath);

  revalidatePath(`/patients/${patientId}`);

  return {
    url: publicUrl,
    path: filePath,
  };
}
