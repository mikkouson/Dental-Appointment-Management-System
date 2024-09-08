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
  value: string;
  onChange: (value: string) => void;
};

type DataItem = {
  id: string;
  name: string;
};

const FormSchema = z.object({
  patient: z.string({
    required_error: "Please select a patient to display.",
  }),
  service: z.string({
    required_error: "Please select an email to display.",
  }),
  branch: z.string({
    required_error: "Please select an email to display.",
  }),
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  time: z.number({
    required_error: "A date of birth is required.",
  }),
  type: z.string({
    required_error: "A date of birth is required.",
  }),
});

interface RadioBtnProps {
  data: readonly DataItem[];
  field: FieldProps;
  form?: UseFormReturn<z.infer<typeof FormSchema>>; // Make form optional
  timeclear?: boolean; // Keep timeclear optional
}
export function RadioBtn({
  data,
  field,
  form,
  timeclear = false,
}: RadioBtnProps) {
  const handleSetDate = (value: string) => {
    field.onChange(value);
    if (timeclear && value && form) {
      form.setValue("time", 0);
    }
  };

  return (
    <Select value={field.value} onValueChange={(value) => handleSetDate(value)}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
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
