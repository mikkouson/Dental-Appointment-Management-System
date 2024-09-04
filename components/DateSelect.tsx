import { useGetDate } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";

type FieldProps = {
  value: Date | null;
  onChange: (date: Date) => void;
};

export function CalendarForm({ field }: { field: FieldProps }) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const getDate = useGetDate((state) => state.getDate);

  const handleSetDate = (date: Date | undefined) => {
    if (date) {
      field.onChange(date);
      getDate(date);
      setIsCalendarOpen(false);
    }
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value ?? undefined}
          onSelect={handleSetDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
