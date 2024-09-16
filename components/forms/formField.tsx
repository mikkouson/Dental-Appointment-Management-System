import { RadioBtn } from "../buttons/radioBtn";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface FieldProps {
  form: any;
  name: string;
  label: string;
  data?: readonly any[]; // Mark data as optional
  erase?: boolean;
  defValue?: string;
  num?: boolean;
}

export default function Field({
  form,
  name,
  label,
  data = [],
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
          {data.length > 0 ? (
            <RadioBtn
              field={field}
              data={data}
              form={form}
              timeclear={erase}
              num={num}
            />
          ) : (
            <Input type="text" placeholder={`Input ${name} here`} {...field} />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
