"use client";
import { InventoryCol } from "@/app/schema"; 
import { useInventory } from "@/components/hooks/useInventory"; 
import { CSVExportButton } from "../csvExport"; 
export default function InventoryExport() {
  const { inventory: data } = useInventory(); 

  const mappedData = (data?.data || []).map((item: InventoryCol) => ({
    id: item.id || "null",
    name: item.name || "null",
    description: item.description || "null",
    quantity: item.quantity || "null",
    branch: item?.branch?.name || "null", 
    deleteOn: item.deleteOn || "null",
    updated_at: item.updated_at || "null", 
  }));

  return <CSVExportButton data={mappedData} filename={"inventory.csv"} />;
}
