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
import { UseFormReturn } from "react-hook-form";
import { AppointmentSchemaType } from "@/app/types";
type FieldProps = {
  value: Date | null;
  onChange: (date: Date) => void;
};

export function CalendarForm({
  field,
  form,
  patientAppointments,
  dontdis,
}: {
  field: FieldProps;
  form: UseFormReturn<AppointmentSchemaType>; // Replace AppointmentSchemaType with your actual form data type
  patientAppointments: (Date | string)[]; // Adjust type if needed
  dontdis?: Date; // Optional date that should not be disabled
}) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const getDate = useGetDate((state) => state.getDate);

  const handleSetDate = (date: Date | undefined) => {
    if (date) {
      field.onChange(date);
      getDate(date);
      setIsCalendarOpen(false);
      form.setValue("time", 0);
    }
  };

  const parseDate = (date: Date | string): Date => {
    return typeof date === "string" ? new Date(date) : date;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to ensure correct comparison
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const dateStr = date.toDateString();
    const dontdisStr = dontdis?.toDateString();
    const isWithinDateRange = date >= today && date <= thirtyDaysFromNow;

    return (
      !isWithinDateRange || // Disable dates outside the range
      patientAppointments.some(
        (apptDate) => parseDate(apptDate).toDateString() === dateStr
      ) ||
      dontdisStr === dateStr // Disable specific date if `dontdis` matches
    );
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full flex pl-3 text-left font-normal",
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
          disabled={isDateDisabled}
        />
      </PopoverContent>
    </Popover>
  );
}
