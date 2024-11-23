import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, startOfMonth, endOfMonth } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { useQueryState } from "nuqs";

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = useQueryState<DateRange | null>("date", {
    defaultValue: {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
    parse: (value) => {
      if (!value) return null;
      const [fromStr, toStr] = value.split(",");
      const from = new Date(fromStr);
      const to = new Date(toStr);
      // Check if both dates are valid
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        return { from, to };
      }
      return null; // Return null if dates are invalid
    },
    serialize: (value) => {
      if (!value || !value.from) return "";
      return `${value.from.toISOString()},${value.to?.toISOString()}`;
    },
  });

  const handleDateSelect = React.useCallback(
    (range: DateRange | undefined) => {
      setDate(range ?? null); // Convert undefined to null
    },
    [setDate]
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-full sm:w-[260px]",
              !date && "text-muted-foreground"
            )}
            size="sm"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:block">
              {date?.from ? (
                date?.to ? (
                  <>
                    {format(date.from, "MMM dd, yyyy")} -{" "}
                    {format(date.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                "Pick a date"
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date || undefined}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
