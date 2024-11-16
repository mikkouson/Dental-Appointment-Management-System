import PageContainer from "@/components/layout/page-container";
import PatientCardSkeleton from "@/components/skeleton/patientCardSkeleton";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/breadcrumb";

export default function Loading() {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <Breadcrumbs
          items={[
            { title: "Dashboard", link: "/" },
            { title: "Patients", link: "/patients" },
          ]}
        /> */}
        <div className="flex flex-col 2xl:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-80" />
          </div>
          <div className="flex justify-end max-w-full w-full mt-2 sm:ml-0 sm:max-w-full 2xl:max-w-[730px]">
            <div className="mr-2 relative w-full md:w-[200px] lg:w-[320px]">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row">
          <div className="flex-1 space-y-4">
            <TableLoadingSkeleton />
            <div className="flex items-center justify-between mt-6">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/6" />
            </div>
          </div>
          <div className="w-full mt-5 xl:w-1/5 xl:ml-5 xl:mt-0">
            <PatientCardSkeleton />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
