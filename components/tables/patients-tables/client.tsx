"use client";
import type { Patient } from "@/app/schema";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { DataTableDemo } from "../dataTable";
import { columns } from "./column";
import { PaginationDemo } from "@/components/pagitnation";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/breadcrumb";
import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";

const fetcher = async (
  url: string
): Promise<{ data: Patient[]; count: number }> =>
  fetch(url).then((res) => res.json());

export default function UserClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  const { data, error, isLoading } = useSWR<{ data: Patient[]; count: number }>(
    `/api/patients?page=${page}&query=${query}`,
    fetcher
  );
  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin" },
    { title: "Patients", link: "/admin/patients" },
  ];

  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  if (error) return <div>Error loading data.</div>;
  console.log(data);
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Total Patients (${data?.count})`}
            description="Manage employees (Server side table functionalities.)"
          />

          {/* <Link
            href={"/dashboard/employee/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link> */}
        </div>
        <Separator />

        <Input
          className=" block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 md:max-w-sm"
          placeholder="Search Patient Name"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : data && data.data ? (
          <>
            <DataTableDemo columns={columns} data={data.data} />

            <PaginationDemo
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </PageContainer>
  );
}
