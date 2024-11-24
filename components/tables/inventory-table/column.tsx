import { InventoryColWithBranch } from "@/components/modal/inventory/editInvetory";
import { ColumnDef } from "@tanstack/react-table";

type Column = ColumnDef<InventoryColWithBranch>;

export const columns: Column[] = [
  {
    id: "select",
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "quantity",
    header: "Current Stock",
  },
  {
    id: "predicted_monthly_usage",
    header: () => <div className="text-center">Predicted Usage</div>,
    cell: ({ row, table }) => {
      const predictions = (table.options.meta as any)?.predictions
        ?.recommendations;
      const prediction = predictions?.find(
        (p: any) => p.item_id === row.original.id
      );
      return (
        <div className="text-center">
          {prediction?.predicted_monthly_usage || "N/A"}
        </div>
      );
    },
  },
  {
    id: "recommended_restock",
    header: () => <div className="text-center">Recommended Stock</div>,
    cell: ({ row, table }) => {
      const predictions = (table.options.meta as any)?.predictions
        ?.recommendations;
      const prediction = predictions?.find(
        (p: any) => p.item_id === row.original.id
      );
      return (
        <div className="text-center">
          {prediction?.recommended_restock || "N/A"}
        </div>
      );
    },
  },
];
