"use server";
import { ServiceFormValues, ServiceSchema } from "@/app/types";
import { createClient } from "@/utils/supabase/server";

// Service Actions
export async function newService(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const image = formData.get("image") as File;

  const data = {
    name,
    description,
    price,
    image,
  };

  const result = ServiceSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();
  let imageUrl: string | null = null;

  // If we have an image, upload it first
  if (image && image.size > 0) {
    // Generate a unique filename using timestamp and original extension
    const fileExtension = image.name.split(".").pop() || "jpg"; // Provide fallback extension
    const timestamp = new Date().getTime();
    const fileName = `service_${timestamp}.${fileExtension}`;

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("services")
      .upload(fileName, image);

    if (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      return;
    }

    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from("services")
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      console.error("Failed to get public URL for uploaded image");
      // Clean up the uploaded file since we couldn't get its URL
      await supabase.storage.from("services").remove([fileName]);
      return;
    }

    imageUrl = urlData.publicUrl;
  }

  // Insert service data with image URL if available
  const { data: newService, error } = await supabase
    .from("services")
    .insert([
      {
        name: data.name,
        description: data.description,
        price: data.price,
        service_url: imageUrl, // Include the image URL in the initial insert
      },
    ])
    .select()
    .single();

  if (error) {
    // If service creation fails, we should clean up the uploaded image
    if (imageUrl) {
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        await supabase.storage.from("services").remove([fileName]);
      }
    }
    console.error("Error inserting service:", error.message);
    return;
  }

  console.log("Service and image uploaded successfully");
  return newService;
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

export async function updateService(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const image = formData.get("image") as File;

  const data = {
    id,
    name,
    description,
    price,
    image,
  };

  const result = ServiceSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();
  let imageUrl: string | null = null;

  // Only process image if a new one is provided
  if (image && image.size > 0) {
    const fileExtension = image.name.split(".").pop() || "jpg";
    const timestamp = new Date().getTime();
    const fileName = `service_${timestamp}.${fileExtension}`;

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("services")
      .upload(fileName, image);

    if (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("services")
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      console.error("Failed to get public URL for uploaded image");
      await supabase.storage.from("services").remove([fileName]);
      return;
    }

    imageUrl = urlData.publicUrl;
  }

  // Create update object with required fields
  const updateObject: {
    name: string;
    price: number;
    description: string;
    service_url?: string | null;
  } = {
    name: data.name,
    price: data.price,
    description: data.description,
  };

  // Only include service_url in update if a new image was uploaded
  if (imageUrl !== null) {
    updateObject.service_url = imageUrl;
  }

  // Update service with conditional fields
  const { data: updateService, error } = await supabase
    .from("services")
    .update(updateObject)
    .eq("id", data.id);

  if (error) {
    // Clean up the uploaded image if service update fails
    if (imageUrl) {
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        await supabase.storage.from("services").remove([fileName]);
      }
    }
    console.error("Error updating service:", error.message);
    return;
  }

  console.log("Service updated successfully");
  return updateService;
}
