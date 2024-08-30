"use client";

import { rescheduleAppointment } from "@/app/admin/action";
import { useGetDate } from "@/app/store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import moment from "moment";
import { mutate } from "swr";
import { DatePickerDemo } from "./DatePicker";
import SubmitButton from "./submitBtn";
import TimeSlot from "./TimeSlot";

// Define prop types
interface SheetDemoProps {
  id: string;
  status: string[];
  date: string;
}

export function SheetDemo({ id, status, date }: SheetDemoProps) {
  const selectedDate = useGetDate((state) => state.selectedDate);
  const selectTime = useGetDate((state) => state.selectedTime);
  const getDate = useGetDate((state) => state.getDate);
  const currentDate = moment(selectedDate).format("MM/DD/YYYY");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => getDate(new Date(date))}>
          Open
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Appointment</SheetTitle>
          <SheetDescription>
            Make changes to the appointment here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>
        <form>
          <div className="grid gap-4 py-4">
            <DatePickerDemo />
          </div>
          <TimeSlot />

          <SheetFooter>
            <SubmitButton
              formAction={async () => {
                if (selectedDate && selectTime) {
                  await rescheduleAppointment({
                    id,
                    date: currentDate,
                    time: selectTime,
                  });
                  mutate(
                    `/api/appointments?date=${date}&status=${status.join(",")}`
                  );
                } else {
                  alert("Please select a date and time.");
                }
              }}
              pendingText="Submitting..."
            >
              Submit
            </SubmitButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
