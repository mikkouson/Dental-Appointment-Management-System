"use client";

import { MultiSelect } from "@/components/multi-select";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

interface Option {
  name: string;
  id: string;
}

interface SelectBranchProps {
  options: Option[];
  placeholder: string;
  param: string;
}

const FilterSelect = ({ options, placeholder, param }: SelectBranchProps) => {
  const [page, setPage] = useQueryState("page");
  const [selectedQuery, setSelectedQuery] = useQueryState(
    param,
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const handleValueChange = (newSelectedValues: string[]) => {
    setSelectedQuery(newSelectedValues);
    setPage(null);
  };

  return (
    <>
      <MultiSelect
        options={options}
        onValueChange={handleValueChange}
        defaultValue={selectedQuery}
        placeholder={placeholder}
        variant="inverted"
        maxCount={3}
      />
    </>
  );
};

export default FilterSelect;
