"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { Patient, Address } from "@/app/schema";

const fetcher = async (url: any): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
export function usePatientsDetails(id?: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/patientdetails?id=${id}`,
    fetcher
  );

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-tooth_history-${id}`)

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
  }, [id, supabase, mutate]);

  return { data, error, isLoading, mutate };
}
