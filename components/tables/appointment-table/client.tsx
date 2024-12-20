"use client";
import AppointmentCalendar from "@/components/appointment";
import AppointmentExport from "@/components/buttons/exportButtons/appointmentExport";
import SelectBranch from "@/components/buttons/selectBranch";
import SelectStatus from "@/components/buttons/selectStatus";
import { NewAppointmentForm } from "@/components/forms/appointment/new-appointment-form";
import { useAppointments } from "@/components/hooks/useAppointment";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Table2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { PaginationDemo } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import BurgerMenu from "@/components/buttons/burgerMenu";
import SearchInput from "@/components/searchInput";
import { useQueryState } from "nuqs";

export default function UserClient() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "table",
  });

  // Routing and URL Management
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const branch = searchParams.get("branches");
  const status = searchParams.get("statuses");
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const {
    appointments: data,
    appointmentsLoading: isLoading,
    mutate,
  } = useAppointments(page, query, branch, status, null, limit);

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

  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  const handleTabChange = async (value: string) => {
    await setActiveTab(value);
  };

  return (
    <PageContainer>
      <div className="flex flex-col h-[calc(100svh-20px)] ">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex-grow"
        >
          <div className="flex justify-between items-center mt-0 sm:mt-4 ">
            <div className="flex items-center">
              <BurgerMenu />
              <h4 className="scroll-m-20 text-md font-semibold tracking-tight sm:hidden">
                Total Appointments ({data ? data.count : "Loading"})
              </h4>
              <Heading
                title={`Total Appointments (${data ? data.count : "Loading"})`}
                description="Manage Appointments (Server side table functionalities.)"
              />
            </div>
            <div className="flex items-center ">
              <AppointmentExport />
              <DrawerDialogDemo
                open={open}
                setOpen={setOpen}
                label={"New Appointment"}
              >
                <NewAppointmentForm setOpen={setOpen} mutate={mutate} />
              </DrawerDialogDemo>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center pb-2">
            {!isSearchFocused && (
              <div className="flex justify-end items-center gap-2">
                <TabsList className="w-full justify-start ">
                  <TabsTrigger value="table">
                    <Table2
                      className="md:hidden text-muted-foreground"
                      size={20}
                    />
                    <span className="hidden md:block">Table Mode</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <Calendar
                      className="md:hidden text-muted-foreground"
                      size={20}
                    />
                    <span className="hidden md:block">Calendar Mode</span>
                  </TabsTrigger>
                </TabsList>
                <SelectBranch />
                <SelectStatus />
              </div>
            )}
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              handleSearch={handleSearch}
              label="Patient"
            />
          </div>
          <TabsContent value="table">
            <div>
              {!isLoading ? (
                <>
                  <DataTableDemo
                    columns={columns}
                    data={data?.data || []}
                    mutate={mutate}
                  />
                  <PaginationDemo totalPages={totalPages} />
                </>
              ) : (
                <TableLoadingSkeleton />
              )}
            </div>
          </TabsContent>
          <TabsContent value="calendar">
            <AppointmentCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
