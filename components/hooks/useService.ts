"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { Service } from "@/app/schema";

const fetcher = async (
  url: string
): Promise<{
  data: Service[] | [];
  count: number;
}> => fetch(url).then((res) => res.json());

export function useService(page?: number, query?: string) {
  const queryString = new URLSearchParams();

  if (page !== undefined) {
    queryString.append("page", String(page));
  }
  if (query !== undefined) {
    queryString.append("query", query);
  }

  const {
    data: services,
    error: serviceError,
    isLoading: serviceLoading,
    mutate,
  } = useSWR<{
    data: Service[] | [];
    count: number;
  }>(`/api/service?${queryString.toString()}`, fetcher);

  const supabase = createClient();

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("realtime service")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  return { services, serviceError, serviceLoading, mutate };
}
