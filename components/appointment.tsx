"use client";
import { useGetDate } from "@/app/store";
import AppointmentsMap from "@/components/appointmentsList";
import { CheckboxReactHookFormMultiple } from "@/components/buttons/comboBoxSelect";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useSWR, { preload } from "swr";
import { NewAppointmentForm } from "./forms/appointment/new-appointment-form";
import PageContainer from "./layout/page-container";
import { useBranches } from "./hooks/useBranches";
import { useStatuses } from "./hooks/useStatuses";
import SelectBranch from "./buttons/selectBranch";
const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());

const timeSlots = [
  { id: 1, time: "8:00 AM" },
  { id: 2, time: "9:00 AM" },
  { id: 3, time: "10:00 AM" },
  { id: 4, time: "11:00 AM" },
  { id: 5, time: "12:00 PM" },
  { id: 6, time: "1:00 PM" },
  { id: 7, time: "2:00 PM" },
  { id: 8, time: "3:00 PM" },
  { id: 9, time: "4:00 PM" },
];

export default function AppointmentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);
  const { statuses, statusLoading, statusError } = useStatuses();
  const { branches, branchLoading, branchError } = useBranches();

  const { status: storeStatus } = useGetDate((state) => ({
    status: state.status,
  }));

  const statusIds = storeStatus.map((stat) => stat.id);
  const branch = useGetDate((state) => state.branch);
  const formatDate = moment(date).format("MM/DD/YYYY");
  const statusList = React.useMemo(
    () => statuses?.map((s: { id: number }) => s.id) || [],
    [statuses]
  );

  const {
    data: appointments = [],
    error: appointmentsError,
    isLoading,
    mutate,
  } = useSWR(
    `/api/appointments?date=${formatDate}&branch=${
      branches && branch !== 0 ? branch : branches ? branches[0]?.id : branch
    }&status=${statusIds.length === 0 ? statusList.join(",") : statusIds}`,
    fetcher
  );

  const supabase = createClient();

  useEffect(() => {
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

  if (statusLoading || branchLoading) return <>Loading ...</>;
  if (statusError || branchError) return <>Error loading data</>;

  if (appointmentsError) return <div>Error loading appointments</div>;

  return (
    <PageContainer>
      <div className=" flex flex-col lg:flex-row gap-4 ">
        {/* Left Column for Calendar */}
        <div className="mb-4 xl:mr-10">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mb-4 flex items-center justify-center "
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4 ">
            <CheckboxReactHookFormMultiple items={statuses} label="Status" />
            <SelectBranch />
            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Appointment"}
            >
              <NewAppointmentForm setOpen={setOpen} mutate={mutate} />
            </DrawerDialogDemo>
          </div>
          {isLoading ? (
            <div className="flex flex-col">
              {timeSlots.map((time) => (
                <div className="mb-4" key={time.id}>
                  <h2 className="text-lg font-semibold mb-2">{time.time}</h2>
                  <div className="flex flex-col border p-2">
                    <Skeleton className="h-2 w-3/4 mb-2" />
                    <Skeleton className="h-2 w-2/5 mb-2" />
                    <Skeleton className="h-2 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppointmentsMap
              timeSlots={timeSlots}
              appointments={appointments}
              mutate={mutate}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
