"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newService } from "@/app/(admin)/action";
import { ServiceSchema } from "@/app/types";
import ServicesFields from "./servicesField";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Service } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

interface NewServiceFormProps {
  setOpen: (open: boolean) => void;
  mutate: any; // It's better to type this more specifically if possible
}

export function NewServiceForm({ setOpen, mutate }: NewServiceFormProps) {
  const { data: responseData, error } = useSWR("/api/service/", fetcher);

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

  async function onSubmit(data: z.infer<typeof ServiceSchema>) {
    const nameExists = await validateName(data.name);

    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Service already exists",
      });
      return;
    }

    // Optimistically update the UI without assigning a temporary id
    const newItem = data; // Use the new data directly

    interface ServiceData {
      data: Service[];
      count: number;
    }

    mutate(
      (currentData: ServiceData) => ({
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
      description: "Service added successfully.",
      duration: 2000,
    });

    try {
      await newService(data); // Make sure this function returns a promise

      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to add service: ${error.message}`,
        duration: 2000,
      });
    }
  }

  return <ServicesFields form={form} onSubmit={onSubmit} />;
}
