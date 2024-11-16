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

const resend = new Resend(process.env.RESEND_API_KEY);
interface AppointmentActionProps {
  aptId: number;
}

const schema = z.object({
  id: z.number().optional(),
  service: z.number({
    required_error: "Please select an email to display.",
  }),
  branch: z.number({
    required_error: "Please select an email to display.",
  }),
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  time: z.number({
    required_error: "A date of birth is required.",
  }),
  type: z.string({
    required_error: "A date of birth is required.",
  }),
  status: z.number({
    required_error: "A date of birth is required.",
  }),
});

type Inputs = z.infer<typeof schema>;

interface AddressInput {
  id?: number; // Changed from string to number
  address: string;
  latitude: number;
  longitude: number;
}

interface PatientInput {
  id: number; // Changed from string to number
  name: string;
  email: string;
  sex: string;
  phoneNumber: string;
  dob: string;
  status: string;
  address: AddressInput;
}

// Service Actions

export async function newService(data: ServiceFormValues) {
  const result = ServiceSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.from("services").insert([
    {
      name: data.name,
      description: data.description,
      price: data.price,
    },
  ]);

  if (error) {
    console.error("Error inserting patient:", error.message);
  } else {
    console.log("Patient data inserted successfully");
  }
}

export async function deleteService(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("services")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting patient", error.message);
    throw error; // Throw the error to be handled by the caller
  }
}

export async function updateService(data: ServiceFormValues) {
  const result = ServiceSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Update patient
  const { error } = await supabase
    .from("services")
    .update({
      name: data.name,
      price: data.price,
      description: data.description,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating patient:", error.message);
  } else {
    console.log("Patient data updated successfully");
  }
}

// Inventory Actions

export async function newInventory(data: InventoryFormValues) {
  const result = InventorySchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.from("inventory").insert([
    {
      name: data.name,
      description: data.description,
      quantity: data.quantity,
    },
  ]);

  if (error) {
    console.error("Error inserting patient:", error.message);
  } else {
    console.log("Patient data inserted successfully");
  }
}

export async function updateInventory(data: InventoryFormValues) {
  const result = InventorySchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Update patient
  const { error } = await supabase
    .from("inventory")
    .update({
      name: data.name,
      quantity: data.quantity,
      description: data.description,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating patient:", error.message);
  } else {
    console.log("Patient data updated successfully");
  }
}

export async function deleteInventory(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("inventory")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting patient", error.message);
  }
}

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export async function createNewUser(formData: UserForm) {
  const result = FormSchema.safeParse(formData);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    throw new Error("Validation failed");
  }

  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    user_metadata: { name: formData.name, role: formData.role },
    email_confirm: true, // This confirms the email without needing a timestamp
    role: "authenticated",
  });

  if (error) throw error; // Throw error to be caught in onSubmit

  // Optionally, you can revalidate and redirect after everything is successful
  revalidatePath("/", "layout");
  redirect("/users");
}

export async function deleteUser(id: number) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id.toString());

  if (error) {
    console.log("Error deleting patient", error.message);
  }
}

export async function updateUser(formData: UpdateUserForm) {
  const result = UpdateUser.safeParse(formData);
  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  if (!formData?.id) {
    console.log("User ID is missing.");
    return;
  }

  const supabase = createAdminClient();

  const updateData: {
    email: string;
    password?: string;
    user_metadata?: { name: string; role: string };
  } = {
    email: formData.email,
    user_metadata: { name: formData.name, role: formData.role },
  };

  if (formData.password && formData.password.length > 0) {
    updateData.password = formData.password;
  }

  const { data: user, error } = await supabase.auth.admin.updateUserById(
    formData.id,
    updateData
  );

  if (error) {
    throw new Error(`${error.message}`);
  }

  return user;
}

export async function updateToothHistory(data: ToothHistoryFormValue) {
  // // If no ID is present, create a new record instead
  // if (!data.id) {
  //   return createToothHistory(data);
  // }

  const supabase = createClient();
  const { error } = await supabase
    .from("tooth_history")
    .update({
      ...data,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating tooth history:", error.message);
    // Throw an error to be caught by the calling function
    throw new Error(error.message);
  }

  // Return success response
  return { success: true };
}

export async function createToothHistory(data: ToothHistoryFormValue) {
  const supabase = createClient();
  const { error } = await supabase.from("tooth_history").insert([data]);

  if (error) {
    console.error("Error creating tooth history:", error.message);
    // Throw an error to be caught by the calling function
    throw new Error(error.message);
  }

  // Return success response
  return { success: true };
}

export async function deleteToothHistory(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("tooth_history")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting tooth history", error.message);
    throw new Error(error.message);
  }
}
export async function createMultipleToothHistory(
  data: ToothHistoryFormValue[]
) {
  const supabase = createClient();
  const { error } = await supabase.from("tooth_history").insert(data);

  if (error) {
    console.error("Error creating tooth history records:", error.message);
    throw new Error(error.message);
  }

  return { success: true };
}

// Doctor Actions

export async function newDoctor(data: DoctorFormValues) {
  const result = DoctorSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.from("doctors").insert([
    {
      name: data.name,
      email: data.email,
      contact_info: data.contact_info,
    },
  ]);

  if (error) {
    console.error("Error inserting doctor data:", error.message);
  } else {
    console.log("Doctor data inserted successfully");
  }
}

export async function deleteDoctor(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("doctors")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting doctor data", error.message);
    throw error; // Throw the error to be handled by the caller
  }
}

export async function updateDoctor(data: DoctorFormValues) {
  const result = DoctorSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Update doctor
  const { error } = await supabase
    .from("doctors")
    .update({
      name: data.name,
      email: data.email,
      contact_info: data.contact_info,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating doctor data:", error.message);
  } else {
    console.log("Doctor data updated successfully");
  }
}
