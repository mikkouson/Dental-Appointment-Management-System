"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR from "swr";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export function DropdownMenuCheckboxes() {
  const [checkedStatusIds, setCheckedStatusIds] = React.useState<string[]>([]);
  const { data: status, isLoading } = useSWR<any>(`/api/status`, fetcher);

  const handleCheckboxChange = (statusId: string, isChecked: boolean) => {
    let updatedStatusIds = [...checkedStatusIds];

    if (isChecked) {
      updatedStatusIds.push(statusId);
    } else {
      updatedStatusIds = updatedStatusIds.filter((id) => id !== statusId);
    }

    setCheckedStatusIds(updatedStatusIds);

    // Update query parameters in URL
    const urlSearchParams = new URLSearchParams();
    if (updatedStatusIds.length > 0) {
      urlSearchParams.set("status", updatedStatusIds.join(","));
    }

    // Replace current URL with updated query parameters
    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  if (isLoading)
    return (
      <Button aria-disabled variant="outline">
        Loading
      </Button>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-disabled={isLoading} variant="outline">
          Open
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {status &&
          status.map((statusItem: any) => (
            <DropdownMenuCheckboxItem
              key={statusItem.id}
              checked={checkedStatusIds.includes(statusItem.id)}
              onCheckedChange={(isChecked) =>
                handleCheckboxChange(statusItem.id, isChecked)
              }
            >
              {statusItem.name}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
