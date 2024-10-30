"use client";
import { useSetActive } from "@/app/store";
import BurgerMenu from "@/components/buttons/burgerMenu";
import PatientCard from "@/components/cards/patientCard";
import { NewPatientForm } from "@/components/forms/patients/newPatientForm";
import { Heading } from "@/components/heading";
import { usePatients } from "@/components/hooks/usePatient";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { PaginationDemo } from "@/components/pagination";
import SearchInput from "@/components/searchInput";
import PatientCardSkeleton from "@/components/skeleton/patientCardSkeleton";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";

export default function UserClient() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { patients, patientError, patientLoading, mutate } = usePatients(
    page,
    query,
    limit
  );

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

  const totalPages = patients ? Math.ceil(patients.count / limit) : 1;

  return (
    <PageContainer>
      <div className="flex flex-col h-[calc(100svh-20px)] ">
        <div className="flex justify-between items-center mt-0 sm:mt-4">
          <div className="flex items-center">
            <BurgerMenu />
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight sm:hidden">
              Total Appointments ({patients ? patients.count : "Loading"})
            </h4>
            <Heading
              title={`Total Patients (${
                patients ? patients.count : "loading"
              })`}
              description="Manage Appointments (Server side table functionalities.)"
            />
          </div>
          <div className="flex items-center ">
            {/* </CSVLink> */}

            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Patient"}
            >
              <NewPatientForm setOpen={setOpen} mutate={mutate} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center">
          {!isSearchFocused && (
            <div className="flex justify-end items-center">
              {/* <SelectBranch /> */}
              {/* <SelectStatus /> */}
            </div>
          )}
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            handleSearch={handleSearch}
          />
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
