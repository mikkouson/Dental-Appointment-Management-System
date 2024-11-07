"use client";
import { ServicesCol } from "@/app/schema";
import { CSVExportButton } from "../csvExport";
import { useSearchParams } from "next/navigation";
import { useService } from "@/components/hooks/useService";

export default function ServicesExport() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { services: data } = useService(null, query, null);


  const mappedData = (data?.data || []).map((services: ServicesCol) => ({
    name: services.name || "null",
    description: services.description || "null",
    price: services.price || "null", 
  }));

  return <CSVExportButton data={mappedData} filename={"services.csv"} />;
}
