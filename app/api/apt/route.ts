import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const date = req.nextUrl.searchParams.get("date");
  const pageParam = req.nextUrl.searchParams.get("page");
  const statusParam = req.nextUrl.searchParams.get("statuses");
  const branchParam = req.nextUrl.searchParams.get("branch");
  const limitParam = req.nextUrl.searchParams.get("limit");
  const dateRangeStart = req.nextUrl.searchParams.get("dateRangeStart");
  const dateRangeEnd = req.nextUrl.searchParams.get("dateRangeEnd");

  const limit = limitParam ? parseInt(limitParam, 10) : 10;
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const filterParam = req.nextUrl.searchParams.get("query") || "";

  let query = supabase
    .from("appointments")
    .select(
      `
      *,
      patients!inner (*),
      services (*),
      time_slots (*),
      status (*),
      branch (*)
      `,
      { count: "exact" }
    )
    .ilike("patients.name", `%${filterParam}%`)
    .is("patients.deleteOn", null)
    .order("updated_at", { ascending: false });

  if (statusParam) {
    const statusList = statusParam.split(",").map((id) => parseInt(id, 10));
    query = query.in("status", statusList);
  }

  if (branchParam) {
    const branchList = branchParam.split(",").map((id) => parseInt(id, 10));
    query = query.in("branch", branchList);
  }

  if (date) {
    query = query.eq("date", date);
  }

  // Apply date range filter if provided
  if (dateRangeStart && dateRangeEnd) {
    query = query.gte("date", dateRangeStart).lte("date", dateRangeEnd);
  }

  if (pageParam) {
    query = query.range((page - 1) * limit, page * limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
