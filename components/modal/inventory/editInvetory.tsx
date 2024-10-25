"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { updateInventory } from "@/app/(admin)/action";
import { InventorySchema } from "@/app/types";
import { Inventory } from "@/app/schema";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SquarePen } from "lucide-react";
import InventoryField from "@/components/forms/inventory/inventoryField";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

type EditInventoryProps = {
  data: Inventory;
  mutate: any;
};

export function EditInventory({ data, mutate }: EditInventoryProps) {
  const { data: responseData, error } = useSWR("/api/inventory/", fetcher);

  // Extract the array of inventory from the response data
  const inventory = responseData?.data || [];

  const [open, setOpen] = useState(false);

  // Initialize the form without defaultValues
  const form = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
  });

  // Function to set form values when opening the modal
  const setFormValues = () => {
    form.setValue("id", data.id);
    form.setValue("name", data.name);
    form.setValue("description", data.description);
    form.setValue("quantity", data.quantity);
  };

  // Function to validate the uniqueness of the inventory name
  async function validateName(name: string): Promise<boolean> {
    const trimmedName = name.trim();
    return inventory.some(
      (item: Inventory) =>
        item.id !== data.id &&
        item.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
  }

  async function onSubmit(formData: z.infer<typeof InventorySchema>) {
    const nameExists = await validateName(formData.name);

    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Inventory item already exists.",
      });
      return;
    }

    // Prepare the updated inventory item
    const updatedItem: Inventory = {
      ...data,
      ...formData,
      updated_at: new Date().toISOString(), // Ensure updated_at is set to current time
    };

    // Optimistically update the UI
    mutate(
      (currentData: { data: Inventory[]; count: number }) => {
        let updatedData = currentData.data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );

        // Reorder the updatedData array based on updated_at descending
        updatedData = updatedData.sort((a, b) => {
          return (
            new Date(b.updated_at ?? "").getTime() -
            new Date(a.updated_at ?? "").getTime()
          );
        });

        return { ...currentData, data: updatedData };
      },
      false // Do not revalidate yet
    );

    setOpen(false); // Close the modal

    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "success",
      description: "Inventory item updated successfully.",
      duration: 2000,
    });

    try {
      await updateInventory(updatedItem); // Ensure this function returns a promise and handles updated_at

      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to update inventory item: ${error.message}`,
        duration: 2000,
      });
    }
  }

  useEffect(() => {
    // Optional: Prevent pointer events during certain operations if needed
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SquarePen
          className="text-sm w-5 text-green-700 cursor-pointer"
          onClick={() => {
            setFormValues(); // Set form values when opening the modal
            setOpen(true);
          }}
        />
      </SheetTrigger>
      <SheetContent
        className="w-full md:w-[800px] overflow-auto"
        onInteractOutside={(e) => {
          const hasPacContainer = e.composedPath().some((el: EventTarget) => {
            if ("classList" in el) {
              return Array.from((el as Element).classList).includes(
                "pac-container"
              );
            }
            return false;
          });

          if (hasPacContainer) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle>Edit Inventory</SheetTitle>
          <SheetDescription>
            Make changes to the inventory item here. Click save when you’re
            done.
          </SheetDescription>
        </SheetHeader>
        <InventoryField form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
