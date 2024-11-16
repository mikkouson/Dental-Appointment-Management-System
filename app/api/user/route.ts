// File: /app/api/service/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  const user = req.nextUrl.searchParams.get("user");
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, error });
}
