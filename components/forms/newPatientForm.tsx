"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import FormField from "./formField";
import Maps from "../gmaps";

const FormSchema = z.object({
  name: z.number({
    required_error: "Please select an email to display.",
  }),
  email: z.string().email(),
  address: z.date({
    required_error: "A date of birth is required.",
  }),
  sex: z.number({
    required_error: "A date of birth is required.",
  }),
  age: z.string({
    required_error: "A date of birth is required.",
  }),
});

export function SelectForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setOpen(false);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <FormField form={form} name={"name"} label={"Name"} />
          <FormField form={form} name={"name"} label={"Name"} />
          <Maps />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
