"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
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
  });

  const set = () => {
    form.setValue("id", data.id || 0);
    form.setValue("name", data.name || "");
    form.setValue("description", data.description || "");
    form.setValue("quantity", data.quantity || 0);
  };

  async function validateName(name: string): Promise<boolean> {
    const filteredInventory = inventory.filter(
      (i: Inventory) => i.id !== data.id
    );

    return filteredInventory.some((i: Inventory) => i.name === name);
  }

  async function onSubmit(formData: z.infer<typeof InventorySchema>) {
    const nameExists = await validateName(formData.name);

    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Item already exists",
      });
      return;
    }

    updateInventory(formData);
    setOpen(false);

    // Optionally show a toast or notification
    // toast({
    //   title: "Inventory Updated",
    //   description: "Changes saved successfully.",
    // });
  }
  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SquarePen
          className="text-sm w-5 text-green-700 cursor-pointer"
          onClick={() => set()}
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
