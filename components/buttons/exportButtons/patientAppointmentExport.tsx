"use client";
import { AppointmentsCol } from "@/app/schema";
import { useAppointments } from "@/components/hooks/useAppointment";
import { CSVExportButton } from "../csvExport";
import { useSearchParams } from "next/navigation";

interface PatientAppointmentExportProps {
  data: AppointmentsCol[]; // Define the type for the incoming data
}

export default function PatientAppointmentExport({
  data,
}: PatientAppointmentExportProps) {
  // Destructure props correctly
  const mappedData = (data || []).map((apt) => ({
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
