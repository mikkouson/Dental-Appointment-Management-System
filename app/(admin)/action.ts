"use server";
import {
  DoctorFormValues,
  DoctorSchema,
  InventoryFormValues,
  InventorySchema,
  ToothHistoryFormValue,
  UpdateUser,
  UpdateUserForm,
  UserForm,
} from "@/app/types";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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
      branch: data.branch,
      category: data.category,
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
    console.error("Validation errors:", result.error.format());
    throw new Error("Validation failed. Please check the input data.");
  }

  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("inventory")
      .update({
        name: data.name,
        quantity: data.quantity,
        description: data.description,
        branch: data.branch,
        category: data.category,
      })
      .eq("id", data.id);

    if (error) {
      console.error("Error updating inventory:", error.message);
      throw new Error("Failed to update inventory. Please try again later.");
    }

    console.log("Inventory updated successfully");
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    throw err; // Re-throwing for further handling upstream
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
      branch: data.branch,
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
      branch: data.branch,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating doctor data:", error.message);
  } else {
    console.log("Doctor data updated successfully");
  }
}
// Define the response type for the upload action
interface UploadServiceImageResponse {
  data: {
    path: string;
  } | null;
  error: Error | null;
}

export async function uploadServiceImage(
  formData: FormData
): Promise<UploadServiceImageResponse> {
  try {
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      throw new Error("No file provided");
    }

    // Get authenticated supabase client with server component
    const supabase = await createClient();

    // Get the current session to ensure user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("services")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL for the uploaded file
    const { data: publicUrl } = supabase.storage
      .from("services")
      .getPublicUrl(filePath);

    return {
      data: {
        path: publicUrl.publicUrl,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
}
