import { deleteToothHistory } from "@/app/(admin)/action";
import { useTeethArray } from "@/app/store";
import { toast } from "@/components/hooks/use-toast";
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
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DeleteToothHistoryProps {
  id: number;
  form: {
    formState: {
      isSubmitting: boolean;
    };
  };
  newPatient?: boolean;
  location?: number;
}

export function DeleteToothHistory({
  id,
  form,
  newPatient = false,
  location,
}: DeleteToothHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteTooth } = useTeethArray();
  async function handleSubmit() {
    setIsOpen(false);

    try {
      if (newPatient || location !== undefined) {
        deleteTooth(location!);
      }

      if (id) {
        await deleteToothHistory(id);
      }
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: `Tooth history deleted successfully. ${location}`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: "Failed to delete the tooth history",
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
              Are you sure you want to perform delete action?
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
