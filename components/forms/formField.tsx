import { RadioBtn } from "../buttons/radioBtn";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"; // Import the Textarea component

interface FieldProps {
  form: any;
  name: string;
  label: string;
  data?: readonly any[]; // Mark data as optional
  erase?: boolean;
  defValue?: string;
  num?: boolean;
  age?: boolean;
  textarea?: boolean;
  search?: boolean;
}

export default function Field({
  form,
  name,
  label,
  data = [],
  erase = false,
  num = false,
  textarea = false, // Default to false if not provided
  search = false,
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
              text={search}
            />
          ) : textarea ? ( // Render Textarea if textarea prop is true
            <Textarea
              placeholder={`Tell us a little bit about ${name}`}
              className="resize-none"
              {...field}
            />
          ) : (
            <Input
              type={!num ? "text" : "number"}
              placeholder={`Input ${name} here`}
              {...field}
              value={num ? field.value : field.value} // Ensure num is treated as a number
              onChange={(e) => {
                if (num) {
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
