import { deleteService } from "@/app/admin/action";
import type { Inventory } from "@/app/schema";
import { useSetActiveAppointments } from "@/app/store";
import { toast } from "@/components/hooks/use-toast";
import { DeleteModal } from "@/components/modal/deleteModal";
import { EditPatient } from "@/components/modal/patients/editPatient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { EditService } from "@/components/modal/services/editService";
import { EditInventory } from "@/components/modal/inventory/editInvetory";

type Column = ColumnDef<Inventory>;

type DataTableProps = {
  data: Inventory[] | [];
  columns: Column[];
  activePatient?: number;
  mutate: any;
};

// In your DataTableDemo component
export function DataTableDemo({
  columns,
  data,
  activePatient,
  mutate,
}: DataTableProps) {
  const setActive = useSetActiveAppointments((state) => state.setActiveState);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleClick = (row: Row<Inventory>) => {
    setActive(row.original.id); // Set the clicked row as active
  };

  const handleDelete = (id?: number) => {
    try {
      if (!id) return;

      // Optimistically update the UI
      const filteredPatients = data.filter((patient) => patient.id !== id);
      mutate({ data: filteredPatients }, false);
      deleteService(id);
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Patient deleted successfully.",
      });
    } catch (error: any) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        description: `Failed to delete the patient: ${error.message}`,
      });
    }
  };

  return (
    <ScrollArea className="h-[calc(80vh-220px)] overflow-y-auto rounded-md border md:h-[calc(80dvh-200px)]">
      <Table className="relative">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={cn("cursor-pointer")}>
                {/* Render row cells here */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getHeaderGroups()[0].headers.length + 1}
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
