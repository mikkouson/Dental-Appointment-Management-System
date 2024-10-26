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
import { PaginationDemo } from "@/components/pagination";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { CSVLink } from "react-csv"; // Import CSVLink for exporting
import { Button } from "@/components/ui/button";
import { useService } from "@/components/hooks/useService";

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

  const { services, serviceError, serviceLoading, mutate } = useService(
    page,
    query
  );

  const supabase = createClient();

  // Subscribe to realtime updates
  React.useEffect(() => {
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

  // Breadcrumb items
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Services", link: "/services" },
  ];

  // Calculate total pages for pagination
  const totalPages = services ? Math.ceil(services.count / 10) : 1;

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col 2xl:flex-row lg:items-start lg:justify-between">
          <Heading
            title={`Total Services (${services ? services.count : "loading"})`}
            description="Manage Services (Server side table functionalities.)"
          />
          <div className="flex justify-end max-w-full w-full mt-2 sm:ml-0 sm:max-w-full 2xl:max-w-[730px] ">
            <div className="mr-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Service Name ..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>

            {/* CSV Export Button */}
            <CSVLink
              data={(services?.data || []).map((service) => ({
                name: service.name || "null",
                description: service.description || "null",
                price: service.price || "null",
                deleteOn: service.deleteOn || "null",
                updated_at: service.updated_at || "null",
              }))}
              filename={"services.csv"}
            >
              <Button
                variant="outline"
                className="text-xs sm:text-sm px-2 sm:px-4 mr-2"
              >
                <File className="h-3.5 w-3.5 mr-2" />
                <span className="sr-only sm:not-sr-only">Export</span>
              </Button>
            </CSVLink>

            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Service"}
            >
              <NewServiceForm setOpen={setOpen} mutate={mutate} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator />
        <div>
          <div>
            {serviceLoading ? (
              <TableLoadingSkeleton />
            ) : services && services.data ? (
              <>
                <DataTableDemo
                  columns={columns}
                  data={services.data}
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
