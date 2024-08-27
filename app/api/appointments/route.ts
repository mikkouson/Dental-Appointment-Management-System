import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();

  // Extract query parameters
  const status = req.nextUrl.searchParams.get("status")?.split(","); // Split by comma
  const date = req.nextUrl.searchParams.get("date");

  // Check if both parameters are provided
  if (!status || !date) {
    return NextResponse.json(
      { error: "Missing status or date parameter" },
      { status: 400 }
    );
  }

  // Query Supabase
  const { data: Appointments, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patients (
        *
      ),
      services (
        *
      ),
      time_slots (
        *
      )
    `,
      { count: "exact" } // Correctly placed count option
    )
    .eq("date", date)
    .in("status", status); // Use .in() for multiple values

  // Check for errors
  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log(Appointments);
  // Return data
  return NextResponse.json(Appointments);
}
