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
import { updateService } from "@/app/(admin)/action";
import useSWR from "swr";
import { toast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useService } from "@/components/hooks/useService";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());
type EditServiceProps = {
  data: Service;
  mutate: any;
};
export function EditService({ data, mutate }: EditServiceProps) {
  const { services, serviceError, serviceLoading } = useService();

  // Extract the array of service from the response data
  const service = services?.data || [];

  const [open, setOpen] = useState(false);
  console.log(data);
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
  };

  async function validateName(name: string): Promise<boolean> {
    const filteredService = service.filter((i: Service) => i.id !== data.id);

    return filteredService.some((i: Service) => i.name === name);
  }
  // async function onSubmit(data: z.infer<typeof ServiceSchema>) {
  //   const nameExists = await validateName(data.name);

  //   if (nameExists) {
  //     form.setError("name", {
  //       type: "manual",
  //       message: "Service already exists",
  //     });
  //     return;
  //   }

  //   setOpen(false);
  //   updateService(data);
  //   // toast({
  //   //   title: "You submitted the following values:",
  //   //   description: (
  //   //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //   //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //   //     </pre>
  //   //   ),
  //   // });
  // }
  // Inside your EditService component

  async function onSubmit(formData: z.infer<typeof ServiceSchema>) {
    const nameExists = await validateName(formData.name);

    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Service item already exists.",
      });
      return;
    }

    // Prepare the updated inventory item
    const updatedItem: Service = {
      ...data,
      ...formData,
      updated_at: new Date().toISOString(), // Update the timestamp
    };

    // Optimistically update the UI
    mutate(
      (currentData: { data: Service[]; count: number }) => {
        let updatedData = currentData.data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );

        updatedData = updatedData.sort((a, b) => {
          return (
            new Date(b.updated_at ?? "").getTime() -
            new Date(a.updated_at ?? "").getTime()
          );
        });

        return { ...currentData, data: updatedData };
      },
      false // Do not revalidate yet
    );

    setOpen(false); // Close the modal

    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "success",
      description: "Inventory item updated successfully.",
      duration: 2000,
    });

    try {
      await updateService(formData); // Make sure this function returns a promise

      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to update service item: ${error.message}`,
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
        <SquarePen
          className="text-sm w-5 text-green-700 cursor-pointer"
          onClick={() => set()}
        />
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
