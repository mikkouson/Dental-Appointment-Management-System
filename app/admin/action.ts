"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
export async function cancelAppointment(aptId) {
  const supabase = createClient();

  await supabase
    .from("appointments")
    .update({ status: "canceled" })
    .eq("id", aptId);

  revalidatePath("/");
  redirect("/admin");
}
