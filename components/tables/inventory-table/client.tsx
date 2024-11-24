"use client";
import Loading from "@/app/(admin)/inventory/loading";
import BurgerMenu from "@/components/buttons/burgerMenu";
import InventoryExport from "@/components/buttons/exportButtons/inventoryExport";
import SelectBranch from "@/components/buttons/selectBranch";
import { NewInventoryForm } from "@/components/forms/inventory/newInventoryForm";
import { Heading } from "@/components/heading";
import { useBranches } from "@/components/hooks/useBranches";
import { useInventory } from "@/components/hooks/useInventory";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import { PaginationDemo } from "@/components/pagination";
import SearchInput from "@/components/searchInput";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import useSWR from "swr";

const fetcher = (url: string): Promise<any> =>
  fetch(url).then((res) => res.json());

export default function InventoryClient() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(
    useSearchParams().get("query") || ""
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const branch = searchParams.get("branches") || "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const { branches, branchLoading } = useBranches();
  const { data: predict, mutate: predictMutate } = useSWR(
    "https://test1-34297954426.asia-east1.run.app/api/predictions",
    fetcher
  );
  const {
    inventory: data,
    inventoryLoading: isLoading,
    mutate,
  } = useInventory(page, query, branch, limit);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const totalPages = data ? Math.ceil(data.count / limit) : 1;

  if (branchLoading) return <Loading />;

  return (
    <PageContainer>
      <div className="flex flex-col h-[calc(100svh-20px)] ">
        <div className="flex justify-between items-center mt-0 sm:mt-4">
          <div className="flex items-center">
            <BurgerMenu />
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight sm:hidden">
              Total Appointments ({data ? data.count : "Loading"})
            </h4>
            <Heading
              title={`Total Items (${data ? data.count : "loading"})`}
              description="Manage Inventory (Server side table functionalities.)"
            />
          </div>
          <div className="flex items-center ">
            <InventoryExport />

            <DrawerDialogDemo
              open={open}
              setOpen={setOpen}
              label={"New Inventory Item"}
            >
              <NewInventoryForm setOpen={setOpen} mutate={mutate} />
            </DrawerDialogDemo>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center pb-2">
          {!isSearchFocused && (
            <div className="flex justify-end items-center">
              <SelectBranch />
            </div>
          )}
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            handleSearch={handleSearch}
            label="Inventory Item"
          />
        </div>
        {!isLoading ? (
          <div>
            {data && data.data.length ? (
              <>
                <DataTableDemo
                  columns={columns}
                  data={data.data}
                  mutate={mutate}
                  activePatient={undefined}
                  meta={{ predictions: predict }}
                  predictMutate={predictMutate}
                />
                <PaginationDemo totalPages={totalPages} />
              </>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        ) : (
          <TableLoadingSkeleton />
        )}
      </div>
    </PageContainer>
  );
}
