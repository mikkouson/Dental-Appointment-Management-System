import React, { Suspense } from "react";
import { Metadata } from "next";
import Loading from "./loading";
import Client from "@/components/tables/doctors-table/client";
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
