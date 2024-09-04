import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "./ui/form";

export function SelectDemo({ data, field }) {
  return (
    <Select
      onValueChange={(value) => field.onChange(value)}
      value={field.value} // Use value here to show the selected item
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select a verified email to display" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.id} value={`${item.id}`}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
