"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Field from "../formField";
import { cn } from "@/lib/utils";
import { updateUser } from "@/app/(admin)/action";
import { UpdateUser } from "@/app/types";

export function ProfileForm({ user }: any) {
  const form = useForm<z.infer<typeof UpdateUser>>({
    resolver: zodResolver(UpdateUser),
    defaultValues: {
      id: user.id,
      name: user?.user_metadata?.name,
      email: user.email,
    },
  });

  async function onSubmit(data: z.infer<typeof UpdateUser>) {
    console.log(data);

    try {
      await updateUser(data); // Attempt to create a new user
      // mutate(); // Revalidate data

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "User added successfully.",
        duration: 2000,
      });

      // setOpen(false); // Close the modal after successful creation
    } catch (error: any) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to add user`,
        duration: 2000,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <Field form={form} name={"name"} label={"Name"} />
        <Field form={form} name={"email"} label={"Email"} disabled />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
