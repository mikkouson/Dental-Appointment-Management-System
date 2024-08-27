import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

export function ToggleGroupDemo({ value, id, children, ...props }) {
  return (
    <ToggleGroup type="single" size="sm">
      <ToggleGroupItem
        value={value}
        id={id}
        {...props}
        aria-label={`Toggle ${value}`}
      >
        <Label htmlFor={id}>{children}</Label>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
