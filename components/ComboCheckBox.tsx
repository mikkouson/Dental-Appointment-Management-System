import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGetDate } from "@/app/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ChevronDownIcon } from "lucide-react";

const FormSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .refine((value) => value.length > 0, {
      message: " You have to select at least one item.",
    }),
});

type StatusItem = {
  id: number;
  name: string;
};

type CheckboxReactHookFormMultipleProps = {
  items: StatusItem[];
  label: string;
};

export function CheckboxReactHookFormMultiple({
  items,
  label,
}: CheckboxReactHookFormMultipleProps) {
  const { status: storeStatus, setStatus } = useGetDate((state) => ({
    status: state.status,
    setStatus: state.setStatus,
  }));

  // Convert storeStatus to StatusItem[] if it is an array of StatusItem
  const defaultValues = {
    items: storeStatus.length > 0 ? storeStatus : items,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setStatus(data.items);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">
    //         {JSON.stringify(data.items, null, 2)}
    //       </code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <FormItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {label} <ChevronDownIcon className="ml-2 h-4 w-4" />{" "}
                    <FormMessage />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {items.map((item) => (
                    <DropdownMenuCheckboxItem
                      key={item.id}
                      className="w-full"
                      checked={field.value.some(
                        (selectedItem) => selectedItem.id === item.id
                      )}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, item]
                          : field.value.filter((value) => value.id !== item.id);

                        field.onChange(newValue);
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      {item.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
