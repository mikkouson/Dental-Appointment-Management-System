"use client";
import { UserCol } from "@/app/schema";
import { useUsers } from "@/components/hooks/useUsers";
import { CSVExportButton } from "../csvExport";
import { useSearchParams } from "next/navigation";

export default function UserExport() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { users: data } = useUsers(null, query, null);

  const mappedData = (data?.data || []).map((users: UserCol) => ({
    name: users.name || "null",
    email: users.email || "null",
  })); 

  return <CSVExportButton data={mappedData} filename={"User.csv"} />;
}
