import React from "react";
import { Skeleton } from "../ui/skeleton";
import PageContainer from "../layout/page-container";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";

const PatientCardSkeleton = () => {
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <ScrollArea className="h-[calc(80vh-160px)]">
        <CardContent className="p-6 text-sm">
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-56 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <Skeleton className="h-4 w-1/3" />
      </CardFooter>
    </Card>
  );
};

export default PatientCardSkeleton;
