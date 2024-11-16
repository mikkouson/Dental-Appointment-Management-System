import { DoctorFormValues } from "@/app/types";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import Field from "../formField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
interface DoctorFieldsProps {
  form: UseFormReturn<DoctorFormValues>;
  onSubmit: (data: DoctorFormValues) => void;
}
const inputStyles = `
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;
const DoctorFields = ({ form, onSubmit }: DoctorFieldsProps) => {
  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name={"name"} label={"Name"} />
          <Field form={form} name={"email"} label={"Email"} />
          <FormField
            control={form.control}
            name="contact_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <p className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground text-sm">
                      (+639)
                    </p>
                    <Input
                      type="number"
                      className="w-full rounded-lg bg-background pl-16 input-no-spin  "
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default DoctorFields;
