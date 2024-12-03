"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ServiceSchema } from "@/app/types";
import ServicesFields from "./servicesField";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Service } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useService } from "@/components/hooks/useService";
import { newService } from "@/app/(admin)/services/action";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

interface NewServiceFormProps {
  setOpen: (open: boolean) => void;
  mutate: any; // It's better to type this more specifically if possible
}

export function NewServiceForm({ setOpen, mutate }: NewServiceFormProps) {
  const { services: responseData, serviceError, serviceLoading } = useService();

  // Extract the array of services from the response data
  const services = responseData?.data || [];

  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const validateName = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    return services.some(
      (service: Service | null) => service?.name?.trim() === trimmedName
    );
  };

  async function onSubmit(values: z.infer<typeof ServiceSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      if (values.image) {
        formData.append("image", values.image);
      }

      const result = await newService(formData);

      if (result) {
        form.reset();
      }
      setOpen(false); // Close the modal
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Service updated successfully.",
        duration: 2000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to update service item: ${errorMessage}`,
        duration: 2000,
      });
    }
  }

  return <ServicesFields form={form} onSubmit={onSubmit} />;
}
