"use client";
import { useSetActiveAppointments } from "@/app/store";
import { Breadcrumbs } from "@/components/breadcrumb";
import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import useSWR from "swr";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { Service } from "@/app/schema";

const fetcher = async (
  url: string
): Promise<{
  data: Service[] | [];
  count: number;
}> => fetch(url).then((res) => res.json());

export default function UserClient() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const activePatient = useSetActiveAppointments(
    (state) => state.selectedAppointment
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const { data, error, isLoading, mutate } = useSWR<{
    data: Service[] | [];
    count: number;
  }>(`/api/service`, fetcher);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin" },
    { title: "Services", link: "/admin/serives" },
  ];

  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Total Services (${data ? data.count : "loading"})`}
            description="Manage services (Server side table functionalities.)"
          />

          {/* <div className="flex">
            <div className="mr-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Patient Name ..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                onChange={handleInputChange}
              />
            </div>
            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Patient"}
            >
              <NewPatientForm setOpen={setOpen} />
            </DrawerDialogDemo>
          </div> */}
        </div>
        <Separator />
        <div className="flex">
          <div className="flex-1">
            {/* <Input
              className="block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 md:max-w-sm"
              placeholder="Search Patient Name"
              value={searchQuery}
              onChange={handleInputChange}
            /> */}
            {isLoading ? (
              <p>Loading...</p>
            ) : data && data.data ? (
              <>
                <ScrollArea className="h-[calc(80vh-220px)] rounded-md border md:h-[calc(80dvh-200px)]">
                  <DataTableDemo
                    columns={columns}
                    data={data.data}
                    activePatient={
                      activePatient == 0 ? data.data[0].id : activePatient
                    }
                  />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {/* 
                <PaginationDemo
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                /> */}
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
          {/* <div className="w-1/5 ml-5">
            {data && (
              <PatientCard
                activePatient={
                  activePatient == 0 ? data.data[0].id : activePatient
                }
              />
            )}
          </div> */}
        </div>
      </div>
    </PageContainer>
  );
}
