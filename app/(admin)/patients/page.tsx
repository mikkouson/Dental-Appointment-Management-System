import React, { Suspense } from "react";
import Client from "@/components/tables/patients-tables/client";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "./loading";
export const metadata: Metadata = {
  title: "Lobodent Dental Clinic - Patients",
};
export default function Patient() {
  return (
    <Suspense fallback={<Loading />}>
      <Client />
    </Suspense>
  );
}
