"use client";
import { Inventory } from "@/app/schema";
import { Breadcrumbs } from "@/components/breadcrumb";
import { NewServiceForm } from "@/components/forms/services/newServicesForm";
import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { PaginationDemo } from "@/components/pagitnation";
import { NewInventoryForm } from "@/components/forms/inventory/newInventoryForm";

const fetcher = async (
  url: string
): Promise<{
  data: Inventory[] | [];
  count: number;
}> => fetch(url).then((res) => res.json());

export default function UserClient() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const { data, error, isLoading, mutate } = useSWR<{
    data: Inventory[] | [];
    count: number;
  }>(`/api/inventory?page=${page}&query=${query}`, fetcher);

  const supabase = createClient();

  // Subscribe to realtime updates
  React.useEffect(() => {
    const channel = supabase
      .channel("realtime inventory")
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

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  // Handle search and update URL query parameters
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // Handle page change and update URL page parameter
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin" },
    { title: "Inventory", link: "/admin/inventory" },
  ];

  // Calculate total pages for pagination
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Total Inventory (${data ? data.count : "loading"})`}
            description="Manage Inventory (Server side table functionalities.)"
          />

          <div className="flex">
            <div className="mr-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Patient Name ..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>
            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Service"}
            >
              <NewInventoryForm setOpen={setOpen} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator />
        <div className="flex">
          <div className="flex-1">
            {isLoading ? (
              <p>Loading...</p>
            ) : data && data.data ? (
              <>
                <ScrollArea className="h-[calc(80vh-220px)] rounded-md border md:h-[calc(80dvh-200px)]">
                  <DataTableDemo
                    columns={columns}
                    data={data.data}
                    mutate={mutate}
                  />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <PaginationDemo
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
