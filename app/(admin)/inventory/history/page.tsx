"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageIcon, CalendarIcon, PackageSearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SelectBranch from "@/components/buttons/selectBranch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchInput from "@/components/searchInput";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Appointment {
  id: number;
  date: string;
  services: {
    name: string;
  };
  branch: {
    name: string;
  };
}

interface Inventory {
  name: string;
}

interface ItemUsage {
  id: number;
  item_id: number;
  quantity: number;
  created_at: string;
  inventory: Inventory;
  appointments: Appointment;
}

interface APIResponse {
  data: ItemUsage[];
}

interface ItemSummary {
  totalQuantity: number;
  latestUsage: string;
  serviceName: string;
  branchName: string;
  inventoryName: string;
}

interface ItemUsageCardProps {
  itemId: number;
  totalQuantity: number;
  latestUsage: string;
  serviceName: string;
  branchName: string;
  inventoryName: string;
}

interface ProcessedItem extends ItemSummary {
  itemId: number;
}

const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden rounded-lg shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-8 text-center h-[400px] w-full absolute left-0">
      <PackageSearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Usage History Found</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        No inventory usage records match your current filters. Try adjusting
        your search criteria or branch selection.
      </p>
    </div>
  );
};

const ItemUsageCard: React.FC<ItemUsageCardProps> = ({
  totalQuantity,
  latestUsage,
  serviceName,
  branchName,
  inventoryName,
}) => {
  return (
    <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <PackageIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{inventoryName}</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            Total Used: {totalQuantity}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Last Used: {new Date(latestUsage).toLocaleDateString()}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <div>Service: {serviceName}</div>
            <div>Branch: {branchName}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Page() {
  const [sortBy, setSortBy] = useState<"usage" | "recent">("usage");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const branch = searchParams.get("branches") || "";
  const query = searchParams.get("query") || "";

  const { data, error, isLoading } = useSWR<APIResponse>(
    `/api/item_used?branch=${branch}&query=${query}`,
    fetcher
  );

  const processedData = useMemo(() => {
    if (!data) return [];

    const itemSummary: Record<number, ItemSummary> = {};

    data.data.forEach((item) => {
      if (!itemSummary[item.item_id]) {
        itemSummary[item.item_id] = {
          totalQuantity: 0,
          latestUsage: item.created_at,
          serviceName: item.appointments.services.name,
          branchName: item.appointments.branch.name,
          inventoryName: item.inventory.name,
        };
      }

      itemSummary[item.item_id].totalQuantity += item.quantity;
      if (
        new Date(item.created_at) >
        new Date(itemSummary[item.item_id].latestUsage)
      ) {
        itemSummary[item.item_id].latestUsage = item.created_at;
        itemSummary[item.item_id].serviceName = item.appointments.services.name;
        itemSummary[item.item_id].branchName = item.appointments.branch.name;
      }
    });

    return Object.entries(itemSummary)
      .sort((a, b) => {
        if (sortBy === "usage") {
          return b[1].totalQuantity - a[1].totalQuantity;
        }
        return (
          new Date(b[1].latestUsage).getTime() -
          new Date(a[1].latestUsage).getTime()
        );
      })
      .map(
        ([itemId, data]): ProcessedItem => ({
          itemId: Number(itemId),
          totalQuantity: data.totalQuantity,
          latestUsage: data.latestUsage,
          serviceName: data.serviceName,
          branchName: data.branchName,
          inventoryName: data.inventoryName,
        })
      );
  }, [data, sortBy]);

  if (error)
    return (
      <div className="text-center p-4 text-red-500">Failed to load data</div>
    );

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory Usage Tracking</h2>
        <div className="flex gap-2 items-center">
          <div>
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              handleSearch={handleSearch}
              label="Inventory Item"
            />
          </div>
          <div>
            <SelectBranch />
          </div>

          <Badge
            variant={sortBy === "usage" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSortBy("usage")}
          >
            Most Used
          </Badge>
          <Badge
            variant={sortBy === "recent" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSortBy("recent")}
          >
            Recently Used
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : processedData.length > 0 ? (
          processedData.map((item) => (
            <ItemUsageCard
              key={item.itemId}
              itemId={item.itemId}
              totalQuantity={item.totalQuantity}
              latestUsage={item.latestUsage}
              serviceName={item.serviceName}
              branchName={item.branchName}
              inventoryName={item.inventoryName}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
