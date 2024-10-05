import { ServiceFormValues } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import Field from "../formField";

interface PatientFieldsProps {
  form: UseFormReturn<ServiceFormValues>;
  onSubmit: (data: ServiceFormValues) => void;
}

const ServicesFields = ({ form, onSubmit }: PatientFieldsProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Field form={form} name={"name"} label={"Name"} />

          <Field form={form} name={"price"} label={"Price"} num={true} />
          <Field
            form={form}
            name={"description"}
            label={"Description"}
            textarea={true}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default ServicesFields;
