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
  page?: number,
  query?: string,
  branches?: string | null,
  limit?: number | null
) {
  const queryString = new URLSearchParams();

  if (query !== undefined) {
    queryString.append("query", query);
  }

  if (branches) {
    const branchArray = branches.split(",");
    queryString.append("branch", branchArray.join(","));
  }

  if (page !== undefined) {
    queryString.append("page", String(page));
  }

  if (limit) {
    queryString.append("limit", String(limit)); // Add limit to query string
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
      .channel("realtime-inventory")
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
  }, [supabase, mutate]);

  return { inventory, inventoryError, inventoryLoading, mutate };
}
