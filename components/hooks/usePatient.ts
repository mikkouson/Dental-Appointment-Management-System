"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { Patient, Address } from "@/app/schema";

const fetcher = async (
  url: string
): Promise<{
  data: (Patient & { address?: Address | null })[];
  count: number;
}> => fetch(url).then((res) => res.json());

export function usePatients(
  page?: number | null,
  query?: string,

  limit?: number | null
) {
  const queryString = new URLSearchParams();

  if (page) {
    queryString.append("page", String(page));
  }
  if (query !== undefined) {
    queryString.append("query", query);
  }

  if (limit) {
    queryString.append("limit", String(limit)); // Add limit to query string
  }

  const {
    data: patients,
    error: patientError,
    isLoading: patientLoading,
    mutate,
  } = useSWR<{
    data: (Patient & { address?: Address | null })[];
    count: number;
  }>(`/api/patients?${queryString.toString()}`, fetcher);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-patients-${page}`)

      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [page, supabase, mutate]);

  return { patients, patientError, patientLoading, mutate };
}
