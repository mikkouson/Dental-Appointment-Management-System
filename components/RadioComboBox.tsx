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
        Branch : Loading ...
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
    );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {label} : {selectedItem ? selectedItem.name : "Select a branch"}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {data.map((item) => (
            <DropdownMenuRadioGroup
              key={item.id}
              value={store.id.toString()}
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
