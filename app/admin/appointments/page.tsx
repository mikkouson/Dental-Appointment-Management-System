"use client";

import { useGetDate } from "@/app/store";
import BranchSelect from "@/components/BranchSelect";
import { CheckboxReactHookFormMultiple } from "@/components/ComboCheckBox";
import { DrawerDialogDemo } from "@/components/NewPatient";
import AppointmentsMap from "@/components/Appointments";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

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

export default function Appointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: patients, error: patientsError } = useSWR(
    "/api/patients/",
    fetcher
  );
  const { data: statuses, error: statusesError } = useSWR(
    "/api/status/",
    fetcher
  );
  const { data: branches, error: branchesError } = useSWR(
    "/api/branch/",
    fetcher
  );
  const { data: statusData, error: statusDataError } = useSWR(
    "/api/status/",
    fetcher
  );

  const { status: storeStatus } = useGetDate((state) => ({
    status: state.status,
  }));

  const statusIds = storeStatus.map((stat) => stat.id);
  const branch = useGetDate((state) => state.branch);
  const formatDate = moment(date).format("MM/DD/YYYY");
  const statusList = React.useMemo(
    () => statusData?.map((s) => s.id) || [],
    [statusData]
  );

  const supabase = createClientComponentClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          mutate(
            `/api/appointments?date=${formatDate}&branch=${
              branches && branch !== 0
                ? branch
                : branches
                ? branches[0]?.id
                : branch
            }&status=${
              statusIds.length === 0 ? statusList.join(",") : statusIds
            }`
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, formatDate, branches, branch, statusIds, statusList]);

  const {
    data: appointments = [],
    error: appointmentsError,
    isLoading,
  } = useSWR(
    `/api/appointments?date=${formatDate}&branch=${
      branches && branch !== 0 ? branch : branches ? branches[0]?.id : branch
    }&status=${statusIds.length === 0 ? statusList.join(",") : statusIds}`,
    fetcher
  );

  if (!patients || !statuses || !branches) return <>Loading ...</>;
  if (patientsError || statusesError || branchesError)
    return <>Error loading data</>;

  if (appointmentsError) return <div>Error loading appointments</div>;

  return (
    <div className="flex xl:mx-40 justify-between mt-10">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>

      <div className="w-full pl-10 flex-col">
        <div className="flex justify-end">
          <DrawerDialogDemo label={"New Appointment"} />
          <CheckboxReactHookFormMultiple items={statuses} label="Status" />
          <BranchSelect />
        </div>
        <div>
          {isLoading ? (
            <div>
              {timeSlots.map((time) => (
                <div className="mb-2" key={time.id}>
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
