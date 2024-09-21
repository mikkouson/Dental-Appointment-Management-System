import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { data: Patient, error } = await supabase
    .from("patients")
    .select(
      `
      *,
       address (
      *
    ),
      appointments (
        *,
        services (
          *
        ),
        time_slots (
          *
        ),
        status (
          *
        ),
            branch (
          *
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(Patient);
}
