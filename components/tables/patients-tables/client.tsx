"use client";
import type { Address, Patient } from "@/app/schema";
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
import { Search, Table, File } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR, { preload } from "swr";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { NewPatientForm } from "@/components/forms/patients/newPatientForm";
import Skeleton from "@/components/skeleton/tableskeleton";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import PatientCardSkeleton from "@/components/skeleton/patientCardSkeleton";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { usePatients } from "@/components/hooks/usePatient";

const fetcher = async (
  url: string
): Promise<{
  data: (Patient & { address?: Address | null })[];
  count: number;
}> => fetch(url).then((res) => res.json());

export default function UserClient() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );
  const activePatient = useSetActive((state) => state.selectedPatient);
  const [usePagination, setUsePagination] = useState(true); // state for pagination

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const { patients, patientError, patientLoading, mutate } = usePatients(
    page,
    query,
    usePagination
  );

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
    { title: "Dashboard", link: "/" },
    { title: "Patients", link: "/patients" },
  ];

  const totalPages = patients ? Math.ceil(patients.count / 10) : 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleCSVExport = () => {
    setUsePagination(false); // disable pagination for export
    setTimeout(() => {
      setUsePagination(true); // re-enable pagination after export
    }, 2000); // delay to simulate export completion (adjust as needed)
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col 2xl:flex-row lg:items-start lg:justify-between">
          <Heading
            title={`Total Patients (${patients ? patients.count : "loading"})`}
            description="Manage patients (Server side table functionalities.)"
          />

          <div className="flex justify-end max-w-full w-full mt-2 sm:ml-0 sm:max-w-full 2xl:max-w-[730px] ">
            <div className="mr-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Patient Name ..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                onChange={handleInputChange}
                value={searchQuery}
              />
            </div>

            {/* CSV Export Button */}
            <CSVLink
              data={(patients?.data || []).map(
                (patient: Patient & { address?: Address | null }) => ({
                  name: patient.name || "null",
                  email: patient.email || "null",
                  sex: patient.sex || "null",
                  age: patient.age || "null",
                  address: patient.address?.address || "null",
                  phone: patient.phone_number || "null",
                  birthdate: patient.dob || "null",
                  status: patient.status || "null",
                  created_at: patient.created_at || "null",
                  updated_at: patient.updated_at || "null",
                })
              )}
              filename={"patients.csv"}
              onClick={handleCSVExport} // trigger pagination off for export
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
              label={"New Patient"}
            >
              <NewPatientForm setOpen={setOpen} mutate={mutate} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col  2xl:flex-row">
          <div className="flex-1">
            {patientLoading ? (
              <TableLoadingSkeleton />
            ) : patients && patients.data && patients.data.length > 0 ? (
              <>
                <DataTableDemo
                  columns={columns}
                  data={patients.data}
                  activePatient={
                    activePatient === 0
                      ? patients.data[0].id
                      : activePatient || undefined
                  }
                  mutate={mutate}
                />
                <PaginationDemo totalPages={totalPages} />
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
          <div className="w-full mt-5 2xl:w-1/5 2xl:ml-5 2xl:mt-0">
            {patients && patients.data && patients.data.length > 0 ? (
              <PatientCard
                activePatient={
                  activePatient === 0 ? patients.data[0].id : activePatient
                }
              />
            ) : (
              <PatientCardSkeleton />
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
