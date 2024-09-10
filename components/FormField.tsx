import { RadioBtn } from "./RadioBtn";
import { FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

interface FieldProps {
  form: any;
  name: string;
  label: string;
  data: readonly any[];
  erase?: boolean; // Mark erase as optional
  defValue?: string | undefined;
  num?: boolean;
}

export default function Field({
  form,
  name,
  label,
  data,
  erase = false,
  num = false,
}: FieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <RadioBtn
            field={field}
            data={data}
            form={form}
            timeclear={erase}
            num={num}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
