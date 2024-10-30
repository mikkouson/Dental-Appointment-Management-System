"use client";

import { createNewUser } from "@/app/(admin)/action";
import { Profiles } from "@/app/schema";
import { UserSchema } from "@/app/types";
import { toast } from "@/components/hooks/use-toast";
import { useUser } from "@/components/hooks/useUser";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UserField from "./userField";

interface NewUserFormProps {
  setOpen: (open: boolean) => void;
  mutate: any; // It's better to type this more specifically if possible
}

export function NewUserForm({ setOpen, mutate }: NewUserFormProps) {
  const { user: responseData } = useUser();

  // Extract the array of users from the response data
  const user = responseData?.data || [];

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const validateEmail = async (email: string): Promise<boolean> => {
    const trimmedEmail = email.trim();
    return user.some(
      (user: any | null) => user?.email?.trim() === trimmedEmail
    );
  };

  async function onSubmit(data: z.infer<typeof UserSchema>) {
    const emailExists = await validateEmail(data.email);

    if (emailExists) {
      form.setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      return;
    }

    // Optimistically update the UI without assigning a temporary id
    const newItem = data;

    interface UserData {
      data: Profiles[];
      count: number;
    }

    mutate(
      (currentData: UserData) => ({
        data: [newItem, ...currentData.data],
        count: currentData.count + 1,
      }),
      false
    );

    setOpen(false); // Close the modal

    toast({
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
      ),
      variant: "success",
      description: "User added successfully.",
      duration: 2000,
    });

    try {
      await createNewUser(data);

      mutate();
    } catch (error: any) {
      mutate();
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to add user: ${error.message}`,
        duration: 2000,
      });
    }
  }

  return <UserField form={form} onSubmit={onSubmit} />;
}
