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
