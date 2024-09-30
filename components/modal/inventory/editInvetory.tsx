"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import useSWR from "swr";
import { updateInventory } from "@/app/admin/action";
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

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export function EditInventory({ data }: { data: Inventory }) {
  const { data: responseData, error } = useSWR("/api/inventory/", fetcher);

  // Extract the array of inventory from the response data
  const inventory = responseData?.data || [];

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      id: data.id || 0,
      description: data.description || "",
      name: data.name || "",
      quantity: data.quantity || 0,
    },
  });

  const validateName = async (name: string): Promise<boolean> => {
    return inventory.some((inventory: Inventory) => inventory.name === name);
  };

  const onSubmit = async (formData: z.infer<typeof InventorySchema>) => {
    const nameExists = await validateName(formData.name);

    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Item already exists",
      });
      return;
    }

    // Uncomment to update inventory
    // updateInventory(formData);

    // Optionally close the sheet after submission
    // setOpen(false);

    // Optionally show a toast or notification
    // toast({
    //   title: "Inventory Updated",
    //   description: "Changes saved successfully.",
    // });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SquarePen
          className="text-sm w-5 text-green-700 cursor-pointer"
          onClick={() => form.reset()}
        />
      </SheetTrigger>
      <SheetContent className="w-[800px]">
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
