"use client";

import { useGetDate } from "@/app/store";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import useSWR from "swr";
import RadioComboBox from "./radioComboBox";

const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());

export default function BranchSelect() {
  const branch1 = useGetDate((state) => state.branch);
  const setBranch = useGetDate((state) => state.setBranch);

  const { data, error } = useSWR("/api/branch/", fetcher);

  if (error) return <>Failed to load</>;
  if (!data)
    return (
      <Button variant="outline" disabled>
        Branch: Loading ...
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
    );

  const selectedBranch = data.find((branch) => branch.id === branch1);

  return (
    <div className="mr-2">
      <RadioComboBox
        data={data}
        selectedItem={selectedBranch}
        store={branch1 === 0 ? data[0].id : branch1}
        action={setBranch}
        label={"Branch"}
      />
    </div>
  );
}
