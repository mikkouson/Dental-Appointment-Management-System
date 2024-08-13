"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
export async function cancelAppointment(aptId) {
  const supabase = createClient();

  const { error } = await supabase
    .from("appointments")
    .update({ status: "canceled" })
    .eq("id", aptId);

  if (error) {
    console.error("Supabase error:", error);
    // Handle error (optional)
  }
}

export async function getAppointments(date) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
    *,
    patients (
      *
    ),
    services (
      *
    )
  `
    )
    .eq("date", date);
  // .in("status", status); // Use .in() for multiple values

  return { data, error };
}
