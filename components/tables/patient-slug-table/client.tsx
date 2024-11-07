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

export default function UserClient() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  return (
    <PageContainer>
      <div className="flex flex-col h-[calc(100svh-20px)] ">
        <Tabs defaultValue="table" className="flex-grow">
          <div className="flex justify-between items-center mt-0 sm:mt-4">
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
          <div className="flex justify-between items-center">
            {/* Hide branch and status selectors on smaller screens only when search is focused */}
            {!isSearchFocused && (
              <div className="flex justify-end items-center">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 mr-2">
                  <TabsTrigger
                    value="table"
                    className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:dark:bg-neutral-800"
                  >
                    <Table2
                      className="md:hidden text-muted-foreground"
                      size={20}
                    />
                    <span className=" hidden md:block"> Table Mode</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="calendar"
                    className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:dark:bg-neutral-800"
                  >
                    <Calendar
                      className="md:hidden text-muted-foreground"
                      size={20}
                    />
                    <span className=" hidden md:block"> Calendar Mode</span>
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
            />
          </div>
          <TabsContent value="table">
            <div>
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
          </TabsContent>
          <TabsContent value="calendar">
            <AppointmentCalendar />
          </TabsContent>
        </Tabs>
        {/* Pagination now at the very end */}
      </div>
    </PageContainer>
  );
}
