"use client";
import { useGetDate } from "@/app/store";
import BranchSelect from "@/components/buttons/selectbranch-btn";
import { CheckboxReactHookFormMultiple } from "@/components/buttons/comboBoxSelect";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useSWR, { preload } from "swr";
import AppointmentsMap from "@/components/appointmentsList";
import { NewAppointmentForm } from "@/components/forms/new-appointment-form";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
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

preload(`/api/appointments`, fetcher);
preload(`/api/status`, fetcher);
preload(`/api/branch`, fetcher);
export default function Appointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);

  const { data: statuses, error: statusesError } = useSWR(
    "/api/status/",
    fetcher
  );
  const { data: branches, error: branchesError } = useSWR(
    "/api/branch/",
    fetcher
  );

  const { status: storeStatus } = useGetDate((state) => ({
    status: state.status,
  }));

  const statusIds = storeStatus.map((stat) => stat.id);
  const branch = useGetDate((state) => state.branch);
  const formatDate = moment(date).format("MM/DD/YYYY");
  const statusList = React.useMemo(
    () => statuses?.map((s) => s.id) || [],
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

  if (!statuses || !branches) return <>Loading ...</>;
  if (statusesError || branchesError) return <>Error loading data</>;

  if (appointmentsError) return <div>Error loading appointments</div>;

  return (
    <div className="mx-auto grid grid-cols-4 gap-4 w-full max-w-[93rem] p-5">
      {/* Left Column for Calendar */}
      <div className="col-span-1 mr-10">
        <>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mb-4 flex items-center justify-center"
          />
        </>
      </div>

      {/* Right Column */}
      <div className="col-span-3 flex flex-col">
        <div className="flex justify-end mb-4 space-x-4">
          <CheckboxReactHookFormMultiple items={statuses} label="Status" />
          <BranchSelect />
          <DrawerDialogDemo
            open={open}
            setOpen={setOpen}
            label={"New Appointment"}
          >
            <NewAppointmentForm setOpen={setOpen} />
          </DrawerDialogDemo>
        </div>
        {isLoading ? (
          <div>
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
          <AppointmentsMap timeSlots={timeSlots} appointments={appointments} />
        )}
      </div>
    </div>
  );
}
