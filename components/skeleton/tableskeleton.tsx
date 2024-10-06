import React from "react";
import { Skeleton } from "../ui/skeleton";
import PageContainer from "../layout/page-container";

const TableLoadingSkeleton = () => {
  return (
    <div className="w-full border  rounded-md">
      <div className="grid grid-cols-7 gap-4 p-4">
        <Skeleton className="h-4 w-full col-span-1" />
        <Skeleton className="h-4 w-full col-span-1" />
        <Skeleton className="h-4 w-full col-span-1" />
        <Skeleton className="h-4 w-full col-span-1" />
        <Skeleton className="h-4 w-full col-span-1" />
        <Skeleton className="h-4 w-full col-span-1" />
        <Skeleton className="h-4 w-full col-span-1" />
      </div>
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="grid grid-cols-7 gap-4 p-4 border-t ">
          <Skeleton className="h-4 w-full col-span-1" />
          <Skeleton className="h-4 w-full col-span-1" />
          <Skeleton className="h-4 w-full col-span-1" />
          <Skeleton className="h-4 w-full col-span-1" />
          <Skeleton className="h-4 w-full col-span-1" />
          <Skeleton className="h-4 w-full col-span-1" />
          <Skeleton className="h-4 w-full col-span-1" />
        </div>
      ))}
    </div>
  );
};

export default TableLoadingSkeleton;
