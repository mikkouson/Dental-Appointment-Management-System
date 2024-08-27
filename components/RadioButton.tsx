import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

export function RadioButton({ value, id, children, ...props }) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} {...props} />
      <Label htmlFor={id}>{children}</Label>
    </div>
  );
}
