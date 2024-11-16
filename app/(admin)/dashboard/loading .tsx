import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = () => {
  return (
    <main className="overflow-auto rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <div className="hidden items-center space-x-2 md:flex">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[120px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-[100px] mb-2" />
                  <Skeleton className="h-3 w-[140px]" />
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Revenue Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-5 w-[140px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-5 w-[140px] mb-2" />
            </CardHeader>
            <CardContent>
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                    <Skeleton className="h-4 w-[60px] ml-auto" />
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Patient Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-5 w-[140px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <Skeleton className="h-5 w-[140px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default DashboardLoading;
