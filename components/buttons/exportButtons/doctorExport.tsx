"use client";
import { DoctorCol } from "@/app/schema";
import { useDoctor } from "@/components/hooks/useDoctor";
import { CSVExportButton } from "../csvExport";
import { useSearchParams } from "next/navigation";

export default function DoctorExport() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { doctors: data } = useDoctor(null, query, null);

  const mappedData = (data?.data || []).map((doctor: any) => ({
    name: doctor.name || "null",
    phone_number: doctor.contact_info || "null",
    email: doctor.email || "null",
  }));

  return <CSVExportButton data={mappedData} filename={"Doctors.csv"} />;
}
