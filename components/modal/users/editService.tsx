"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Service } from "@/app/schema";
import { ServiceSchema } from "@/app/types";
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
import useSWR from "swr";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useService } from "@/components/hooks/useService";
import { Button } from "@/components/ui/button";
import { updateService } from "@/app/(admin)/services/action";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

type EditServiceProps = {
  data: Service & { service_url?: string }; // Add service_url to the type
  mutate: any;
};

export function EditService({ data, mutate }: EditServiceProps) {
  const { services, serviceError, serviceLoading } = useService();

  // Extract the array of service from the response data
  const service = services?.data || [];

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });

  // Use z.infer to derive the type from ServiceSchema
  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
  });

  const set = () => {
    form.setValue("id", data.id || 0);
    form.setValue("name", data.name || "");
    form.setValue("description", data.description || "");
    form.setValue("price", data.price || 0);
    form.setValue("image", data.service_url || "");
  };

  async function onSubmit(values: z.infer<typeof ServiceSchema>) {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("id", String(values.id)); // Convert number to string for FormData
      formData.append("description", values.description);
      formData.append("price", String(values.price)); // Convert number to string for FormData
      if (values.image) {
        formData.append("image", values.image);
      }

      const result = await updateService(formData);

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
    } catch (error: unknown) {
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

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => set()}
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
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>
        <ServicesFields form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
