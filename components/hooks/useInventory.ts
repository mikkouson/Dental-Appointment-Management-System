"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { InventoryCol } from "@/app/schema";

const fetcher = async (
  url: string
): Promise<{
  data: InventoryCol[] | [];
  count: number;
}> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

export function useInventory(
  page?: number | null,
  query?: string | null,
  branches?: string | null,
  limit?: number | null
) {
  const queryString = new URLSearchParams();

  if (query != null) {
    queryString.append("query", query);
  }

  if (branches != null) {
    // Now TypeScript knows branches is not undefined when we use it
    const branchArray = branches.split(",");
    queryString.append("branch", branchArray.join(","));
  }

  if (page != null) {
    queryString.append("page", String(page));
  }

  if (limit != null) {
    queryString.append("limit", String(limit));
  }

  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
    mutate,
  } = useSWR<{
    data: InventoryCol[] | [];
    count: number;
  }>(`/api/inventory?${queryString.toString()}`, fetcher);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-items-${page ?? 1}`) // Provide a default value if page is undefined
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [page, supabase, mutate]);

  return { inventory, inventoryError, inventoryLoading, mutate };
}
