"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { Doctor } from "@/app/schema";

const fetcher = async (
  url: string
): Promise<{
  data: Doctor[] | [];
  count: number;
}> => fetch(url).then((res) => res.json());

export function useDoctor(
  page?: number | null,
  query?: string,
  limit?: number | null
) {
  const queryString = new URLSearchParams();

  if (page != null) {
    queryString.append("page", String(page));
  }
  if (query !== undefined) {
    queryString.append("query", query);
  }
  if (limit != null) {
    queryString.append("limit", String(limit));
  }

  const {
    data: doctors,
    error: doctorError,
    isLoading: doctorLoading,
    mutate,
  } = useSWR<{
    data: Doctor[] | [];
    count: number;
  }>(`/api/doctor?${queryString.toString()}`, fetcher);

  const supabase = createClient();

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-doctors-${page}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "doctors" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      console.log("Removing channel");
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  return { doctors, doctorError, doctorLoading, mutate };
}
