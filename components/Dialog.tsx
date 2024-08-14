"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerDemo } from "./DatePicker";
import { useGetDate, usegetTime } from "@/app/store";
import moment from "moment";
import SubmitButton from "./submitBtn";
import {
  cancelAppointment,
  rescheduleAppointment,
  tryA,
} from "@/app/admin/action";
import { mutate } from "swr";
import { useState } from "react";

export function DialogDemo({ id, status, date }) {
  const selectedDate = useGetDate((state) => state.selectedDate);
  const selectedTime = usegetTime((state) => state.getTime);
  const selectTime = usegetTime((state) => state.selectedTime);
  const formattedTime = moment(selectTime, "HH:mm").format("hh:mm A");
  const currentDate = moment(selectedDate).format("MM/DD/YYYY");
  const [time, setTime] = React.useState("");
  console.log("date:", date);
  console.log("currentDate:", currentDate);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4"></div>
          <DatePickerDemo />
          <Input
            type="time"
            name="time"
            className="w-[280px]  py-6"
            onChange={(e) => selectedTime(e.target.value)}
          />
          {/* <input type="text" name="date" value={currentDate} />
          <input type="text" name="id" value={id} />
          <input type="text" name="status" value={status} /> */}

          <DialogFooter>
            {/* <SubmitButton
              formAction={rescheduleAppointment}
              pendingText="Submiting..."
            >
              Save changes
            </SubmitButton> */}
            <SubmitButton
              formAction={async () => {
                await rescheduleAppointment(id, currentDate, formattedTime);
                mutate(`/api?date=${date}&status=${status.join(",")}`);
              }}
              pendingText="Submiting..."
            >
              Submits
            </SubmitButton>
          </DialogFooter>
          {formattedTime}
          {time}
        </form>
      </DialogContent>
    </Dialog>
  );
}
