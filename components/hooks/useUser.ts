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

export function useUser(page?: number, query?: string, limit?: number | null) {
  const queryString = new URLSearchParams();

  if (page !== undefined) {
    queryString.append("page", String(page));
  }
  if (query !== undefined) {
    queryString.append("query", query);
  }

  if (limit) {
    queryString.append("limit", String(limit)); // Add limit to query string
  }

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
    mutate,
  } = useSWR<{
    data: Service[] | [];
    count: number;
  }>(`/api/users?${queryString.toString()}`, fetcher);

  const supabase = createClient();

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("realtime service")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  return { user, userError, userLoading, mutate };
}
