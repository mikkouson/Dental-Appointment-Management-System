import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInventory } from "./hooks/useInventory";

export function RecentSales() {
  const { inventory, inventoryLoading } = useInventory();

  const lowStockItems =
    inventory?.data
      .filter((item) => item.quantity <= 3)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 3) || [];

  const totalProductCount =
    inventory?.data.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const availableCount =
    inventory?.data.filter((item) => item.quantity > 3).length || 0;
  const lowStockCount =
    inventory?.data.filter((item) => item.quantity > 0 && item.quantity <= 3)
      .length || 0;
  const outOfStockCount =
    inventory?.data.filter((item) => item.quantity === 0).length || 0;
  const totalCount = availableCount + lowStockCount + outOfStockCount;

  const availablePercentage = (availableCount / totalCount) * 100 || 0;
  const lowStockPercentage = (lowStockCount / totalCount) * 100 || 0;
  const outOfStockPercentage = (outOfStockCount / totalCount) * 100 || 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground uppercase">
            Total product
          </p>
          <p className="text-2xl font-bold">{totalProductCount}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex h-2 w-full space-x-0.5">
          <div
            className="bg-cyan-400 rounded-l-full"
            style={{ width: `${availablePercentage}%` }}
          />
          <div
            className="bg-yellow-400"
            style={{ width: `${lowStockPercentage}%` }}
          />
          <div
            className="bg-rose-400 rounded-r-full"
            style={{ width: `${outOfStockPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cyan-500">Available</span>
          <span className="text-yellow-500">Low Stock</span>
          <span className="text-rose-500">Out of stock</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">LOW STOCK</h3>
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            View all
          </Button>
        </div>

        {lowStockItems.length > 0 ? (
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            All items are well-stocked
          </p>
        )}
      </div>
    </>
  );
}
