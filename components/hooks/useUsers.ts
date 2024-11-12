"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { User } from "@/app/schema";

const fetcher = async (
  url: string
): Promise<{
  data: User[] | [];
  count: number;
}> => fetch(url).then((res) => res.json());

export function useUsers(
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
    data: users,
    error: userError,
    isLoading: userLoading,
    mutate,
  } = useSWR<{
    data: User[] | [];
    count: number;
  }>(`/api/users?${queryString.toString()}`, fetcher);

  const supabase = createClient();

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-users-${page}`)
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

  return { users, userError, userLoading, mutate };
}
