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
type Status = "accepted" | "pending" | "canceled";
interface DropdownMenuCheckboxesProps {
  item: Status[]; // Use Status type here
  store: { [key in Status]: boolean }; // Use Status type here
  formAction: (item: Status) => void; // Use Status type here
}

export function DropdownMenuCheckboxes({
  item,
  store,
  formAction,
}: DropdownMenuCheckboxesProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Open <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {item.map((s) => (
          <div key={s}>
            <DropdownMenuCheckboxItem
              checked={store[s]}
              onCheckedChange={() => formAction(s)}
            >
              {s}
            </DropdownMenuCheckboxItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
