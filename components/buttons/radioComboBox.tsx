"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

interface DropdownItem {
  id: number;
  name: string;
}

interface DropdownMenuRadioProps<T extends DropdownItem> {
  data: T[];
  selectedItem: T | null;
  store: T;
  action: (value: number) => void;
  label: string;
}

export default function RadioComboBox<T extends DropdownItem>({
  data,
  selectedItem,
  store,
  action,
  label,
}: DropdownMenuRadioProps<T>) {
  if (!data)
    return (
      <Button variant="outline">
        Branch: Loading ...
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
    );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className=" text-xs sm:text-sm px-2 sm:px-4"
          >
            {label} <span className="hidden sm:inline">:</span>
            <span className="ml-2 hidden sm:inline ">
              {selectedItem
                ? selectedItem.name
                : data.length > 0
                ? data[0].name
                : "Select a branch"}
            </span>
            <ChevronDownIcon className="ml-2 h-4 w-4 hidden sm:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {data.map((item) => (
            <DropdownMenuRadioGroup
              key={item.id}
              value={store.toString()}
              onValueChange={(value) => {
                action(Number(value));
              }}
            >
              <DropdownMenuRadioItem value={item.id.toString()}>
                {item.name}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
