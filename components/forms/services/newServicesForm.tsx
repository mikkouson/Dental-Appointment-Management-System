"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newPatient, newService } from "@/app/admin/action";
import { ServiceSchema } from "@/app/types";
import ServicesFields from "./servicesField";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";

export function NewServiceForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof ServiceSchema>) {
    setOpen(false);
    newService(data);
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
