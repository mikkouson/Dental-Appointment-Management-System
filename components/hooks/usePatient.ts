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
  page?: number,
  query?: string,
  usePagination = true
) {
  const queryString = new URLSearchParams();

  if (page !== undefined) {
    queryString.append("page", String(page));
  }
  if (query !== undefined) {
    queryString.append("query", query);
  }
  queryString.append("usePagination", String(usePagination));

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
      .channel("realtime patients")
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
  }, [supabase, mutate]);

  return { patients, patientError, patientLoading, mutate };
}
