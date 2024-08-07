import { createClient } from "@/utils/supabase/server";

export async function getAppointments(date) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select()
    .eq("date", date);
  return { data };
}
