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
import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "@/app/types";
import { Input } from "@/components/ui/input";
import { CalendarForm } from "@/components/calendarInput";

const sex = [
  { name: "Male", id: "male" },
  { name: "Female", id: "female" },
  { name: "Prefer not to say", id: "prefer_not_to_say" },
] as const;

const status = [
  { name: "Active", id: "Active" },
  { name: "Inactive", id: "Inactive" },
] as const;

interface PatientFieldsProps {
  form: UseFormReturn<PatientFormValues>;
  onSubmit: (data: PatientFormValues) => void;
}

const PatientFields = ({ form, onSubmit }: PatientFieldsProps) => {
  const { isSubmitting } = form.formState;

  console.log(form);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name={"name"} label={"Name"} />
          <Field form={form} name={"email"} label={"Email"} />
          <Field form={form} data={sex} name={"sex"} label={"Sex"} />
          <Field form={form} name={"status"} label={"Status"} data={status} />
          <FormField
            control={form.control}
            name="phoneNumber"
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
                      className="w-full rounded-lg bg-background pl-16 input-no-spin "
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value instanceof Date &&
                      !isNaN(field.value.getTime())
                        ? field.value.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      field.onChange(date);
                    }}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit" disabled={isSubmitting} variant="outline">
            {isSubmitting ? "Submitting..." : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PatientFields;
