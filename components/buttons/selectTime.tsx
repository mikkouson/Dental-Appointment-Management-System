import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDownIcon, Loader2 } from "lucide-react";
import useSWR from "swr";
import moment from "moment";
import { TooltipDemo } from "../ToolTip";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type TimeSlotProps = {
  date: Date;
  branch: string;
  field: {
    value: number;
    onChange: (value: number) => void;
  };
};

export default function TimeSlot({ branch, field, date }: TimeSlotProps) {
  const [open, setOpen] = React.useState(false);

  const dates = moment(date).format("MM/DD/YYYY");
  const { data, error } = useSWR(
    `/api/timeslots?date=${dates}&branch=${branch}`,
    fetcher
  );

  if (error) return <div>Error loading time slots.</div>;
  if (!data)
    return (
      <>
        <Button
          variant="outline"
          className="w-full flex justify-between"
          disabled
        >
          Select Time Slot <Loader2 className="animate-spin" />
        </Button>
      </>
    );

  const handleSelect = (value: number) => {
    field.onChange(value);
  };
  const formatTime = (time: string) => {
    return moment(time, "HH:mm:ss").format("hh:mm A");
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? formatTime(
                  data.find((slot: { id: number }) => slot.id === field.value)
                    ?.time
                )
              : "Select Time Slot"}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
        <Command>
          <CommandList>
            <CommandEmpty>No time slots available.</CommandEmpty>
            <CommandGroup>
              {data.map(
                (slot: { id: number; time: string; appointments: any[] }) => {
                  const isDisabled = slot.appointments.length >= 3;
                  return (
                    <div
                      key={slot.id}
                      className={cn(
                        isDisabled
                          ? "flex flex-row-reverse justify-between"
                          : ""
                      )}
                    >
                      {isDisabled ? (
                        <TooltipDemo text={isDisabled ? "Out of slots" : ""} />
                      ) : (
                        <></>
                      )}
                      <CommandItem
                        value={slot.id.toString()}
                        onSelect={() => {
                          if (!isDisabled) {
                            handleSelect(slot.id);
                            setOpen(false);
                          }
                        }}
                        className={cn(
                          "flex",
                          field.value === slot.id ? "" : "",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={isDisabled}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === slot.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <p>{formatTime(slot.time)}</p>
                      </CommandItem>
                    </div>
                  );
                }
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
