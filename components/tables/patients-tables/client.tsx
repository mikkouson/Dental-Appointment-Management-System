"use client";
import type { Address, Patient, PatientCol } from "@/app/schema";
import { useSetActive } from "@/app/store";
import { Breadcrumbs } from "@/components/breadcrumb";
import PatientCard from "@/components/cards/patientCard";
import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { PaginationDemo } from "@/components/pagitnation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useOptimistic, useState } from "react";
import useSWR, { preload } from "swr";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { NewPatientForm } from "@/components/forms/patients/newPatientForm";
const fetcher = async (
  url: string
): Promise<{
  data: (Patient & { address?: Address | null })[];
  count: number;
}> => fetch(url).then((res) => res.json());

preload(`/api/patients`, fetcher);
export default function UserClient() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );
  const activePatient = useSetActive((state) => state.selectedPatient);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const { data, error, isLoading, mutate } = useSWR<{
    data: (Patient & { address?: Address | null })[];
    count: number;
  }>(`/api/patients?page=${page}&query=${query}`, fetcher);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime patients")
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

        <div className="flex flex-col 2xl:flex-row lg:items-start lg:justify-between">
          <Heading
            title={`Total Patients (${data ? data.count : "loading"})`}
            description="Manage patients (Server side table functionalities.)"
          />

          <div className="flex justify-end  max-w-full  w-full mt-2 sm:ml-0 ">
            <div className="mr-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Patient Name ..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px] "
                onChange={handleInputChange}
                value={searchQuery}
              />
            </div>
            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Patient"}
            >
              <NewPatientForm setOpen={setOpen} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col  xl:flex-row">
          <div className="flex-1">
            {isLoading ? (
              <p>Loading...</p>
            ) : data && data.data && data.data.length > 0 ? (
              <>
                <DataTableDemo
                  columns={columns}
                  data={data.data}
                  activePatient={
                    activePatient === 0
                      ? data.data[0].id
                      : activePatient || undefined
                  }
                  mutate={mutate}
                />
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
          <div className="w-full mt-5 xl:w-1/5 xl:ml-5 xl:mt-0">
            {data && data.data && data.data.length > 0 && (
              <PatientCard
                activePatient={
                  activePatient == 0 ? data.data[0].id : activePatient
                }
              />
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
