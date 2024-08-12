"use client";
import { Button } from "@/components/ui/button";
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
import { useGetDate } from "@/app/store";
import moment from "moment";

export function DialogDemo() {
  const selectedDate = useGetDate((state) => state.selectedDate);
  const currentDate = moment(selectedDate).format("MM/DD/YYYY");

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
          <Input type="time" className="w-[280px]  py-6" />{" "}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
          {currentDate}
        </form>
      </DialogContent>
    </Dialog>
  );
}
