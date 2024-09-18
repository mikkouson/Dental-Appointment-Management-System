"use client";
import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};
export default function SubmitButton({
  children,
  pendingText,
  ...props
}: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action == props?.formAction;
  return (
    <Button {...props} type="submit" aria-disabled={pending}>
      {isPending ? (
        <>
          <Loader2 className="w-4 animate-spin mr-2" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
