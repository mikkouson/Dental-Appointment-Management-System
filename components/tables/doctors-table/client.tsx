"use client";
import BurgerMenu from "@/components/buttons/burgerMenu";
import DoctorExport from "@/components/buttons/exportButtons/doctorExport";
import { NewDoctorForm } from "@/components/forms/doctors/newDoctorForm";
import { Heading } from "@/components/heading";
import { useDoctor } from "@/components/hooks/useDoctor";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { PaginationDemo } from "@/components/pagination";
import SearchInput from "@/components/searchInput";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";

export default function UserClient() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { doctors, doctorError, doctorLoading, mutate } = useDoctor(
    page,
    query,
    limit
  );

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

  // Calculate total pages for pagination
  const totalPages = doctors ? Math.ceil(doctors.count / limit) : 1;

  return (
    <PageContainer>
      <div className="flex flex-col h-[calc(100svh-20px)] ">
        <div className="flex justify-between items-center mt-0 sm:mt-4">
          <div className="flex items-center">
            <BurgerMenu />
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight sm:hidden">
              Total Appointments ({doctors ? doctors.count : "Loading"})
            </h4>
            <Heading
              title={`Total Doctors (${doctors ? doctors.count : "loading"})`}
              description="Manage Doctors (Server side table functionalities.)"
            />
          </div>
          <div className="flex items-center ">
            <DoctorExport />

            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Doctor"}
            >
              <NewDoctorForm setOpen={setOpen} mutate={mutate} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center pb-2">
          {!isSearchFocused && (
            <div className="flex justify-end items-center">
              {/* <SelectBranch /> */}
            </div>
          )}
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            handleSearch={handleSearch}
            label="Doctor"
          />
        </div>
        <div>
          <div>
            {doctorLoading ? (
              <TableLoadingSkeleton />
            ) : doctors && doctors.data ? (
              <>
                <DataTableDemo
                  columns={columns}
                  data={doctors.data}
                  mutate={mutate}
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
