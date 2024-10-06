import Client from "@/components/tables/inventory-table/client";
import React, { Suspense } from "react";
import { Metadata } from "next";
import Loading from "./loading";
export const metadata: Metadata = {
  title: "Lobodent Dental Clinic - Inventory",
};
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Client />
    </Suspense>
  );
}
