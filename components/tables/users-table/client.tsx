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
import { NewUserForm } from "@/components/forms/users/newUserForm";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import BurgerMenu from "@/components/buttons/burgerMenu";
import SearchInput from "@/components/searchInput";
import { useUser } from "@/components/hooks/useUser";
import UserExport from "@/components/buttons/exportButtons/userExport";

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

  const {
    user: data,
    userError,
    userLoading,
    mutate,
  } = useUser(page, query, limit);

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
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  return (
    <PageContainer>
      <div className="flex flex-col h-[calc(100svh-20px)] ">
        <div className="flex justify-between items-center mt-0 sm:mt-4">
          <div className="flex items-center">
            <BurgerMenu />
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight sm:hidden">
              Total Appointments ({data ? data.count : "Loading"})
            </h4>
            <Heading
              title={`Total Items (${data ? data.count : "loading"})`}
              description="Manage Appointments (Server side table functionalities.)"
            />
          </div>
          <div className="flex items-center ">
          <UserExport /> 
            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Inventory Item"}
            >
              <NewUserForm setOpen={setOpen} mutate={mutate} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center">
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
          />
        </div>
        <Separator />
        <div>
          <div>
            {userLoading ? (
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
