"use client";
import type { Address, AppointmentsCol, Patient } from "@/app/schema";
import { Breadcrumbs } from "@/components/breadcrumb";
import { NewPatientForm } from "@/components/forms/newPatientForm";
import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { PaginationDemo } from "@/components/pagitnation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import useSWR from "swr";
import { DataTableDemo } from "./dataTable";
import { columns } from "./column";
import PatientCard from "@/components/cards/patientCard";
import { useSetActiveAppointments } from "@/app/store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const fetcher = async (
  url: string
): Promise<{
  data: AppointmentsCol[] | [];
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
    data: AppointmentsCol[] | [];
    count: number;
  }>(`/api/apt?page=${page}&query=${query}`, fetcher);

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
    { title: "Patients", link: "/admin/patients" },
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
            title={`Total Patients (${data ? data.count : "loading"})`}
            description="Manage employees (Server side table functionalities.)"
          />

          <DrawerDialogDemo open={open} setOpen={setOpen} label={"New Patient"}>
            <NewPatientForm setOpen={setOpen} />
          </DrawerDialogDemo>
        </div>
        <Separator />
        <div className="flex">
          <div className="flex-1">
            <Input
              className="block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 md:max-w-sm"
              placeholder="Search Patient Name"
              value={searchQuery}
              onChange={handleInputChange}
            />
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
