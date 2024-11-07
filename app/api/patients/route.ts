import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  const pageParam = req.nextUrl.searchParams.get("page");
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10; // Default to 10 if no limit is provided

  // Default to page 1 if no page parameter is provided
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  // Get the filter parameter from the query
  const filterParam = req.nextUrl.searchParams.get("query") || "";

  const query = supabase
    .from("patients")
    .select(
      `*,
       address (
         *
       ),
       appointments (
         *
       )`,
      { count: "exact" }
    )
    .ilike("name", `%${filterParam}%`) // Example filter for 'name' column
    .order("updated_at", { ascending: false }) // Sort by 'updated_at' descending
    .is("deleteOn", null); // Exclude soft-deleted items

  // Apply pagination if page parameter is present
  if (pageParam) {
    query.range((page - 1) * limit, page * limit - 1);
  }
  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
