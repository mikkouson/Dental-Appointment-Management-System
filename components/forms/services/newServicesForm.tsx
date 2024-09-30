"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newPatient, newService } from "@/app/admin/action";
import { ServiceSchema } from "@/app/types";
import ServicesFields from "./servicesField";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Service } from "@/app/schema";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());
export function NewServiceForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { data: responseData, error } = useSWR("/api/service/", fetcher);

  // Extract the array of service from the response data
  const service = responseData?.data || [];

  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const validateName = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim(); // Trim whitespace from the input email
    return service.some(
      (service: Service | null) => service?.name?.trim() === trimmedName
    );
  };

  async function onSubmit(data: z.infer<typeof ServiceSchema>) {
    const nameExists = await validateName(data.name);

    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Service already exists",
      });
      return;
    }

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
