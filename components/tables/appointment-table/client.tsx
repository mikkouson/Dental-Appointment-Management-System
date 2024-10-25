"use client";
import Loading from "@/app/(admin)/appointments/loading";
import { useGetDate } from "@/app/store";
import { CheckboxReactHookFormMultiple } from "@/components/buttons/comboBoxSelect";
import AppointmentExport from "@/components/buttons/exportButtons/appointmentExport";
import { NewAppointmentForm } from "@/components/forms/appointment/new-appointment-form";
import { Heading } from "@/components/heading";
import { useAppointments } from "@/components/hooks/useAppointment";
import { useStatuses } from "@/components/hooks/useStatuses";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { PaginationDemo } from "@/components/pagitnation";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { useBranches } from "@/components/hooks/useBranches";
import FilterSelect from "@/components/buttons/filterSelect";
import SelectBranch from "@/components/buttons/selectBranch";
import SelectStatus from "@/components/buttons/selectStatus";

export default function UserClient() {
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
  const branch = searchParams.get("branches");
  const status = searchParams.get("statuses");

  // Data Fetching
  const { statuses, statusLoading } = useStatuses();
  const { branches, branchLoading } = useBranches();

  const {
    appointments: data,
    appointmentsLoading: isLoading,
    mutate,
  } = useAppointments(page, query, branch, status);
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

  const totalPages = data ? Math.ceil(data.count / 10) : 1;
  if (statusLoading || branchLoading) return <Loading />;
  // if (isLoading) return <Loading />;

  const statusOptions = statuses.map(
    (status: { id: number; name: string }) => ({
      id: status.id,
      name: status.name,
    })
  );
  return (
    <PageContainer>
      <div className="space-y-4 h-[calc(100vh-144px)]">
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
              <AppointmentExport />

              <SelectBranch />
              <SelectStatus />

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
        {!isLoading ? (
          <div>
            {data && data.data.length ? (
              <>
                <DataTableDemo
                  columns={columns}
                  data={data.data}
                  mutate={mutate}
                />
                <PaginationDemo totalPages={totalPages} />
              </>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        ) : (
          <TableLoadingSkeleton />
        )}
      </div>
    </PageContainer>
  );
}
