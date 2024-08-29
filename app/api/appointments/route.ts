import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();

  const status = req.nextUrl.searchParams.get("status")?.split(","); // Split by comma
  const date = req.nextUrl.searchParams.get("date");

  if (!status || !date) {
    return NextResponse.json(
      { error: "Missing status or date parameter" },
      { status: 400 }
    );
  }

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
      { count: "exact" }
    )
    .eq("date", date)
    // .eq("branch", 1)
    .in("status", status);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(Appointments);
}
