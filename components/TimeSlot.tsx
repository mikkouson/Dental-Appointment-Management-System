"use client";

import { useGetDate } from "@/app/store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import moment from "moment";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TimeSlot() {
  const { getTime, selectedTime, selectedDate } = useGetDate();
  const branch = useGetDate((state) => state.branch);

  const date = moment(selectedDate).format("MM/DD/YYYY");
  const { data, error } = useSWR(
    `/api/timeslots?date=${date}&branch=${branch}`,
    fetcher
  );

  if (error) return <div>Error loading timeslots.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={selectedTime}
      onValueChange={(value) => {
        if (value) {
          getTime(value);
        }
      }}
      className="flex flex-wrap"
    >
      {data &&
        data?.map((slot: { id: string; time: string; appointments: any[] }) => {
          const isDisabled = slot.appointments.length >= 3;
          return (
            <ToggleGroupItem
              key={slot.id}
              value={slot.id}
              aria-disabled={isDisabled}
              className={`${
                isDisabled ? "bg-gray-300 cursor-not-allowed" : ""
              } ${selectedTime === slot.id ? "bg-gray-200" : ""}`}
              disabled={isDisabled}
            >
              <div className="flex ">
                <span className="mr-4">
                  Time: {moment(slot.time, "HH:mm").format("hh:mm A")}
                </span>
                <span>Slot: {slot.appointments.length}</span>
              </div>
            </ToggleGroupItem>
          );
        })}
    </ToggleGroup>
  );
}
