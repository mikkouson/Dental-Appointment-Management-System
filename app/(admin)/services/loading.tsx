import PageContainer from "@/components/layout/page-container";
import PatientCardSkeleton from "@/components/skeleton/patientCardSkeleton";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContainer>
      <div className="p-4 flex gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-36" />
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
