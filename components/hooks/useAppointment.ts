"use client";
import { useEffect, useState } from "react";
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
  page?: number,
  query?: string,
  branches?: string | null, // Expect branches as a string from useSearchParams
  status?: string | null // Expect branches as a string from useSearchParams
) {
  const queryString = new URLSearchParams();

  if (query !== undefined) {
    queryString.append("query", query);
  }

  // Handle branches as an array
  if (branches) {
    const branchArray = branches.split(",");
    queryString.append("branch", branchArray.join(",")); // Append branches as comma-separated values
  }

  if (status) {
    const branchArray = status.split(",");
    queryString.append("statuses", branchArray.join(",")); // Append branches as comma-separated values
  }

  if (page !== undefined) {
    queryString.append("page", String(page));
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
  }, [supabase, mutate]);

  return { appointments, appointmentsError, appointmentsLoading, mutate };
}
