"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import List from "@/components/List";
import { CheckboxDemo } from "@/components/CheckBox";

export default function Admin() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [status, setStatus] = React.useState<string | undefined>();
  const currentDate = moment(date).format("MM/DD/YYYY");

  const handleCheckboxChange = (selectedStatus: string) => {
    setStatus(selectedStatus);
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

        <div onClick={() => handleCheckboxChange("accepted")}>
          <CheckboxDemo label={"Accepted"} id={"accepted"} />
        </div>
        <div onClick={() => handleCheckboxChange("canceled")}>
          <CheckboxDemo label={"Canceled"} id={"canceled"} />
        </div>
        <div onClick={() => handleCheckboxChange("pending")}>
          <CheckboxDemo label={"Pending"} id={"pending"} />
        </div>
      </div>

      <List date={currentDate} status={status} />
    </div>
  );
}
