import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FormSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Patient Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
      </div>

      {/* Branch Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Status Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Service Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Type Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Date Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-4 w-64" /> {/* Help text */}
      </div>

      {/* Time Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-4 w-64" /> {/* Help text */}
      </div>
    </div>
  );
};

export default FormSkeleton;
