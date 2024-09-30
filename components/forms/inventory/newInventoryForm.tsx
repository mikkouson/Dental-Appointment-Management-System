"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newInventory, newPatient, newService } from "@/app/admin/action";
import { InventorySchema } from "@/app/types";
import ServicesFields from "./inventoryField";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Inventory } from "@/app/schema";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export function NewInventoryForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { data: responseData, error } = useSWR("/api/inventory/", fetcher);

  // Extract the array of service from the response data
  const inventory = responseData?.data || [];
  const form = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const validateName = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim(); // Trim whitespace from the input email
    return inventory.some(
      (inventory: Inventory | null) => inventory?.name?.trim() === trimmedName
    );
  };

  async function onSubmit(data: z.infer<typeof InventorySchema>) {
    const nameExists = await validateName(data.name);

    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Service already exists",
      });
      return;
    }
    // setOpen(false);
    // newInventory(data);
    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "success",
      description: "Service added successfully.",
    });
  }

  return <ServicesFields form={form} onSubmit={onSubmit} />;
}
