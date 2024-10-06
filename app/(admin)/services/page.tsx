import Client from "@/components/tables/services-table/client";
import React, { Suspense } from "react";
import { Metadata } from "next";
import Loading from "./loading";
export const metadata: Metadata = {
  title: "Lobodent Dental Clinic - Services",
};
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Client />
    </Suspense>
  );
}
