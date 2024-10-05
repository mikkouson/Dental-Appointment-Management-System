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

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export function EditService({ data }: { data: Service }) {
  const { data: responseData, error } = useSWR("/api/service/", fetcher);

  // Extract the array of service from the response data
  const service = responseData?.data || [];

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
    updateService(data);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
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
            Make changes to your profile here. Click save when you’re done.
          </SheetDescription>
        </SheetHeader>
        <ServicesFields form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
}
