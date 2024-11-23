"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { updateInventory } from "@/app/(admin)/action";
import { InventorySchema } from "@/app/types";
import { InventoryCol } from "@/app/schema";
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
import { Button } from "@/components/ui/button";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

interface Branch {
  name: unknown;
  id: number;
}

// Update the interface to match InventoryCol's updated_at type
export interface InventoryColWithBranch extends Omit<InventoryCol, "branch"> {
  branch: Branch;
}

type EditInventoryProps = {
  data: InventoryColWithBranch;
  mutate: any;
  predictMutate: any;
};

export function EditInventory({
  data,
  mutate,
  predictMutate,
}: EditInventoryProps) {
  const { data: responseData, error } = useSWR("/api/inventory/", fetcher);
  const inventory = responseData?.data || [];
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
  });

  const setFormValues = () => {
    form.setValue("id", data.id);
    form.setValue("name", data.name);
    form.setValue("description", data.description);
    form.setValue("quantity", data.quantity);
    form.setValue("branch", data.branch.id);
  };

  async function validateName(name: string): Promise<boolean> {
    const trimmedName = name.trim();
    return inventory.some(
      (item: InventoryColWithBranch) =>
        item.id !== data.id &&
        item.branch.id === data.branch.id && // Compare branch IDs
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

    // Create the update payload matching InventorySchema
    const updatePayload: z.infer<typeof InventorySchema> = {
      id: data.id,
      name: formData.name,
      description: formData.description,
      quantity: formData.quantity,
      branch: formData.branch,
    };

    // For UI updates, include the branch object structure and updated_at
    const uiUpdateData: InventoryColWithBranch = {
      ...data,
      ...updatePayload,
      branch: {
        id: formData.branch,
        name: undefined,
      },
      updated_at: new Date().toISOString(),
    };

    // Optimistically update the UI
    mutate((currentData: { data: InventoryColWithBranch[]; count: number }) => {
      let updatedData = currentData.data.map((item) =>
        item.id === updatePayload.id ? uiUpdateData : item
      );

      updatedData = updatedData.sort((a, b) => {
        const bTime = new Date(b.updated_at ?? "").getTime();
        const aTime = new Date(a.updated_at ?? "").getTime();
        return bTime - aTime;
      });

      return { ...currentData, data: updatedData };
    }, false);

    setOpen(false);
    predictMutate();
    try {
      // Send only the schema-compliant payload to the update function
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Inventory item updated successfully.",
        duration: 2000,
      });
      predictMutate();
      await updateInventory(updatePayload);
      mutate();
    } catch (error: any) {
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
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            setFormValues();
            setOpen(true);
          }}
          variant="ghost"
          className="w-full text-left justify-start"
        >
          Edit
        </Button>
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
            Make changes to the inventory item here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>
        <InventoryField form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
