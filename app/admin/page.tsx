"use client";

import { DropdownMenuCheckboxes } from "@/components/ComboBox";
import { Calendar } from "@/components/ui/calendar";
import List from "@/components/List";
import moment from "moment";
import * as React from "react";
import { useGetDate } from "../store";
type Status = "accepted" | "pending" | "canceled";

const statuses: Status[] = ["accepted", "pending", "canceled"];

export default function Admin() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const currentDate = moment(date).format("MM/DD/YYYY");

  const { status: storeStatus, setStatus } = useGetDate((state) => ({
    status: state.status,
    setStatus: state.setStatus,
  }));

  const activeStatuses = statuses.filter((s) => storeStatus[s]);

  const handleCheckedChange = (item: Status) => {
    const newStatus = { ...storeStatus, [item]: !storeStatus[item] };
    setStatus(newStatus);
  };

  return (
    <div className="flex xl:mx-40 justify-between mt-10">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />

        <DropdownMenuCheckboxes
          item={statuses}
          formAction={handleCheckedChange}
          store={storeStatus}
        />
      </div>

      <List date={currentDate} status={activeStatuses} />
    </div>
  );
}
