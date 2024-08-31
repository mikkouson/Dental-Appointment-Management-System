"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

// Make the component generic
interface DropdownMenuCheckboxesProps<T extends string> {
  items: T[];
  store: { [key in T]: boolean };
  formAction: (item: T) => void;
  label: string;
}

export function DropdownMenuCheckboxes<T extends string>({
  items,
  store,
  formAction,
  label,
}: DropdownMenuCheckboxesProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {label} <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <div key={item}>
            <DropdownMenuCheckboxItem
              checked={store[item]}
              onCheckedChange={() => formAction(item)}
            >
              {item}
            </DropdownMenuCheckboxItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
