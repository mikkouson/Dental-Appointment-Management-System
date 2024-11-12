import { DoctorFormValues } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import Field from "../formField";

interface DoctorFieldsProps {
  form: UseFormReturn<DoctorFormValues>;
  onSubmit: (data: DoctorFormValues) => void;
}

const DoctorFields = ({ form, onSubmit }: DoctorFieldsProps) => {
  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name={"name"} label={"Name"} />
          <Field form={form} name={"contact_info"} label={"Contact"} />
          <Field form={form} name={"email"} label={"Email"} />
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
