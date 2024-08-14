"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import moment from "moment";
export async function cancelAppointment(aptId) {
  const supabase = createClient();

  await supabase
    .from("appointments")
    .update({ status: "canceled" })
    .eq("id", aptId);

  revalidatePath("/");
  redirect("/admin");
}
// export async function rescheduleAppointment(formData: FormData) {
//   const supabase = createClient();
//   const time = formData.get("time") as string;
//   const date = formData.get("date") as string;
//   const id = formData.get("id") as string;

//   // Formatting the time (assuming the time is in HH:mm format)
//   const formattedTime = moment(time, "HH:mm").format("hh:mm A");
//   // const time = formData.get("time");
//   await supabase
//     .from("appointments")
//     .update({ date: date, time: formattedTime })
//     .eq("id", id);

//   revalidatePath("/");
//   redirect("/admin");
// }

export async function rescheduleAppointment(aptId, date, time) {
  const supabase = createClient();
  // const time = formData.get("time");
  await supabase
    .from("appointments")
    .update({ date: date, time: time })
    .eq("id", aptId);

  revalidatePath("/");
  redirect("/admin");
}

export async function tryA(formData: FormData) {
  const time = formData.get("time") as string;
  const date = formData.get("date") as string;
  const id = formData.get("id") as string;

  // Formatting the time (assuming the time is in HH:mm format)
  const formattedTime = moment(time, "HH:mm").format("hh:mm A");

  console.log("Formatted Time:", formattedTime);
  console.log("Date:", date);
  console.log("ID:", id);
}
