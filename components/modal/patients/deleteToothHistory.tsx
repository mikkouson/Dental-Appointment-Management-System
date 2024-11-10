import { useState } from "react";
import { deletePatient, deleteToothHistory } from "@/app/(admin)/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";

interface DeleteToothHistoryProps {
  id: number;
  form: {
    formState: {
      isSubmitting: boolean;
    };
  };
}

export function DeleteToothHistory({ id, form }: DeleteToothHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit() {
    setIsOpen(false);

    try {
      await deleteToothHistory(id);

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Patient updated successfully.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: "",
        duration: 3000,
      });
      console.error("Error in onSubmit:", error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full text-left justify-start text-destructive"
          >
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this patient?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Delete
            </Button>

            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
