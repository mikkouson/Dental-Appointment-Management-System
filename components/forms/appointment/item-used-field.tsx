import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useInventory } from "@/components/hooks/useInventory";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "../formField";
import { UpdateInventoryFormValues } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";

interface ItemUsedFieldsProps {
  form: UseFormReturn<UpdateInventoryFormValues>;
  onSubmit: (data: UpdateInventoryFormValues) => void;
}

export function ItemUsedField({ form, onSubmit }: ItemUsedFieldsProps) {
  const { inventory, inventoryError, inventoryLoading } = useInventory();
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
    }>
  >([]);

  if (inventoryLoading) return <>Loading</>;

  const { isSubmitting } = form.formState;

  const updateQuantity = (id: number, delta: number) => {
    setSelectedItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setSelectedItems((items) => items.filter((item) => item.id !== id));
  };

  const handleItemToggle = (checked: boolean, inventoryItem: any) => {
    if (checked) {
      const newItem = {
        id: inventoryItem.id,
        name: inventoryItem.name,
        price: inventoryItem.price,
        quantity: 1,
      };
      setSelectedItems((prev) => [...prev, newItem]);
    } else {
      setSelectedItems((prev) =>
        prev.filter((item) => item.id !== inventoryItem.id)
      );
    }
  };

  // Update form value when selectedItems change
  form.setValue(
    "selectedItems",
    selectedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }))
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="w-full space-y-4">
          <Field form={form} name={"id"} label={"Id"} num={true} disabled />
          <FormField
            control={form.control}
            name="selectedItems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Inventory Items</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Select Items
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full popover-content-width-same-as-its-trigger">
                      {inventory?.data?.map((item) => {
                        const isSelected = selectedItems.some(
                          (selected) => selected.id === item.id
                        );
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 cursor-pointer"
                            onClick={() => handleItemToggle(!isSelected, item)}
                          >
                            <span>{item.name}</span>

                            <Checkbox
                              checked={isSelected}
                              onChange={() =>
                                handleItemToggle(!isSelected, item)
                              }
                            />
                          </div>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormItem>
            )}
          />

          {selectedItems.map((item) => (
            <Card key={item.id} className="border rounded-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{item.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ItemUsedField;
