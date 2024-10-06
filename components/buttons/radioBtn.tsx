"use client";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormControl } from "../ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

type FieldProps = {
  value: string | number;
  onChange: (value: string | number) => void;
};

type DataItem = {
  id: string | number; // Updated to support string or number id
  name: string;
};

const FormSchema = z.object({
  patient: z.string({
    required_error: "Please select a patient to display.",
  }),
  service: z.number({
    required_error: "Please select a service to display.",
  }),
  branch: z.number({
    required_error: "Please select a branch to display.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.number({
    required_error: "A time is required.",
  }),
  type: z.string({
    required_error: "A type is required.",
  }),
});

interface RadioBtnProps {
  data: readonly DataItem[];
  field: FieldProps;
  form?: UseFormReturn<z.infer<typeof FormSchema>>; // Make form optional
  timeclear?: boolean; // Keep timeclear optional
  num?: boolean; // Allow `num` to control type
  text?: boolean; // Optional prop to control display of search input
}

export function RadioBtn({
  data,
  field,
  form,
  timeclear = false,
  num = false,
  text = false, // Default to false if not provided
}: RadioBtnProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSetData = (id: string | number) => {
    field.onChange(id);
    setOpen(false);
    if (timeclear && form) {
      form.setValue("time", 0);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSearchQuery(""); // Clear search query when closing
    }
    setOpen(isOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
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
              ? data.find((item) => item.id === field.value)?.name
              : "Select option"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {text && ( // Conditionally render search input based on `text` prop
            <CommandInput
              placeholder="Search option..."
              onValueChange={(value) => setSearchQuery(value.toString())}
            />
          )}
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <ScrollArea
              className={"[&>[data-radix-scroll-area-viewport]]:max-h-[300px]"}
            >
              <CommandGroup>
                {filtered.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSetData(item.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        item.id === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
