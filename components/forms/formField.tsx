import { RadioBtn } from "../buttons/radioBtn";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"; // Import the Textarea component

interface FieldProps {
  form: any;
  name: string;
  label: string;
  data?: readonly any[];
  erase?: boolean;
  defValue?: string;
  num?: boolean;
  age?: boolean;
  textarea?: boolean;
  disabled?: boolean; // Add disabled here

  search?: boolean;
  // Remove disabled from here since it will be included in ...props
}

export default function Field({
  form,
  name,
  label,
  data = [],
  erase = false,
  num = false,
  textarea = false,
  search = false,
  disabled = false, // Add disabled here
  ...props
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
              {...props}
            />
          ) : textarea ? (
            <Textarea
              placeholder={`Tell us a little bit about ${label}`}
              className="resize-none"
              disabled={disabled} // Pass disabled here
              {...field}
              {...props}
            />
          ) : (
            <Input
              type={!num ? "text" : "number"}
              placeholder={`Input ${label} here`}
              disabled={disabled} // Pass disabled here
              {...field}
              value={num ? field.value : field.value}
              onChange={(e) => {
                if (num) {
                  field.onChange(Number(e.target.value));
                } else {
                  field.onChange(e);
                }
              }}
              {...props}
            />
          )}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
