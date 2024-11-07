"use client";

import { ChevronDown } from "lucide-react";
import { useBranches } from "../hooks/useBranches";
import FilterSelect from "./filterSelect";
import { Button } from "../ui/button";

const SelectBranch = () => {
  const { branches, branchLoading } = useBranches();

  if (branchLoading)
    return (
      <Button
        variant="outline"
        className="text-xs sm:text-sm flex w-full items-center p-0    mr-2 "
        disabled
      >
        <div className="mx-auto flex w-full items-center justify-between">
          <span className="mx-3 text-sm ">Branch</span>
          <ChevronDown className="mx-2 h-4 cursor-pointer hidden md:block" />
        </div>
      </Button>
    );

  // Transform branch data for the MultiSelect component
  const branchOptions = branches.map((branch: { id: any; name: any }) => ({
    id: branch.id, // Use id as value
    name: branch.name, // Use name as label
  }));

  return (
    <FilterSelect
      options={branchOptions}
      placeholder={"Branch"}
      param={"branches"}
    />
  );
};

export default SelectBranch;
