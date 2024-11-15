import { deleteService } from "@/app/(admin)/action";
import type { Service } from "@/app/schema";
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
import { EditService } from "@/components/modal/users/editService";

type Column = ColumnDef<Service>;

type DataTableProps = {
  data: Service[] | [];
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const handleClick = (row: Row<Service>) => {
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
    <ScrollArea className="h-[calc(80vh-20px)]   border">
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
                    </div>{" "}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex px-2">
                    <DeleteModal
                      label="service"
                      formAction={() => handleDelete(row.original.id)}
                    />
                    <EditService data={row.original} mutate={mutate} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
