"use client";
import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxDemo({ label, id, formAction }) {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (isChecked) => {
    setChecked(isChecked);
    formAction(id, isChecked); // Pass the checked state to the parent
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={handleChange} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
