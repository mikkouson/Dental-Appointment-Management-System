"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import List from "./List";

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const currentDate = moment(date).format("MM/DD/YYYY");
  return (
    <div className="flex  xl:mx-40   justify-between mt-10">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border max-h-80"
      />
      <List date={currentDate} />
    </div>
  );
}
