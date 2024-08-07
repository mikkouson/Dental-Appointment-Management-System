import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  console.log(req.nextUrl.searchParams.get("date"));

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patients (
        *
      ),
       services (
        *
      )
    `
    )
    .eq("date", req.nextUrl.searchParams.get("date"));

  return NextResponse.json(data);
}
