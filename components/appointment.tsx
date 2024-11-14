"use client";
import AppointmentsMap from "@/components/appointmentsList";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAppointments } from "./hooks/useAppointment";
import PageContainer from "./layout/page-container";

const timeSlots = [
  { id: 3, time: "10:00 AM" },
  { id: 4, time: "11:00 AM" },
  { id: 5, time: "12:00 PM" },
  { id: 6, time: "1:00 PM" },
  { id: 7, time: "2:00 PM" },
  { id: 8, time: "3:00 PM" },
  { id: 9, time: "4:00 PM" },
  { id: 10, time: "5:00 PM" },
];

export default function AppointmentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const formatDate = moment(date).format("MM/DD/YYYY");

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const branch = searchParams.get("branches");
  const status = searchParams.get("statuses");

  const {
    appointments,
    appointmentsLoading: isLoading,
    mutate,
  } = useAppointments(page, query, branch, status, formatDate);

  return (
    <PageContainer>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column: Calendar */}
        <div className="mb-4 xl:mr-10">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mb-4 flex items-center justify-center"
          />
        </div>

        {/* Right Column: Appointments */}
        <div className="flex flex-col flex-1">
          {isLoading ? (
            <div className="flex flex-col space-y-4">
              {timeSlots.map((time) => (
                <div className="space-y-2" key={time.id}>
                  <h2 className="text-lg font-semibold">{time.time}</h2>
                  <div className="flex flex-col border p-4 space-y-2 rounded-md">
                    <Skeleton className="h-2 w-3/4" />
                    <Skeleton className="h-2 w-2/5" />
                    <Skeleton className="h-2 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppointmentsMap
              timeSlots={timeSlots}
              appointments={appointments?.data ?? []}
              mutate={mutate}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
