"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createNewUser, newService } from "@/app/(admin)/action";
import { UserSchema } from "@/app/types";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Service } from "@/app/schema";
import UserField from "./userField";
import { useService } from "@/components/hooks/useService";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

interface NewServiceFormProps {
  setOpen: (open: boolean) => void;
  mutate: any; // It's better to type this more specifically if possible
}

export function NewUserForm({ setOpen, mutate }: NewServiceFormProps) {
  const { services: responseData, serviceError, serviceLoading } = useService();

  // Extract the array of services from the response data
  const services = responseData?.data || [];

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
  });

  const validateName = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    return services.some(
      (service: Service | null) => service?.name?.trim() === trimmedName
    );
  };

  async function onSubmit(data: z.infer<typeof UserSchema>) {
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
      await createNewUser(data); // Make sure this function returns a promise

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

  return <UserField form={form} onSubmit={onSubmit} />;
}
