import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  const supabase = createClient();
  const pageParam = req.nextUrl.searchParams.get("page");
  const statusParam = req.nextUrl.searchParams.get("status");
  const branch = req.nextUrl.searchParams.get("branch"); // Fixed incorrect variable name

  const pageSize = 10; // Example page size

  // Default to page 1 if no page parameter is provided
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  // Get the filter parameter from the query
  const filterParam = req.nextUrl.searchParams.get("query") || "";

  let query = supabase
    .from("appointments")
    .select(
      `
      *,
      patients!inner (
        *
      ),
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
      `,
      { count: "exact" }
    )
    .ilike("patients.name", `%${filterParam}%`) // Example filter for 'name' column
    .is("deleteOn", null);

  // Optional status filter
  if (statusParam) {
    const statusList = statusParam.split(",");
    query = query.in("status", statusList);
  }
  if (branch) {
    query = query.eq("branch", branch);
  }
  if (date) {
    query = query.eq("date", date);
  }

  // Apply range only if pageParam is provided
  if (pageParam) {
    query = query.range((page - 1) * pageSize, page * pageSize - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
