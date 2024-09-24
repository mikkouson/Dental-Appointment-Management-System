import React, { Suspense } from "react";
import Client from "@/components/tables/patients-tables/client";
import { SheetDemo } from "@/components/modal/sheet";

export default function Patient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Client />
    </Suspense>
  );
}
