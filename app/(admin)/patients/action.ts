"use server";
import {
  PatientFormValues,
  PatientSchema,
  UpdatePatientFormValues,
  UpdatePatientSchema,
} from "@/app/types";
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
export async function deletePatient(patientId: number) {
  const supabase = createAdminClient();

  // First, get the user_id from the patient record
  const { data: patient, error: fetchError } = await supabase
    .from("patients")
    .select("user_id")
    .eq("id", patientId)
    .single();

  if (fetchError) {
    console.error("Error fetching patient:", fetchError.message);
    return { error: fetchError };
  }

  if (!patient) {
    console.error("Patient not found");
    return { error: new Error("Patient not found") };
  }

  // If patient has no user_id, just set deleteOn timestamp
  if (!patient.user_id) {
    const { error: updateError } = await supabase
      .from("patients")
      .update({
        deleteOn: new Date().toISOString(),
      })
      .eq("id", patientId);

    if (updateError) {
      console.error("Error updating patient:", updateError.message);
      return { error: updateError };
    }

    return { success: true };
  }

  // Full deletion process for patients with user_id
  // Update patient record with deletion timestamp
  const { error: updateError } = await supabase
    .from("patients")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", patientId);

  if (updateError) {
    console.error("Error updating patient:", updateError.message);
    return { error: updateError };
  }

  // Insert record into deleteuser table using the patient's user_id
  const { data: deleteUserData, error: insertError } = await supabase
    .from("deleteuser")
    .insert({
      uuid: patient.user_id,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error inserting into deleteuser:", insertError.message);
    return { error: insertError };
  }

  // Update patient record to set user_id to null
  const { error: nullifyError } = await supabase
    .from("patients")
    .update({
      user_id: null,
    })
    .eq("id", patientId);

  if (nullifyError) {
    console.error("Error nullifying user_id:", nullifyError.message);
    return { error: nullifyError };
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(
    patient.user_id
  );

  if (deleteError) {
    console.error("Error deleting user from auth:", deleteError.message);
    return { error: deleteError };
  }

  return { success: true };
}
export async function updatePatient(data: UpdatePatientFormValues) {
  const result = UpdatePatientSchema.safeParse(data);

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
