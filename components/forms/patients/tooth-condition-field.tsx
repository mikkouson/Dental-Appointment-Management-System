import { ToothHistoryFormValue } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import Field from "../formField";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { FormDescription } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const tooth_condition = [
  { name: "Sound", id: "sound" },
  { name: "Filled", id: "filled" },
  { name: "Compromised", id: "compromised" },
  { name: "Endo", id: "endo" },
  { name: "Missing", id: "missing" },
  { name: "Rotated", id: "rotated" },
  { name: "Displaced", id: "displaced" },
  { name: "Gum Recessed", id: "gum-recessed" },
  { name: "Cavities", id: "cavities" },
  { name: "Fractured", id: "fractured" },
  { name: "Chipped", id: "chipped" },
  { name: "Eroded", id: "eroded" },
  { name: "Impacted", id: "impacted" },
  { name: "Decayed", id: "decayed" },
  { name: "Restored", id: "restored" },
  { name: "Periodontally Compromised", id: "periodontally-compromised" },
  { name: "Attrition", id: "attrition" },
  { name: "Abrasion", id: "abrasion" },
  { name: "Root Canal Treated", id: "root-canal-treated" },
  { name: "Stained", id: "stained" },
  { name: "Crowded", id: "crowded" },
  { name: "Loose", id: "loose" },
  { name: "Partially Erupted", id: "partially-erupted" },
  { name: "Hypoplastic", id: "hypoplastic" },
  { name: "Supernumerary", id: "supernumerary" },
  { name: "Malformed", id: "malformed" },
  { name: "Fluorosis Affected", id: "fluorosis-affected" },
  { name: "Transposed", id: "transposed" },
] as const;

interface PatientFieldsProps {
  form: UseFormReturn<ToothHistoryFormValue>;
  onSubmit: (data: ToothHistoryFormValue) => void;
}

const ToothConditionFields = ({ form, onSubmit }: PatientFieldsProps) => {
  const { isSubmitting } = form.formState;

  console.log(form);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="hidden">
            <Field
              form={form}
              name={"tooth_location"}
              label={"Tooth Location"}
              num={true}
            />

            <Field form={form} name={"id"} label={"Id"} num={true} />
            <Field form={form} name={"patient_id"} label={"Id"} num={true} />
          </div>

          <Field
            form={form}
            data={tooth_condition}
            name={"tooth_condition"}
            label={"Tooth Condition"}
            search={true}
          />

          <FormField
            control={form.control}
            name="history_date"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2 justify-between">
                <FormLabel>History Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <Field
            form={form}
            name={"tooth_history"}
            label={"Tooth History"}
            textarea
          />
          {/* <Field form={form} data={sex} name={"sex"} label={"Sex"} />
          <Field form={form} name={"status"} label={"Status"} data={status} /> */}
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

export default ToothConditionFields;
