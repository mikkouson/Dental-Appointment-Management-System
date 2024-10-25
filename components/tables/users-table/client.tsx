"use client";
import { Service } from "@/app/schema";
import { Breadcrumbs } from "@/components/breadcrumb";
import { NewServiceForm } from "@/components/forms/services/newServicesForm";
import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { Search, File } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { PaginationDemo } from "@/components/pagitnation";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { NewUserForm } from "@/components/forms/users/newUserForm";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";

const fetcher = async (
  url: string
): Promise<{
  data: Service[] | [];
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
    data: Service[] | [];
    count: number;
  }>(`/api/users?page=${page}&query=${query}`, fetcher);

  const supabase = createClient();

  // Subscribe to realtime updates
  React.useEffect(() => {
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
    { title: "Dashboard", link: "/" },
    { title: "Users", link: "/users" },
  ];

  // Calculate total pages for pagination
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col 2xl:flex-row lg:items-start lg:justify-between">
          <Heading
            title={`Total Users (${data ? data.count : "loading"})`}
            description="Manage Users (Server side table functionalities.)"
          />
          <div className="flex justify-end max-w-full w-full mt-2 sm:ml-0 sm:max-w-full 2xl:max-w-[730px] ">
            <div className="mr-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search User Name ..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>

            {/* CSV Export Button */}
            <CSVLink
              data={(data?.data || []).map((user) => ({
                name: user.name || "null",
                email: user.email || "null",
                updated_at: user.updated_at || "null",
              }))}
              filename={"users.csv"}
            >
              <Button
                variant="outline"
                className="text-xs sm:text-sm px-2 sm:px-4 mr-2"
              >
                <File className="h-3.5 w-3.5 mr-2" />
                <span className="sr-only sm:not-sr-only">Export</span>
              </Button>
            </CSVLink>

            <DrawerDialogDemo open={open} setOpen={setOpen} label={"New User"}>
              <NewUserForm setOpen={setOpen} mutate={mutate} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator />
        <div>
          <div>
            {isLoading ? (
              <TableLoadingSkeleton />
            ) : data && data.data ? (
              <>
                <DataTableDemo
                  columns={columns}
                  data={data.data}
                  mutate={mutate}
                  activePatient={undefined}
                />

                <PaginationDemo totalPages={totalPages} />
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
