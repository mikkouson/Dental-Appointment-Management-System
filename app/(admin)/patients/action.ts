"use server";
import { PatientFormValues, PatientSchema } from "@/app/types";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createMultipleToothHistory } from "../action";

export async function newPatient(
  data: PatientFormValues,
  teethLocations?: any
) {
  if (!data) throw new Error("Form data is required");

  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    throw new Error("Validation failed");
  }

  const supabase = createAdminClient();

  // Step 1: Create user with Supabase Auth - this will trigger patient creation
  const { data: userData, error: userError } =
    await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      user_metadata: {
        name: data.name,
        role: "patient",
        address: {
          address: data.address.address,
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        },
        phoneNumber: data.phoneNumber,
        email: data.email,
        sex: data.sex,
        dob: data.dob,
        status: data.status,
      },
      email_confirm: true,
      role: "authenticated",
    });

  if (userError) {
    if (userError.message.includes("duplicate"))
      throw new Error("User already exists");
    if (userError.message.includes("invalid_email"))
      throw new Error("Invalid email");
    if (userError.message.includes("weak_password"))
      throw new Error("Password too weak");
    throw userError;
  }

  if (!userData?.user) throw new Error("Failed to create user");

  // Step 2: Get the patient ID that was created by the trigger
  const { data: patientData, error: patientError } = await supabase
    .from("patients")
    .select("id")
    .eq("user_id", userData.user.id)
    .single();

  if (patientError || !patientData) {
    throw new Error("Failed to retrieve patient record");
  }

  // Step 3: Create tooth history records if teethLocations are provided
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
      // Consider implementing a cleanup mechanism here
    }
  }

  console.log("Patient created successfully with auth and tooth history");
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
