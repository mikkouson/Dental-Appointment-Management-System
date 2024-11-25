"use client";
import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { InventoryCol } from "@/app/schema";
import { RealtimeChannel, RealtimeChannelOptions } from "@supabase/supabase-js";

// Define custom types for realtime states
type RealtimeStatus = "SUBSCRIBED" | "TIMED_OUT" | "CLOSED" | "CHANNEL_ERROR";

const RECONNECT_TIMEOUT = 5000; // 5 seconds

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
  const [realtimeStatus, setRealtimeStatus] = useState<{
    status: RealtimeStatus;
    error: Error | null;
  }>({
    status: "CLOSED",
    error: null,
  });

  const queryString = new URLSearchParams();

  if (query != null) {
    queryString.append("query", query);
  }

  if (branches != null) {
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

  const setupRealtimeSubscription = useCallback(
    (channelName: string): RealtimeChannel => {
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "inventory" },
          (payload) => {
            console.log("Received realtime update:", payload);
            mutate();
          }
        )
        .on("presence", { event: "sync" }, () => {
          console.log("Presence sync occurred");
        })
        .on("broadcast", { event: "*" }, (payload: unknown) => {
          console.log("Broadcast event:", payload);
        });

      // Handle subscription status changes
      channel.subscribe((status: RealtimeStatus, err?: Error) => {
        setRealtimeStatus({
          status,
          error: err || null,
        });

        if (status === "CLOSED" && !err) {
          console.log("Channel closed, attempting to reconnect...");
          // Attempt to reconnect after timeout
          setTimeout(() => {
            setupRealtimeSubscription(channelName);
          }, RECONNECT_TIMEOUT);
        }

        if (err) {
          console.error("Subscription error:", err);
          // Attempt to reconnect after timeout
          setTimeout(() => {
            setupRealtimeSubscription(channelName);
          }, RECONNECT_TIMEOUT);
        }
      });

      return channel;
    },
    [supabase, mutate]
  );

  useEffect(() => {
    const channelName = `realtime-items-${page ?? 1}-${Date.now()}`;
    let channel: RealtimeChannel | null = null;

    try {
      channel = setupRealtimeSubscription(channelName);
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
      setRealtimeStatus({
        status: "CHANNEL_ERROR",
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      });
    }

    // Cleanup function
    return () => {
      if (channel) {
        console.log("Cleaning up channel:", channelName);
        supabase.removeChannel(channel).catch((error) => {
          console.error("Error removing channel:", error);
        });
      }
    };
  }, [page, setupRealtimeSubscription, supabase]);

  return {
    inventory,
    inventoryError,
    inventoryLoading,
    mutate,
    realtimeStatus,
  };
}
