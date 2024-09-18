"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Maps from "../gmaps";
import Field from "./formField";
import { newPatient } from "@/app/admin/action";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email().min(1, {
    message: "Invalid email address.",
  }),
  address: z
    .object({
      address: z.string({
        required_error: "Address is required.",
      }),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .refine((data) => data.address.trim().length > 0, {
      message: "Address must be provided.",
    }),
  sex: z.string().min(1, { message: "Sex is required." }),
  age: z.number().min(1, {
    message: "Age is required.",
  }),
});
const sex = [
  { name: "Male", id: "male" },
  { name: "Female", id: "female" },
  { name: "Prefer not to say", id: "prefer_not_to_say" },
] as const;

export function SelectForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      sex: "",
      age: 0,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Ensure `age` is correctly typed as a number
    const correctedData = {
      ...data,
      age: Number(data.age),
    };

    // setOpen(false);
    newPatient(correctedData);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(correctedData, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name={"name"} label={"Name"} />
          <Field form={form} name={"email"} label={"Email"} />
          <Field form={form} data={sex} name={"sex"} label={"Sex"} />
          <Field form={form} name={"age"} label={"Age"} age={true} />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Maps field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
