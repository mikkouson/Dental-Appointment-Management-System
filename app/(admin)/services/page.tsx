import Client from "@/components/tables/services-table/client";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Client />
    </Suspense>
  );
}
