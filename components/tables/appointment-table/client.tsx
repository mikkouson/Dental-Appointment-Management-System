"use client";
import Loading from "@/app/(admin)/appointments/loading";
import { AppointmentsCol } from "@/app/schema";
import { useGetDate } from "@/app/store";
import { CheckboxReactHookFormMultiple } from "@/components/buttons/comboBoxSelect";
import BranchSelect from "@/components/buttons/selectbranch-btn";
import { NewAppointmentForm } from "@/components/forms/appointment/new-appointment-form";
import { Heading } from "@/components/heading";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { PaginationDemo } from "@/components/pagitnation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { File, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import useSWR from "swr";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return res.json();
};

const UserClient: React.FC = () => {
  // State Management
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );

  // Routing and URL Management
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";

  // Global Store
  const { status: storeStatus, branch } = useGetDate((state) => ({
    status: state.status,
    branch: state.branch,
  }));

  const statusIds = useMemo(
    () => storeStatus.map((stat) => stat.id),
    [storeStatus]
  );

  // Data Fetching
  const { data: statuses, isLoading: statusLoading } = useSWR(
    "/api/status/",
    fetcher
  );
  const { data: branches, isLoading: branchLoading } = useSWR(
    "/api/branch/",
    fetcher
  );

  const statusList = useMemo(
    () => statuses?.map((s: { id: number }) => s.id) || [],
    [statuses]
  );

  const { data, isLoading, mutate } = useSWR<{
    data: AppointmentsCol[] | [];
    count: number;
  }>(
    branches
      ? `/api/apt?page=${page}&query=${query}&branch=${
          branch !== 0 ? branch : branches[0]?.id
        }&status=${statusIds.length === 0 ? statusList.join(",") : statusIds}`
      : null,
    fetcher
  );

  // Fetching all data with no pagination for export
  const { data: exportData } = useSWR<{
    data: AppointmentsCol[] | [];
    count: number;
  }>(
    branches
      ? `/api/apt?query=${query}&branch=${
          branch !== 0 ? branch : branches[0]?.id
        }&status=${statusIds.length === 0 ? statusList.join(",") : statusIds}`
      : null,
    fetcher
  );

  const exported = exportData?.data;

  const supabase = createClient();

  // Realtime Updates
  useEffect(() => {
    const channel = supabase
      .channel("realtime-appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  // Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  if (isLoading || statusLoading || branchLoading) return <Loading />;

  return (
    <PageContainer>
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col 2xl:flex-row lg:items-start lg:justify-between">
          <Heading
            title={`Total Appointments (${data ? data.count : "Loading"})`}
            description="Manage Appointments (Server side table functionalities.)"
          />

          {/* Search and Actions */}
          <div className="flex justify-end max-w-full flex-col md:flex-row w-full sm:max-w-full 2xl:max-w-[830px]">
            {/* Search Input */}
            <div className="mr-0 mt-2 sm:mr-2 sm:mt-0 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Patient Name ..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-2 sm:mt-0">
              {/* Export Button */}
              <CSVLink
                data={(exported || []).map((apt: AppointmentsCol) => ({
                  patient_name: apt?.patients?.name || "null",
                  appointment_ticket: apt.appointment_ticket || "null",
                  branch: apt?.branch?.name || "null",
                  status: apt?.status?.name || "null",
                  services: apt?.services?.name || "null",
                  time_slots: apt.time_slots?.time || "null",
                  type: apt.type || "null",
                  deleteOn: apt.deleteOn || "null",
                }))}
                filename={"appointments.csv"}
              >
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm px-2 sm:px-4 mr-2"
                >
                  <File className="h-3.5 w-3.5 mr-2" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </CSVLink>

              {/* Status Filter */}
              {statuses && (
                <CheckboxReactHookFormMultiple
                  items={statuses}
                  label="Status"
                />
              )}

              {/* Branch Selector */}
              <BranchSelect />

              {/* New Appointment Drawer */}
              <DrawerDialogDemo
                open={open}
                setOpen={setOpen}
                label={"New Appointment"}
              >
                <NewAppointmentForm setOpen={setOpen} mutate={mutate} />
              </DrawerDialogDemo>
            </div>
          </div>
        </div>

        <Separator />

        {/* Data Table and Pagination */}
        <div>
          {data && data.data.length ? (
            <>
              <DataTableDemo
                columns={columns}
                data={data.data}
                mutate={mutate}
              />
              <PaginationDemo
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UserClient;
