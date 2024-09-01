import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const date = req.nextUrl.searchParams.get("date");
  const branch = req.nextUrl.searchParams.get("branch");

  // Call the Supabase function
  let { data, error } = await supabase
    .from("time_slots")
    .select(
      `
      *,
      appointments(*)
    `
    )
    .eq("appointments.date", date)
    .eq("appointments.branch", branch);

  // Check for errors
  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return data
  return NextResponse.json(data);
}
