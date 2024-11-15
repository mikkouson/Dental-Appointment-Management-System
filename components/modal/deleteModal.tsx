import { useState } from "react";
import { deletePatient } from "@/app/(admin)/action";
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
import { Trash2 } from "lucide-react";
import SubmitButton from "../buttons/submitBtn";
type DeleteModalProps = {
  formAction: () => void;
  label: string;
};
export function DeleteModal({ formAction, label }: DeleteModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    formAction();
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
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
              Are you sure you want to delete this {label}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <form
              onSubmit={(event) => {
                event.preventDefault(); // Prevents default form submission
                handleDelete(); // Call deletion handler
              }}
            >
              <Button type="submit" variant="destructive">
                {" "}
                Delete
              </Button>
            </form>
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
