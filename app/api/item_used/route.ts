import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  const branchParam = req.nextUrl.searchParams.get("branch");
  const filterParam = req.nextUrl.searchParams.get("query");

  let query = supabase
    .from("items_used")
    .select(
      `
      *,
      inventory!inner (name, branch),
      appointments (
        *, services (name), branch (name)
      )
      `
    )
    .ilike("inventory.name", `%${filterParam}%`); // Changed to filter on inventory.name

  // .is("deleteOn", null);

  if (branchParam) {
    const branchList = branchParam.split(",").map((id) => parseInt(id, 10));
    query = query.in("inventory.branch", branchList);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
