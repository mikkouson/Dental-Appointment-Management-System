import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import useSWR from "swr";
import { SelectDemo } from "./Selict";
import { DatePickerDemo } from "./DatePicker";
import { Calendar } from "./ui/calendar";
import moment from "moment";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { format } from "path";
import { CalendarForm } from "./DateSelect";
import TimeSlot from "./TimeSlot";
import { useGetDate } from "@/app/store";

const FormSchema = z.object({
  // name: z
  //   .string()
  //   .min(2, {
  //     message: "Name must be at least 2 characters.",
  //   })
  //   .max(30, {
  //     message: "Name must not be longer than 30 characters.",
  //   }),
  patient: z.string({
    required_error: "Please select a patient to display.",
  }),
  service: z.string({
    required_error: "Please select an email to display.",
  }),
  branch: z.string({
    required_error: "Please select an email to display.",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

const fetcher = (url: string): Promise<{ id: string; name: string }[]> =>
  fetch(url).then((res) => res.json());

export function SelectForm() {
  const { data, error } = useSWR("/api/patients/", fetcher);
  const { data: services, error: serviceError } = useSWR(
    "/api/service/",
    fetcher
  );
  const selectedBranch = useGetDate((state) => state.branch);

  const { data: branch, error: branchError } = useSWR("/api/branch/", fetcher);
  const selectedDate = useGetDate((state) => state.selectedDate);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  if (!data || !services || !branch) return <>Loading ...</>;
  const dob = form.watch("dob");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="patient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <SelectDemo field={field} data={data} />
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <SelectDemo field={field} data={services} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <SelectDemo field={field} data={branch} />

              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <CalendarForm field={field} />
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              {dob ? (
                <TimeSlot
                  branch={selectedBranch === 0 ? branch[0].id : branch}
                />
              ) : (
                <>disabled</>
              )}
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
