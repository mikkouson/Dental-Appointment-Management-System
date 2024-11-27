"use client";
import type { PatientCol } from "@/app/schema";
import { useSetActive } from "@/app/store";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditAppointment } from "@/components/modal/appointment/editAppointment";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deletePatient } from "@/app/(admin)/patients/action";

type Column = ColumnDef<PatientCol>;

type DataTableProps = {
  data: PatientCol[];
  columns: Column[];
  activePatient: Number | undefined;
  mutate: any;
};

export function DataTableDemo({
  columns,
  data,
  activePatient,
  mutate,
}: DataTableProps) {
  const setActive = useSetActive((state) => state.setActive);

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

  const handleClick = (row: Row<PatientCol>) => {
    setActive(row.original.id); // Set the clicked row as active
  };
  const handleDelete = async (id?: number) => {
    mutate();

    try {
      if (!id) return;

      // Wait for the server response before updating UI
      await deletePatient(id);

      // Only update UI after successful deletion
      const filteredPatients = data.filter((patient) => patient.id !== id);
      mutate({ data: filteredPatients }, false);

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Patient deleted successfully.",
        duration: 2000,
      });
      mutate();
    } catch (error) {
      // Simple error toast for failed deletion
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: "Failed to delete patient",
        duration: 2000,
      });
      mutate();
    }
  };

  return (
    <ScrollArea className="h-[calc(80vh-20px)]  rounded-md  border ">
      <Table className="relative">
        <TableHeader className=" bg-muted/70 ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <div className="truncate p-1 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
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
                    <div className="truncate p-1 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-16 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditPatient patient={row.original} mutate={mutate} />
                      <Button
                        variant="ghost"
                        className="w-full text-left justify-start"
                      >
                        <Link
                          href={`/patients/${row.original.id}`}
                          className="w-full"
                        >
                          View
                        </Link>
                      </Button>
                      <DropdownMenuSeparator />

                      <DeleteModal
                        label="patient"
                        formAction={() => handleDelete(row.original.id)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
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
