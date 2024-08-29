"use client";

import { CheckboxDemo } from "@/components/CheckBox";
import List from "@/components/List";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup } from "@radix-ui/react-dropdown-menu";
import moment from "moment";
import * as React from "react";

export default function Admin() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [statuses, setStatuses] = React.useState<string[]>([
    "accepted",
    "pending",
    "canceled",
  ]);
  const currentDate = moment(date).format("MM/DD/YYYY");

  const handleCheckboxChange = (status: string, checked: boolean) => {
    setStatuses((prevStatuses) => {
      if (checked) {
        return [...prevStatuses, status];
      } else {
        return prevStatuses.filter((s) => s !== status);
      }
    });
  };

  return (
    <div className="flex xl:mx-40 justify-between mt-10">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border "
        />
        <CheckboxDemo
          label={"Accepted"}
          id={"accepted"}
          formAction={handleCheckboxChange}
        />
        <CheckboxDemo
          label={"Canceled"}
          id={"canceled"}
          formAction={handleCheckboxChange}
        />
        <CheckboxDemo
          label={"Pending"}
          id={"pending"}
          formAction={handleCheckboxChange}
        />
        <RadioGroup />
      </div>

      <List date={currentDate} status={statuses} />
    </div>
  );
}
