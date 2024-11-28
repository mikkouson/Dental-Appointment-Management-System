// PatientExport.tsx
"use client";
import { PatientCol } from "@/app/schema";
import { usePatients } from "@/components/hooks/usePatient";
import { CSVExportButton } from "../csvExport";
import { useSearchParams } from "next/navigation";

export default function PatientExport() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { patients: data } = usePatients(null, query, null);

  const mappedData = (data?.data || []).map((patient: PatientCol) => ({
    name: patient.name || "null",
    sex: patient.sex || "null",
    email: patient.email || "null",
    // address: patient.address?.toString() || "null", // Convert number to string if needed
    birthdate: patient.dob || "null",
    // age: patient.age?.toString() || "null",
    phone_number: patient.phone_number?.toString() || "null",
  }));

  return <CSVExportButton data={mappedData} filename={"patients.csv"} />;
}
