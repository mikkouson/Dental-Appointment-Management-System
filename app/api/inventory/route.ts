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

  // Get sorting parameters
  const sortBy = req.nextUrl.searchParams.get("sortBy") || "updated_at"; // Default sort column
  const sortOrder =
    req.nextUrl.searchParams.get("sortOrder") === "asc" ? true : false; // true for ascending, false for descending

  // Validate sortBy to prevent SQL injection or invalid columns
  const validSortColumns = ["name", "created_at", "updated_at"]; // Add other valid columns as needed
  if (!validSortColumns.includes(sortBy)) {
    return NextResponse.json(
      { error: "Invalid sort column." },
      { status: 400 }
    );
  }

  // Perform the query with dynamic sorting
  const { data, error, count } = await supabase
    .from("inventory")
    .select("*", { count: "exact" })
    .ilike("name", `%${filterParam}%`) // Filter based on 'name' column
    .order(sortBy, { ascending: sortOrder })
    .range((page - 1) * pageSize, page * pageSize - 1)
    .is("deleteOn", null); // Exclude soft-deleted items

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
