"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface AppointmentActionProps {
  aptId: string;
}

interface RescheduleAppointmentProps extends AppointmentActionProps {
  date: string;
  time: string;
}

export async function cancelAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();

  await supabase
    .from("appointments")
    .update({ status: "canceled" })
    .eq("id", aptId);

  revalidatePath("/");
  redirect("/admin");
}

// In "@/app/admin/action"
export async function rescheduleAppointment({
  id,
  date,
  time,
}: {
  id: string;
  date: string;
  time: string;
}) {
  const supabase = createClient();

  await supabase.from("appointments").update({ date, time }).eq("id", id);

  revalidatePath("/");
  redirect("/admin");
}

export async function newAppointment() {
  const supabase = createClient();
  await supabase
    .from("appointments")
    .insert([
      {
        patient_id: "7",
        date: "09/01/2024",
        statu: "1",
        time: "1",
        branch: "1",
      },
    ])
    .select("*");

  revalidatePath("/");
  redirect("/admin");
}
