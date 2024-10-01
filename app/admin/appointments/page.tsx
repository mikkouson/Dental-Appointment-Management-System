import Client from "@/components/tables/appointment-table/client";
import React, { Suspense } from "react";

export default function Patient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Client />
    </Suspense>
  );
}
