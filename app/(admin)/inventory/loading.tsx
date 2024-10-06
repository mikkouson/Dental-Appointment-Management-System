import PageContainer from "@/components/layout/page-container";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContainer>
      <div className="p-4">
        <div className="flex mb-4 gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/6" />
          </div>

          <TableLoadingSkeleton />
          <div className="flex items-center justify-between mt-6">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/6" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
