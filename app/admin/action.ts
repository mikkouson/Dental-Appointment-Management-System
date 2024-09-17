"use server";

import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
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

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email().min(1, {
    message: "Invalid email address.",
  }),
  address: z
    .object({
      address: z.string({
        required_error: "Address is required.",
      }),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .refine((data) => data.address.trim().length > 0, {
      message: "Address must be provided.",
    }),
  sex: z.string().min(1, { message: "Sex is required." }),
  age: z.number().min(1, {
    message: "Age is required.",
  }),
});

type patientInput = z.infer<typeof FormSchema>;

export async function cancelAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();

  await supabase.from("appointments").update({ status: 3 }).eq("id", aptId);

  revalidatePath("/");
  redirect("/admin/appointments");
}

export async function rescheduleAppointment(data: Inputs) {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }
  const supabase = createClient();
  const formattedDate = moment(data.date).format("YYYY-MM-DD");

  const { error } = await supabase
    .from("appointments")
    .update({
      service: data.service,
      branch: data.branch,
      date: moment(data.date).format("MM/DD/YYYY"),
      time: data.time,
      status: data.status,
      type: data.type,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating appointment:", error.message);
    return;
  }

  revalidatePath("/");
  redirect("/admin/appointments");
}

export async function newApp(data: Inputs) {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.from("appointments").insert([
    {
      patient_id: data.id,
      service: data.service,
      branch: data.branch,
      date: moment(data.date).format("MM/DD/YYYY"),
      time: data.time,
      status: data.status,
      type: data.type,
    },
  ]);

  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    console.log("Data inserted successfully");
  }
}

export async function newPatient(data: patientInput) {
  const result = FormSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
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
    .select("id") // Select the id of the newly inserted address
    .single();

  if (addressError || !addressData) {
    console.error("Error inserting address:", addressError?.message);
    return;
  }

  const addressId = addressData.id;

  // Step 2: Insert patient with the address ID
  const { error: patientError } = await supabase.from("patients").insert([
    {
      name: data.name,
      email: data.email,
      sex: data.sex,
      age: data.age,
      address: addressId, // Use the address ID from the previous step
    },
  ]);

  if (patientError) {
    console.error("Error inserting patient:", patientError.message);
  } else {
    console.log("Patient data inserted successfully");
  }
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
