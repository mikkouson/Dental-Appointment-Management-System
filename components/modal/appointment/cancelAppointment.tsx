import React, { useState } from "react";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CancelConfirmationDialogProps {
  onConfirm: () => Promise<void>;
  appointmentDate: string;
  appointmentTime?: string;
  disabled?: boolean;
}

const formatDate = (dateStr: string): string => {
  return moment(dateStr).format("dddd, MMMM D, YYYY");
};

const formatTime = (timeStr: string): string => {
  return moment(timeStr, "HH:mm").format("h:mm A");
};

const CancelConfirmationDialog = ({
  onConfirm,
  appointmentDate,
  appointmentTime,
  disabled = false,
}: CancelConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = formatDate(appointmentDate);
  const formattedTime = appointmentTime
    ? formatTime(appointmentTime)
    : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className={cn("gap-2", disabled && "opacity-50 cursor-not-allowed")}
          disabled={disabled}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Cancel Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <X className="w-5 h-5 text-red-500" />
            Cancel Appointment
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formattedDate}</span>
              </div>
              {formattedTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formattedTime}</span>
                </div>
              )}
            </div>
            <p className="text-sm">
              Are you sure you want to cancel this appointment? This action
              cannot be undone. You may be subject to a cancellation fee as per
              our policy.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Keep Appointment
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Yes, Cancel Appointment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmationDialog;
