"use client";

import { ChevronDown } from "lucide-react";
import { useBranches } from "../hooks/useBranches";
import FilterSelect from "./filterSelect";
import { Button } from "../ui/button";
import { useStatuses } from "../hooks/useStatuses";

const SelectStatus = () => {
  const { statuses, statusLoading } = useStatuses();

  if (statusLoading)
    return (
      <Button
        variant="outline"
        className="text-xs sm:text-sm flex w-full items-center p-0    mr-2 "
        disabled
      >
        <div className="mx-auto flex w-full items-center justify-between">
          <span className="mx-3 text-sm ">Status</span>
          <ChevronDown className="mx-2 h-4 cursor-pointer " />
        </div>
      </Button>
    );

  const statusOptions = statuses.map(
    (status: { id: number; name: string }) => ({
      id: status.id,
      name: status.name,
    })
  );

  return (
    <FilterSelect
      options={statusOptions}
      placeholder={"Status"}
      param={"statuses"}
    />
  );
};

export default SelectStatus;
