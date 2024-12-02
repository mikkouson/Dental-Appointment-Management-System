"use client";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import FilterSelect from "./filterSelect";

const FilterInventoryCategory = () => {
  const categoryOptions = [
    { id: "Disposable Supplies", name: "Disposable Supplies" },
    { id: "Medical Instruments", name: "Medical Instruments" },
    { id: "Orthodontic Supplies", name: "Orthodontic Supplies" },
    { id: "Dental Tools", name: "Dental Tools" },
    { id: "Protective Equipment", name: "Protective Equipment" },
  ];

  return (
    <FilterSelect
      options={categoryOptions}
      placeholder={"Category"}
      param={"category"}
    />
  );
};

export default FilterInventoryCategory;
