"use client";

import { useGetDate } from "@/app/store";
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
import React from "react";
import useSWR from "swr";

const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());

export default function BranchSelect() {
  const branch1 = useGetDate((state) => state.branch);
  const setBranch = useGetDate((state) => state.setBranch);

  const { data, error } = useSWR("api/branch/", fetcher);

  if (error) return <>Failed to load</>;
  if (!data)
    return (
      <Button variant="outline">
        Branch : Loading ...
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
    );

  const selectedBranch = data.find((branch) => branch.id === branch1);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Branch : {selectedBranch ? selectedBranch.name : "Select a branch"}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {data.map((branch) => (
            <DropdownMenuRadioGroup
              key={branch.id}
              value={branch1.toString()}
              onValueChange={(value) => {
                setBranch(Number(value));
              }}
            >
              <DropdownMenuRadioItem value={branch.id.toString()}>
                {branch.name}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
