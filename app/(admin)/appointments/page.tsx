import Client from "@/components/tables/appointment-table/client";
import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCalendar from "@/components/appointment";
import { Breadcrumbs } from "@/components/breadcrumb";
import { Metadata } from "next";
import Loading from "./loading";
export const metadata: Metadata = {
  title: "Lobodent Dental Clinic - Appointments",
};
// Breadcrumb items
const breadcrumbItems = [
  { title: "Dashboard", link: "/" },
  { title: "Appointments", link: "/appointments" },
];

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Tabs defaultValue="table">
        <div className="px-4 md:px-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex  items-center mt-2  sm:mt-4">
            <TabsList>
              <TabsTrigger className="text-xs sm:text-sm" value="table">
                Table Mode
              </TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="calendar">
                Calendar Mode
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="table">
          <Client />
        </TabsContent>
        <TabsContent value="calendar">
          <AppointmentCalendar />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
