"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newInventory, newPatient, newService } from "@/app/(admin)/action";
import { InventorySchema } from "@/app/types";
import ServicesFields from "./inventoryField";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Inventory } from "@/app/schema";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

// Update the props to include mutate
export function NewInventoryForm({
  setOpen,
  mutate,
}: {
  setOpen: (open: boolean) => void;
  mutate: any;
}) {
  const { data: responseData, error } = useSWR("/api/inventory/", fetcher);

  const inventory = responseData?.data || [];
  const form = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const validateName = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    return inventory.some(
      (item: Inventory | null) => item?.name?.trim() === trimmedName
    );
  };

  async function onSubmit(data: z.infer<typeof InventorySchema>) {
    const nameExists = await validateName(data.name);

    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Inventory item already exists",
      });
      return;
    }

    // Optimistically update the UI
    const newItem = { id: Date.now(), ...data }; // Assuming `id` is generated like this
    interface InventoryData {
      data: Inventory[];
      count: number;
    }

    mutate(
      (currentData: InventoryData) => ({
        data: [newItem, ...currentData.data],
        count: currentData.count + 1,
      }),
      false // Do not revalidate yet
    );
    setOpen(false); // Close the modal
    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "success",
      description: "Inventory added successfully.",
      duration: 2000,
    });
    try {
      await newInventory(data); // Make sure this function returns a promise

      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        description: `Failed to add inventory: ${error.message}`,
        duration: 2000,
      });
    }
  }

  return <ServicesFields form={form} onSubmit={onSubmit} />;
}
