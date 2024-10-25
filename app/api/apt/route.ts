import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  const supabase = createClient();
  const pageParam = req.nextUrl.searchParams.get("page");
  const statusParam = req.nextUrl.searchParams.get("statuses");
  const branchParam = req.nextUrl.searchParams.get("branch"); // Fixed variable name

  const pageSize = 10; // Define your desired page size

  // Default to page 1 if no page parameter is provided
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  // Get the search query parameter (e.g., patient name)
  const filterParam = req.nextUrl.searchParams.get("query") || "";

  // Initialize the Supabase query
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
    .ilike("patients.name", `%${filterParam}%`) // Filter by patient name
    .is("patients.deleteOn", null) // Exclude soft-deleted patients
    .order("updated_at", { ascending: false }); // Sort by latest updated

  // Apply status filter if provided
  if (statusParam) {
    const statusList = statusParam.split(",").map((id) => parseInt(id, 10)); // Convert status to an array of numbers
    query = query.in("status", statusList);
  }

  // Apply branch filter if provided
  if (branchParam) {
    const branchList = branchParam.split(",").map((id) => parseInt(id, 10)); // Convert branch to an array of numbers
    query = query.in("branch", branchList);
  }

  // Apply date filter if provided
  if (date) {
    query = query.eq("date", date);
  }

  // Apply pagination if page parameter is present
  if (pageParam) {
    query = query.range((page - 1) * pageSize, page * pageSize - 1);
  }

  // Execute the query
  const { data, error, count } = await query;

  // Handle errors
  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return the data and total count
  return NextResponse.json({ data, count });
}
