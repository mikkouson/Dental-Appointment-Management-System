import React, { Suspense } from "react";
import Client from "@/components/tables/patients-tables/client";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Lobodent Dental Clinic - Patients",
};
export default function Patient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Client />
    </Suspense>
  );
}
