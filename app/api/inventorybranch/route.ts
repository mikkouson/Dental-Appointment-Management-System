import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const pageParam = req.nextUrl.searchParams.get("page");
  const branchParam = req.nextUrl.searchParams.get("branch");
  const filterParam = req.nextUrl.searchParams.get("query") || "";

  const sortBy = req.nextUrl.searchParams.get("sortBy") || "updated_at";
  const sortOrder =
    req.nextUrl.searchParams.get("sortOrder") === "asc" ? true : false;

  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10; // Default to 10 if no limit is provided

  // Default to page 1 if no page parameter is provided
  const page = pageParam ? parseInt(pageParam, 10) : 1;

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
    .ilike("name", `%${filterParam}%`)
    .order(sortBy, { ascending: sortOrder })
    .is("deleteOn", null);

  if (branchParam) {
    const branchList = branchParam.split(",").map((id) => parseInt(id, 10));
    query = query.in("branch", branchList);
  }
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
