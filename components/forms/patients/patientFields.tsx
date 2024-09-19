import React from "react";
import Field from "../formField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Maps from "@/components/gmaps";
import { Button } from "@/components/ui/button";
const sex = [
  { name: "Male", id: "male" },
  { name: "Female", id: "female" },
  { name: "Prefer not to say", id: "prefer_not_to_say" },
] as const;
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "@/app/types";

interface PatientFieldsProps {
  form: UseFormReturn<PatientFormValues>;
  onSubmit: (data: PatientFormValues) => void;
}

const PatientFields = ({ form, onSubmit }: PatientFieldsProps) => {
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
};

export default PatientFields;
