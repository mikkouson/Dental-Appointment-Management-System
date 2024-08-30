"use client";
import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxDemoProps {
  label: string;
  id: string;
  formAction: (id: string, isChecked: boolean) => void;
}

export function CheckboxDemo({ label, id, formAction }: CheckboxDemoProps) {
  const [checked, setChecked] = React.useState<boolean>(true);

  const handleChange = (isChecked: boolean) => {
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
