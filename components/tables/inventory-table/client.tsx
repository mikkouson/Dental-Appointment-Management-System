"use client";
import Loading from "@/app/(admin)/inventory/loading";
import { useGetDate } from "@/app/store";
import { CheckboxReactHookFormMultiple } from "@/components/buttons/comboBoxSelect";
import InventoryExport from "@/components/buttons/exportButtons/inventoryExport";
import { NewInventoryForm } from "@/components/forms/inventory/newInventoryForm";
import { Heading } from "@/components/heading";
import { useInventory } from "@/components/hooks/useInventory";
import PageContainer from "@/components/layout/page-container";
import { DrawerDialogDemo } from "@/components/modal/drawerDialog";
import TableLoadingSkeleton from "@/components/skeleton/tableskeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { columns } from "./column";
import { DataTableDemo } from "./dataTable";
import { useBranches } from "@/components/hooks/useBranches";
import SelectBranch from "@/components/buttons/selectBranch";
import { PaginationDemo } from "@/components/pagination";

export default function InventoryClient() {
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

  const { branches, branchLoading } = useBranches();
  const {
    inventory: data,
    inventoryLoading: isLoading,
    mutate,
  } = useInventory(page, query, branch);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

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

  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  if (branchLoading) return <Loading />;

  return (
    <PageContainer>
      <div className="space-y-4 h-[calc(100vh-144px)]">
        <div className="flex flex-col 2xl:flex-row lg:items-start lg:justify-between">
          <Heading
            title={`Total Inventory (${data ? data.count : "Loading"})`}
            description="Manage Inventory (Server side table functionalities.)"
          />
          <div className="flex justify-end max-w-full flex-col md:flex-row w-full sm:max-w-full 2xl:max-w-[830px]">
            <div className="mr-0 mt-2 sm:mr-2 sm:mt-0 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Inventory Item ..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end mt-2 sm:mt-0">
              <InventoryExport />
              <SelectBranch />
              <DrawerDialogDemo
                open={open}
                setOpen={setOpen}
                label={"New Inventory Item"}
              >
                <NewInventoryForm setOpen={setOpen} mutate={mutate} />
              </DrawerDialogDemo>
            </div>
          </div>
        </div>
        <Separator />
        {!isLoading ? (
          <div>
            {data && data.data.length ? (
              <>
                <DataTableDemo
                  columns={columns}
                  data={data.data}
                  mutate={mutate}
                  activePatient={undefined}
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
