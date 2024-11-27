"use client";
import AppointmentsMap from "@/components/appointmentsList";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useAppointments } from "./hooks/useAppointmentCalendar";
import PageContainer from "./layout/page-container";

const FULLBOOKED_THRESHOLD = 8;
const BUSY_THRESHOLD = 5;
const EXCLUDED_STATUSES = ["Reject", "Canceled", "Completed"];
const EXCLUDED_STATUS_NUMBERS = [3, 4, 5, 1];

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

  // Get filtered appointments for the appointments list
  const {
    appointments,
    appointmentsLoading: isLoading,
    mutate,
  } = useAppointments(null, query, branch, status, formatDate);

  // Get all appointments for calendar coloring
  const {
    appointments: allAppointments,
    appointmentsLoading: allAppointmentsIsLoading,
  } = useAppointments();

  // Process appointments data for calendar coloring using allAppointments
  const { appointmentsByDate, fullBookedDates, hasAppointmentDates } =
    useMemo(() => {
      const appointmentMap = new Map();
      const fullbooked = new Set();
      const hasAppointment = new Set();

      // Check if allAppointments exist and has data
      if (!allAppointments?.data || !Array.isArray(allAppointments.data)) {
        return {
          appointmentsByDate: appointmentMap,
          fullBookedDates: fullbooked,
          hasAppointmentDates: hasAppointment,
        };
      }

      // Process each appointment from allAppointments
      allAppointments.data.forEach((apt) => {
        if (!apt?.date || !apt?.status) return;

        const dateKey = moment(apt.date).format("YYYY-MM-DD");

        // Skip if status is in excluded list or excluded numbers
        if (
          EXCLUDED_STATUSES.includes(apt.status.id) ||
          EXCLUDED_STATUS_NUMBERS.includes(apt.status.id)
        )
          return;

        // Mark date as having at least one appointment
        hasAppointment.add(dateKey);

        // Count appointments per date
        const currentCount = appointmentMap.get(dateKey) || 0;
        const newCount = currentCount + 1;
        appointmentMap.set(dateKey, newCount);

        // Mark as fullbooked if threshold reached
        if (newCount >= FULLBOOKED_THRESHOLD) {
          fullbooked.add(dateKey);
        }
      });

      return {
        appointmentsByDate: appointmentMap,
        fullBookedDates: fullbooked,
        hasAppointmentDates: hasAppointment,
      };
    }, [allAppointments?.data]);

  return (
    <PageContainer>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column: Calendar */}
        <div className="mb-4 xl:mr-10">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mb-4"
            modifiers={{
              fullbooked: (date) => {
                const dateKey = moment(date).format("YYYY-MM-DD");
                return fullBookedDates.has(dateKey);
              },
              busy: (date) => {
                const dateKey = moment(date).format("YYYY-MM-DD");
                const count = appointmentsByDate.get(dateKey) || 0;
                return count >= BUSY_THRESHOLD && count < FULLBOOKED_THRESHOLD;
              },
              hasAppointment: (date) => {
                const dateKey = moment(date).format("YYYY-MM-DD");
                const count = appointmentsByDate.get(dateKey) || 0;
                return (
                  hasAppointmentDates.has(dateKey) && count < BUSY_THRESHOLD
                );
              },
            }}
            modifiersClassNames={{
              fullbooked: "bg-red-200 text-red-900 font-semibold",
              busy: "bg-orange-200 text-orange-900",
              hasAppointment: "bg-green-200 text-green-900",
              selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            }}
          />
          <div className="mt-2 flex flex-col   gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-200 rounded" />
              <span>Fully Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-200 rounded" />
              <span>Busy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-200 rounded" />
              <span>Has Pending Appointments </span>
            </div>
          </div>
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
