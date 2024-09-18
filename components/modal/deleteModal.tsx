import { deletePatient } from "@/app/admin/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import SubmitButton from "../buttons/submitBtn";

export function DeleteModal({ id }: { id: Number }) {
  const handleDelete = () => {
    deletePatient(Number(id));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trash2 className="text-sm w-5 text-red-500 mr-2 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this patient?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <form>
            <SubmitButton
              className="bg-red-500 text-white"
              formAction={handleDelete}
              pendingText="Deleting"
            >
              Delete
            </SubmitButton>
          </form>
          <DialogTrigger asChild>
            <Button type="button" className="ml-2">
              Cancel
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
