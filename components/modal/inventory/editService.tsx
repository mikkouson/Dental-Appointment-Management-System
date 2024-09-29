"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Inventory } from "@/app/schema";
import { InventorySchema } from "@/app/types";
import ServicesFields from "@/components/forms/services/servicesField";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { updateInventory, updateService } from "@/app/admin/action";
import InventoryField from "@/components/forms/inventory/inventoryField";

export function EditInventory({ data }: { data: Inventory }) {
  const [open, setOpen] = useState(false);
  console.log(data);
  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });

  // Use z.infer to derive the type from InventorySchema
  const form = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      id: data.id || 0,
      description: data.description || "",
      name: data.name || "",
      quantity: data.quantity || 0,
    },
  });

  function onSubmit(data: z.infer<typeof InventorySchema>) {
    setOpen(false);
    updateInventory(data);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SquarePen className="text-sm w-5 text-green-700 cursor-pointer" />
      </SheetTrigger>
      <SheetContent
        className="w-[800px]"
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
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you’re done.
          </SheetDescription>
        </SheetHeader>
        <InventoryField form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
