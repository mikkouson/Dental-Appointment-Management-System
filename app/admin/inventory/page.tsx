"use client";

import React from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { DataTable } from "@/components/tables/Table";
import { createClient } from "@/utils/supabase/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type InventoryItem = {
  id: number;
  item_name: string;
  description: string;
  quantity: number;
};

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];

const Inventory = () => {
  const { data, error, mutate } = useSWR<InventoryItem[]>(
    "/api/inventory",
    fetcher
  );

  if (error) return <div>Error loading inventory.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <DataTable data={data} columns={columns} mutate={mutate} />
    </div>
  );
};

export default Inventory;
