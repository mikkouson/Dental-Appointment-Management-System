"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { useGetDate } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePickerDemo() {
  const selectedDate = useGetDate((state) => state.selectedDate);
  const getDate = useGetDate((state) => state.getDate);

  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate || undefined
  );

  const handleSetDate = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      getDate(date);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>no date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSetDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
