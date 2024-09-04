import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "./ui/form";

type FieldProps = {
  value: string;
  onChange: (value: string) => void;
};

type DataItem = {
  id: string;
  name: string;
};

export function SelectDemo({
  data,
  field,
}: {
  data: DataItem[];
  field: FieldProps;
}) {
  return (
    <Select
      onValueChange={(value) => field.onChange(value)}
      value={field.value}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select a verified email to display" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
