import { InventoryFormValues } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import Field from "../formField";
import { useBranches } from "@/components/hooks/useBranches";

interface PatientFieldsProps {
  form: UseFormReturn<InventoryFormValues>;
  onSubmit: (data: InventoryFormValues) => void;
}

const InventoryField = ({ form, onSubmit }: PatientFieldsProps) => {
  // Destructure isSubmitting from formState
  const { isSubmitting } = form.formState;

  const { branches, branchLoading } = useBranches();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name="name" label="Name" />

          <Field form={form} name="quantity" label="Quantity" num={true} />
          <Field
            form={form}
            name={"branch"}
            label={"Branch"}
            data={branches}
            num={true}
          />
          <Field
            form={form}
            name="description"
            label="Description"
            textarea={true}
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

export default InventoryField;
