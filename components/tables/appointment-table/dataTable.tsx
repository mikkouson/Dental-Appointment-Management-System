import { deleteAppointment, deleteService } from "@/app/(admin)/action";
import type { AppointmentsCol, Inventory } from "@/app/schema";
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
import { SheetDemo } from "@/components/modal/appointments/editAppointment";
import { EditAppointment } from "@/components/modal/appointment/editAppointment";

type Column = ColumnDef<AppointmentsCol>;

type DataTableProps = {
  data: AppointmentsCol[] | [];
  columns: Column[];
  activePatient?: Number;
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

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const handleClick = (row: Row<AppointmentsCol>) => {
    setActive(row.original.id); // Set the clicked row as active
  };

  const handleDelete = (id?: number) => {
    try {
      if (!id) return;

      // Optimistically update the UI
      const filteredAppointment = data.filter(
        (appointment) => appointment.id !== id
      );
      mutate({ data: filteredAppointment }, false);
      deleteAppointment(id);
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Appointment deleted successfully.",
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        description: `Failed to delete the patient: ${error.message}`,
        duration: 2000,
      });
    }
  };

  return (
    <ScrollArea className="md:h-[calc(80vh-220px)] rounded-md border">
      <Table className="relative">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div className="truncate">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
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
              <TableRow
                key={row.id}
                className={cn(
                  "cursor-pointer",
                  activePatient === row.original.id && "bg-muted"
                )}
                onClick={() => handleClick(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <div className="truncate">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex px-2">
                    <DeleteModal
                      formAction={() => handleDelete(row.original.id)}
                    />
                    <EditAppointment
                      appointment={row.original}
                      text={false}
                      disabled={false}
                      mutate={mutate}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
