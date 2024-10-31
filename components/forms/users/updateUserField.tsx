import { UpdateUserForm } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import Field from "../formField";

interface PatientFieldsProps {
  form: UseFormReturn<UpdateUserForm>;
  onSubmit: (data: UpdateUserForm) => void;
}

const UpdateUserField = ({ form, onSubmit }: PatientFieldsProps) => {
  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name={"email"} label={"Email"} />

          <Field form={form} name={"newPassword"} label={"New Password"} />

          <Field form={form} name={"name"} label={"Name"} />
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

export default UpdateUserField;
