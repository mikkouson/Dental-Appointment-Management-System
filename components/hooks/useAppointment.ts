"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { AppointmentsCol } from "@/app/schema";

// Fetcher function for appointments
const fetcher = async (
  url: string
): Promise<{
  data: AppointmentsCol[] | [];
  count: number;
}> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

export function useAppointments(
  page?: number | null,
  query?: string | null,
  branches?: string | null,
  status?: string | null,
  date?: string | null,
  limit?: number | null,
  dateRangeStart?: string | null,
  dateRangeEnd?: string | null
) {
  const queryString = new URLSearchParams();

  if (query) {
    queryString.append("query", query);
  }

  if (branches) {
    const branchArray = branches.split(",");
    queryString.append("branch", branchArray.join(","));
  }

  if (status) {
    const statusArray = status.split(",");
    queryString.append("statuses", statusArray.join(","));
  }

  if (page) {
    queryString.append("page", String(page));
  }

  if (date) {
    queryString.append("date", date);
  }

  if (limit) {
    queryString.append("limit", String(limit));
  }

  // Add date range to query string if provided
  if (dateRangeStart) {
    queryString.append("dateRangeStart", dateRangeStart);
  }
  if (dateRangeEnd) {
    queryString.append("dateRangeEnd", dateRangeEnd);
  }

  const {
    data: appointments,
    error: appointmentsError,
    isLoading: appointmentsLoading,
    mutate,
  } = useSWR<{
    data: AppointmentsCol[] | [];
    count: number;
  }>(`/api/apt?${queryString.toString()}`, fetcher);

  const supabase = createClient();

  // Subscribe to realtime updates for appointments
  useEffect(() => {
    const channel = supabase
      .channel("realtime-appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [page, supabase, mutate]);

  return { appointments, appointmentsError, appointmentsLoading, mutate };
}
