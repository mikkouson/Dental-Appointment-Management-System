import { UserForm } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import Field from "../formField";
import PasswordInput from "./passworInput";
import { useState } from "react";
interface PatientFieldsProps {
  form: UseFormReturn<UserForm>;
  onSubmit: (data: UserForm) => void;
}

export const role = [
  { name: "Admin", id: "admin" },
  { name: "Super Admin", id: "super_admin" },
] as const;
const UserField = ({ form, onSubmit }: PatientFieldsProps) => {
  const { isSubmitting } = form.formState;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name={"name"} label={"Name"} />
          <Field form={form} name={"email"} label={"Email"} />

          <PasswordInput form={form} name={"password"} label={"Password"} />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      className="pe-9"
                      placeholder="Confirm Password"
                      type={isConfirmVisible ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleConfirmVisibility}
                    aria-label={
                      isConfirmVisible ? "Hide password" : "Show password"
                    }
                    aria-pressed={isConfirmVisible}
                  >
                    {isConfirmVisible ? (
                      <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Eye size={16} strokeWidth={2} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Field form={form} name={"role"} label={"Role"} data={role} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserField;
