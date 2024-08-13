"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import List from "@/components/List";
import { CheckboxDemo } from "@/components/CheckBox";
import Lis from "@/components/Lis";

export default function Admin() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [statuses, setStatuses] = React.useState<string[]>([]); // Array to hold selected statuses
  console.log(statuses);
  const currentDate = moment(date).format("MM/DD/YYYY");

  const handleCheckboxChange = (status: string, checked: boolean) => {
    setStatuses((prevStatuses) => {
      if (checked) {
        // Add the status to the array if checked
        return [...prevStatuses, status];
      } else {
        // Remove the status from the array if unchecked
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
          className="rounded-md border max-h-80"
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
      </div>

      <List date={currentDate} status={statuses} />
    </div>
  );
}
