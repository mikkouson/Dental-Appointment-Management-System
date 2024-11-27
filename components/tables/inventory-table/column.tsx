import { InventoryColWithBranch } from "@/components/modal/inventory/editInvetory";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

type Column = ColumnDef<InventoryColWithBranch>;

const PredictionCell = ({
  value,
  isLoading,
}: {
  value: string | number;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Analyzing data</span>
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>
    );
  }
  return <div className="text-center">{value || "N/A"}</div>;
};

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
      const meta = table.options.meta as {
        predictions: any;
        isLoading?: boolean;
      };
      const predictions = meta?.predictions?.recommendations;
      const isLoading = meta?.isLoading ?? false; // Provide default value of false

      const prediction = predictions?.find(
        (p: any) => p.item_id === row.original.id
      );

      return (
        <PredictionCell
          value={prediction?.predicted_monthly_usage}
          isLoading={isLoading}
        />
      );
    },
  },
  {
    id: "recommended_restock",
    header: () => <div className="text-center">Recommended Stock</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        predictions: any;
        isLoading?: boolean;
      };
      const predictions = meta?.predictions?.recommendations;
      const isLoading = meta?.isLoading ?? false; // Provide default value of false

      const prediction = predictions?.find(
        (p: any) => p.item_id === row.original.id
      );

      return (
        <PredictionCell
          value={prediction?.recommended_restock}
          isLoading={isLoading}
        />
      );
    },
  },
];
