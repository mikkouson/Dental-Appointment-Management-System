import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "./ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type FieldProps = {
  value: string | number; // Allow both string and number
  onChange: (value: string | number) => void; // Allow both string and number
};

type DataItem = {
  id: string;
  name: string;
};

const FormSchema = z.object({
  patient: z.string({
    required_error: "Please select a patient to display.",
  }),
  service: z.number({
    required_error: "Please select a service to display.",
  }),
  branch: z.number({
    required_error: "Please select a branch to display.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.number({
    required_error: "A time is required.",
  }),
  type: z.string({
    required_error: "A type is required.",
  }),
});

interface RadioBtnProps {
  data: readonly DataItem[];
  field: FieldProps;
  form?: UseFormReturn<z.infer<typeof FormSchema>>; // Make form optional
  timeclear?: boolean; // Keep timeclear optional
  num?: boolean; // Allow `num` to control type
}

export function RadioBtn({
  data,
  field,
  form,
  timeclear = false,
  num = false,
}: RadioBtnProps) {
  const handleSetDate = (value: string) => {
    const newValue = num ? Number(value) : value;
    field.onChange(newValue);

    if (timeclear && value && form) {
      form.setValue("time", 0);
    }
  };

  return (
    <Select
      value={
        num
          ? typeof field.value === "number"
            ? field.value.toString()
            : ""
          : typeof field.value === "string"
          ? field.value
          : ""
      }
      onValueChange={(value) => handleSetDate(value)}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.id} value={item.id.toString()}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
