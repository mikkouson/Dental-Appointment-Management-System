"use client";
import { AppointmentsCol } from "@/app/schema";
import { useGetDate } from "@/app/store";
import { CheckboxReactHookFormMultiple } from "@/components/buttons/comboBoxSelect";
import BranchSelect from "@/components/buttons/selectbranch-btn";
import { NewAppointmentForm } from "@/components/forms/new-appointment-form";
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
import React, { useState } from "react";
import useSWR from "swr";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { CSVLink } from "react-csv";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

const fetche = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export default function UserClient() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );
  const { data: statuses, isLoading: statusLoading } = useSWR(
    "/api/status/",
    fetche
  );
  const statusList = React.useMemo(
    () => statuses?.map((s: { id: number }) => s.id) || [],
    [statuses]
  );

  const { status: storeStatus } = useGetDate((state) => ({
    status: state.status,
  }));
  const {
    data: branches,
    error: branchesError,
    isLoading: branchLoading,
  } = useSWR("/api/branch/", fetche);
  const statusIds = storeStatus.map((stat) => stat.id);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const branch = useGetDate((state) => state.branch);
  const { data, error, isLoading, mutate } = useSWR<{
    data: AppointmentsCol[] | [];
    count: number;
  }>(
    `/api/apt?page=${page}&query=${query}&branch=${
      branches && branch !== 0 ? branch : branches ? branches[0]?.id : branch
    }&status=${statusIds.length === 0 ? statusList.join(",") : statusIds}`,
    fetcher
  );

  const { data: exportData, isLoading: exportLoading } = useSWR<{
    data: AppointmentsCol[] | [];
    count: number;
  }>(
    `/api/apt?&query=${query}&branch=${
      branches && branch !== 0 ? branch : branches ? branches[0]?.id : branch
    }&status=${statusIds.length === 0 ? statusList.join(",") : statusIds}`,
    fetcher
  );

  const exported = exportData?.data;
  const supabase = createClient();

  // Subscribe to realtime updates
  React.useEffect(() => {
    const channel = supabase
      .channel("realtime appointments")
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

  // Calculate total pages for pagination
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  if (isLoading || statusLoading || branchLoading || exportLoading)
    return <>loading</>;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex flex-col 2xl:flex-row lg:items-start lg:justify-between">
          <Heading
            title={`Total Appointments (${data ? data.count : "loading"})`}
            description="Manage Inventory (Server side table functionalities.)"
          />

          <div className="flex justify-end  max-w-full flex-col md:flex-row w-full sm:max-w-full 2xl:max-w-[830px]">
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
            <div className="flex justify-end mt-2 sm:mt-0">
              <CSVLink
                data={(exported || []).map((apt: AppointmentsCol) => ({
                  patient_name: apt.patients.name || "null", // Assuming 'name' is the field to export
                  appointment_ticket: apt.appointment_ticket || "null", // Assuming 'name' is the field to export
                  branch: apt?.branch?.name || "null",
                  status: apt?.status?.name || "null",
                  services: apt?.services?.name || "null",
                  time_slots: apt.time_slots?.time || "null",
                  type: apt.type || "null", // Assuming 'name' is the field to export
                  deleteOn: apt.deleteOn || "null",
                }))}
                filename={"appointments.csv"}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className=" gap-2 h-10 text-sm mr-2"
                >
                  <File className="h-5 w-5" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </CSVLink>
              {statuses && (
                <CheckboxReactHookFormMultiple
                  items={statuses}
                  label="Status"
                />
              )}
              <BranchSelect />
              <div>
                <DrawerDialogDemo
                  open={open}
                  setOpen={setOpen}
                  label={"New Appointment"}
                >
                  <NewAppointmentForm setOpen={setOpen} />
                </DrawerDialogDemo>
              </div>
            </div>
          </div>
        </div>
        <Separator />

        <div className="">
          <div className="">
            {isLoading || statusLoading || branchLoading ? (
              <p>Loading...</p>
            ) : data && data.data ? (
              <>
                {/* <ScrollArea className="h-[calc(80vh-220px)] rounded-md border md:h-[calc(80dvh-200px)]"> */}
                <DataTableDemo
                  columns={columns}
                  data={data.data}
                  mutate={mutate}
                />
                {/* <ScrollBar orientation="horizontal" /> */}
                {/* </ScrollArea> */}

                <PaginationDemo
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <p>No data</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
