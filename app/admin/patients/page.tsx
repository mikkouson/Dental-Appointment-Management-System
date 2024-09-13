import React, { Suspense } from "react";
import Client from "@/components/tables/patients-tables/client";

export default function Patient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Client />
    </Suspense>
  );
}
