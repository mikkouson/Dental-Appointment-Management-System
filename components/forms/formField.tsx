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
  age?: boolean;
}

export default function Field({
  form,
  name,
  label,
  data = [],
  erase = false,
  num = false,
  age = false,
}: FieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
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
            <Input
              type={!age ? "text" : "number"}
              placeholder={`Input ${name} here`}
              {...field}
              value={age ? field.value : field.value} // Ensure age is treated as a number
              onChange={(e) => {
                if (age) {
                  field.onChange(Number(e.target.value)); // Convert value to number
                } else {
                  field.onChange(e);
                }
              }}
            />
          )}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
