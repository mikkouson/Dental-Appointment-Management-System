// File: /app/api/service/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  const pageParam = req.nextUrl.searchParams.get("page");
  const pageSize = 10; // Define your page size

  // Default to page 1 if no page parameter is provided
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  // Get the filter parameter from the query
  const filterParam = req.nextUrl.searchParams.get("query") || "";

  // Perform the query with sorting by 'updated_at' in descending order
  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .ilike("name", `%${filterParam}%`) // Filter based on 'name' column
    .order("updated_at", { ascending: false }) // Sort by 'updated_at' descending
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}