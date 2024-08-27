import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDemo() {
  const timeSlots = [
    "8:00 - 9:00 AM",
    "9:00 - 10:00 AM",
    "10:00 - 11:00 AM",
    "11:00 - 12:00 PM",
    "12:00 - 1:00 PM",
    "1:00 - 2:00 PM",
    "2:00 - 3:00 PM",
    "3:00 - 4:00 PM",
    "4:00 - 5:00 PM",
  ];

  return (
    <Select onValueChange={(value) => console.log(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a time slot" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time Slots</SelectLabel>
          {timeSlots.map((slot) => (
            <SelectItem key={slot} value={slot} className="text-justify">
              {slot}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
