"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newInventory, newPatient, newService } from "@/app/admin/action";
import { InventorySchema } from "@/app/types";
import ServicesFields from "./inventoryField";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";

export function NewInventoryForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof InventorySchema>) {
    setOpen(false);
    newInventory(data);
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
