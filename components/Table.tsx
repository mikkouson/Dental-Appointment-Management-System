"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";

type InventoryItem = {
  id: number;
  item_name: string;
  description: string;
  quantity: number;
};

type TableProps = {
  data: InventoryItem[];
  columns: ColumnDef<InventoryItem>[];
  mutate: () => void;
};

export function DataTable({ data, columns, mutate }: TableProps) {
  const [editingRow, setEditingRow] = useState<InventoryItem | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filterInput, setFilterInput] = useState("");
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const supabase = createClient();

  const handleEdit = (row: InventoryItem) => {
    setEditingRow(row);
    setFormData(row);
  };

  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteItem = async () => {
    if (confirmDelete.id === null) return;

    const updatedData = data.filter((item) => item.id !== confirmDelete.id); 
    mutate(updatedData); 

    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", confirmDelete.id);

    if (error) {
      console.error("Error deleting item:", error);
    } else {
      mutate(); 
    }

    setConfirmDelete({ open: false, id: null });
  };

  const handleSave = async () => {
    if (editingRow) {
      const { id, ...updateData } = formData as InventoryItem;
      const updatedData = data.map((item) =>
        item.id === id ? { ...item, ...updateData } : item
      );
      mutate(updatedData);
  
      const { error } = await supabase
        .from("inventory")
        .update(updateData)
        .eq("id", id);
  
      if (error) {
        console.error("Error updating item:", error);
      }
    } else if (addingNew) {
      const { data: existingItems, error: checkError } = await supabase
        .from("inventory")
        .select("id")
        .eq("item_name", formData.item_name);
  
      if (checkError) {
        console.error("Error checking for existing item:", checkError);
        return;
      }
  
      if (existingItems && existingItems.length > 0) {
        alert("This item already exists.");
        return;
      }
  
      const { data: insertedData, error } = await supabase
        .from("inventory")
        .insert([formData as InventoryItem])
        .select("id");
  
      if (error) {
        console.error("Error adding item:", error);
        return;
      }
  
      const newItemId = insertedData?.[0]?.id;
  
      if (newItemId) {
        const newItem = { ...formData, id: newItemId } as InventoryItem;
        const updatedData = [...data, newItem];
        mutate(updatedData);
      }
    }
  
    mutate();
    setEditingRow(null);
    setAddingNew(false);
    setFormData({});
  };
  

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterInput(value);

    const filterValue = value.toLowerCase();
    table.getColumn("item_name")?.setFilterValue(filterValue);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search inventory"
          value={filterInput}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="ml-2" onClick={() => { setAddingNew(true); setFormData({}); }}>
          Add New Item
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {(editingRow || addingNew) && (
        <Dialog
          open={Boolean(editingRow || addingNew)}
          onOpenChange={() => { setEditingRow(null); setAddingNew(false); }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRow ? "Edit Item" : "Add New Item"}</DialogTitle>
              <DialogDescription>
                {editingRow ? "Make changes to the item and save." : "Fill in the details for the new item."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label htmlFor="item_name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="item_name"
                  name="item_name"
                  value={formData.item_name || ""}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity || ""}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setEditingRow(null); setAddingNew(false); }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {confirmDelete.open && (
        <Dialog
          open={confirmDelete.open}
          onOpenChange={() => setConfirmDelete({ open: false, id: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete({ open: false, id: null })}>
                Cancel
              </Button>
              <Button onClick={confirmDeleteItem}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
