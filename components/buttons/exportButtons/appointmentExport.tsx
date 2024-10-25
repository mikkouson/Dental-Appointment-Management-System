// ExportToCsv.tsx
"use client";
import { AppointmentsCol } from "@/app/schema";
import { useAppointments } from "@/components/hooks/useAppointment";
import { CSVExportButton } from "../csvExport";

export default function AppointmentExport() {
  const { appointments: data } = useAppointments();

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
