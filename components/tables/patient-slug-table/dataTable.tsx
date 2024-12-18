"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AppointmentsCol } from "@/app/schema";
import { useSetActiveAppointments } from "@/app/store";
import { toast } from "@/components/hooks/use-toast";
import { EditAppointment } from "@/components/modal/appointment/editAppointment";
import { DeleteModal } from "@/components/modal/deleteModal";
import { cn } from "@/lib/utils";
import {
  getSortedRowModel,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { deleteAppointment } from "@/app/(admin)/appointments/action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type Column = ColumnDef<AppointmentsCol>;

type DataTableProps = {
  data: AppointmentsCol[] | [];
  columns: Column[];
  activePatient?: number;
  mutate: any;
};

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
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const handleClick = (row: Row<AppointmentsCol>) => {
    setActive(row.original.id);
  };

  const handleDelete = (id?: number) => {
    try {
      if (!id) return;

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
        description: `Failed to delete the appointment: ${error.message}`,
        duration: 2000,
      });
    }
  };

  return (
    <>
      <ScrollArea className="h-[calc(80vh-320px)]   border">
        <Table className="relative">
          <TableHeader className=" bg-muted/70 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="truncate p-1 py-2">
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
                      <div className="truncate p-1">
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
                        <EditAppointment
                          appointment={row.original}
                          text={true}
                          disabled={false}
                          mutate={mutate}
                        />
                        <DropdownMenuSeparator />
                        <DeleteModal
                          label="appointment"
                          formAction={() => handleDelete(row.original.id)}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
