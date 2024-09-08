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
  patient: z.string({
    invalid_type_error: "Invalid patient",
  }),
  service: z.string({
    invalid_type_error: "Invalid service",
  }),
  branch: z.string({
    invalid_type_error: "Invalid branch",
  }),
  date: z.date({
    invalid_type_error: "Invalid date of birth",
  }),
  time: z.number({
    invalid_type_error: "Invalid time",
  }),
  type: z.string({
    invalid_type_error: "Invalid time",
  }),
});

const schemas = z.object({
  time: z.number({
    invalid_type_error: "Invalid time",
  }),
  date: z
    .date({
      invalid_type_error: "Invalid time",
    })
    .transform((date) => moment(date, "YYYY-MM-DD").toDate()),
  id: z.number({
    invalid_type_error: "Invalid time",
  }),
});

type Inputs = z.infer<typeof schema>;
type Inputz = z.infer<typeof schemas>;

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
export async function rescheduleAppointment(data: Inputz) {
  const result = schemas.safeParse(data);
  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Adjust date and time formats as necessary
  const formattedDate = moment(data.date).format("YYYY-MM-DD"); // Adjust format as needed

  const { error } = await supabase
    .from("appointments")
    .update({
      date: formattedDate,
      time: data.time, // Adjust format as needed
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

  // Insert data into Supabase
  const { error } = await supabase.from("appointments").insert([
    {
      patient_id: data.patient,
      service: data.service,
      branch: data.branch,
      date: moment(data.date).format("MM/DD/YYYY"), // Convert date to ISO string if needed
      time: data.time,
      status: "1", // Assuming default status
      type: data.type,
    },
  ]);

  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    console.log("Data inserted successfully");
  }
}
