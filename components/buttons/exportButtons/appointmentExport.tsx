// ExportToCsv.tsx
"use client";
import { AppointmentsCol } from "@/app/schema";
import { useAppointments } from "@/components/hooks/useAppointment";
import { CSVExportButton } from "../csvExport";
import { useSearchParams } from "next/navigation";

export default function AppointmentExport() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const branch = searchParams.get("branches");
  const status = searchParams.get("statuses");
  const { appointments: data } = useAppointments(
    null,
    query,
    branch,
    status,
    null,
    null
  );

  const mappedData = (data?.data || []).map((apt: AppointmentsCol) => ({
    patient_name: apt?.patients?.name || "null",
    appointment_ticket: apt.appointment_ticket || "null",
    branch: apt?.branch?.name || "null",
    status: apt?.status?.name || "null",
    services: apt?.services?.name || "null",
    time_slots: apt.time_slots?.time || "null",
    type: apt.type || "null",
    deleteOn: apt.deleteOn || "null",
  }));

  return <CSVExportButton data={mappedData} filename={"appointments.csv"} />;
}
