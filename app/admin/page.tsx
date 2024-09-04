"use client";

import BranchSelect from "@/components/BranchSelect";
import { CheckboxReactHookFormMultiple } from "@/components/ComboCheckBox";
import List from "@/components/List";
import { SelectForm } from "@/components/Select";
import SubmitButton from "@/components/submitBtn";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import moment from "moment";
import * as React from "react";
import useSWR from "swr";
import { useGetDate } from "../store";
import { newAppointment } from "./action";

const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());
export default function Admin() {
  const { data, error } = useSWR("/api/patients/", fetcher);
  const { data: statuses, error: statuserror } = useSWR(
    "/api/status/",
    fetcher
  );

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const branch = useGetDate((state) => state.branch);

  const currentDate = moment(date).format("MM/DD/YYYY");

  const { status: storeStatus } = useGetDate((state) => ({
    status: state.status,
  }));

  const { data: branchs, error: errorBranch } = useSWR("api/branch/", fetcher);
  if (!data || !statuses || !branchs) return <>Loading ...</>;
  if (error || statuserror) return <>Error loading data</>;

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
        <form action="">
          <Label htmlFor="patient">Patient</Label>
          <input name="patient"></input>
          <Label htmlFor="service">Service</Label>
          <input name="service"></input>
          <Label htmlFor="status">Status</Label>
          <input name="status"></input>
          <Label htmlFor="time">Time</Label>
          <input name="time"></input>
          <Label htmlFor="branch">branch</Label>
          <input name="branch"></input>
          <SubmitButton
            formAction={newAppointment}
            pendingText="Submitting...."
          >
            Submit
          </SubmitButton>
        </form>
        <div className="flex justify-end">
          <CheckboxReactHookFormMultiple items={statuses} label="Status" />
          <BranchSelect />
          <SelectForm />
        </div>
        <List
          date={currentDate}
          status={
            storeStatus.length > 0
              ? storeStatus
              : statuses.map((item) => item.id)
          }
          branch={branch === 0 ? branchs[0].id : branch}
        />
      </div>
    </div>
  );
}
