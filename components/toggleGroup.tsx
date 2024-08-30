import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface ToggleGroupDemoProps {
  value: string;
  id: string;
  children: ReactNode;
  [key: string]: any;
}

export function ToggleGroupDemo({
  value,
  id,
  children,
  ...props
}: ToggleGroupDemoProps) {
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
