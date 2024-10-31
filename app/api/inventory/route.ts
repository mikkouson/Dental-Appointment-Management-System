import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  
  // Get query parameters
  const pageParam = req.nextUrl.searchParams.get("page");
  const limitParam = req.nextUrl.searchParams.get("limit");
  const branchParam = req.nextUrl.searchParams.get("branch");
  const filterParam = req.nextUrl.searchParams.get("query") || "";
  const sortBy = req.nextUrl.searchParams.get("sortBy") || "updated_at";
  const sortOrder = req.nextUrl.searchParams.get("sortOrder") === "asc";

  // Set defaults
  const limit = limitParam ? parseInt(limitParam, 10) : 10; // Default limit
  const page = pageParam ? parseInt(pageParam, 10) : 1; // Default to page 1
  
  // Validate sortBy to prevent SQL injection or invalid columns
  const validSortColumns = ["name", "created_at", "updated_at"]; // Add other valid columns as needed
  if (!validSortColumns.includes(sortBy)) {
    return NextResponse.json(
      { error: "Invalid sort column." },
      { status: 400 }
    );
  }

  // Build the query
  let query = supabase
    .from("inventory")
    .select(
      `
      *,
      branch (
        *
      )
      `,
      { count: "exact" }
    )
    .ilike("name", `%${filterParam}%`) // Filter based on 'name' column
    .order(sortBy, { ascending: sortOrder })
    .is("deleteOn", null); // Exclude soft-deleted items

  // Apply branch filtering if provided
  if (branchParam) {
    const branchList = branchParam.split(",").map((id) => parseInt(id, 10));
    query = query.in("branch", branchList);
  }

  // Apply pagination
  if (pageParam) {
    query.range((page - 1) * limit, page * limit - 1);
  }

  // Execute the query
  const { data, error, count } = await query;

  // Handle errors
  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
