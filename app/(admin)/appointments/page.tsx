import React, { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumb";
import Client from "@/components/tables/appointment-table/client";

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
      <div className="">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <Client />
      </div>
    </Suspense>
  );
}
