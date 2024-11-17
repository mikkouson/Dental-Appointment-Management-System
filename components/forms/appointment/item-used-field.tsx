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
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import FormSkeleton from "./loading";
import Field from "../formField";
import { UpdateInventoryFormValues } from "@/app/types";

const inputStyles = `
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

interface ItemUsedFieldsProps {
  form: UseFormReturn<UpdateInventoryFormValues>;
  onSubmit: (data: UpdateInventoryFormValues) => void;
  selectedItems: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  setSelectedItems: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        name: string;
        price: number;
        quantity: number;
      }[]
    >
  >;
  branchId: number; // Make sure branchId is required in props
}

export function ItemUsedField({
  form,
  onSubmit,
  setSelectedItems,
  selectedItems,
  branchId,
}: ItemUsedFieldsProps) {
  const { inventory, inventoryError, inventoryLoading } = useInventory();

  if (inventoryLoading) return <FormSkeleton />;
  // Filter inventory items by branchId
  const filteredInventory = inventory?.data?.filter(
    (item) => item?.branch?.id === branchId
  );

  const { isSubmitting } = form.formState;

  const updateQuantity = (
    id: number,
    newValue: string | number,
    isIncrement = false
  ) => {
    setSelectedItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const inventoryItem = filteredInventory?.find((inv) => inv.id === id);
          const maxQuantity = inventoryItem?.quantity || 0;

          let validatedQuantity;
          if (isIncrement) {
            validatedQuantity = Math.max(
              1,
              Math.min(maxQuantity, item.quantity + (newValue as number))
            );
          } else {
            const numValue = parseInt(newValue as string) || 0;
            validatedQuantity = Math.max(1, Math.min(maxQuantity, numValue));
          }

          return { ...item, quantity: validatedQuantity };
        }
        return item;
      })
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

  form.setValue(
    "selectedItems",
    selectedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }))
  );

  return (
    <>
      <style>{inputStyles}</style>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {}
          <div className="w-full space-y-4">
            <div className="hidden">
              <Field form={form} name={"id"} label={"Id"} num={true} disabled />
            </div>
            <FormField
              control={form.control}
              name="selectedItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Inventory Items</FormLabel>
                  <FormControl>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          Select Items
                          {selectedItems.length > 0 && (
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                              {selectedItems.length}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[300px] overflow-y-auto">
                        {filteredInventory?.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No items available for this branch
                          </div>
                        ) : (
                          filteredInventory?.map((item) => {
                            const isSelected = selectedItems.some(
                              (selected) => selected.id === item.id
                            );
                            const isDisabled = item.quantity === 0;

                            return (
                              <div
                                key={item.id}
                                className={`flex items-center space-x-2 p-2 hover:bg-accent ${
                                  isDisabled ? "opacity-50" : ""
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    handleItemToggle(checked as boolean, item)
                                  }
                                  id={`item-${item.id}`}
                                  disabled={isDisabled}
                                />
                                <label
                                  htmlFor={`item-${item.id}`}
                                  className={`flex-1 cursor-pointer text-sm ${
                                    isDisabled ? "cursor-not-allowed" : ""
                                  }`}
                                >
                                  {item.name} (Available: {item.quantity})
                                </label>
                              </div>
                            );
                          })
                        )}
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />

            {selectedItems.map((item) => {
              const inventoryItem = filteredInventory?.find(
                (inv) => inv.id === item.id
              );
              const maxQuantity = inventoryItem?.quantity || 0;

              return (
                <Card key={item.id} className="border rounded-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Available: {maxQuantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1, true)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, e.target.value)
                          }
                          min={1}
                          max={maxQuantity}
                          className="w-16 text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1, true)}
                          disabled={item.quantity >= maxQuantity}
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
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default ItemUsedField;
