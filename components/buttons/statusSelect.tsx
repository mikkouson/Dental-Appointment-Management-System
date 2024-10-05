"use client";
import { CheckboxReactHookFormMultiple } from "@/components/buttons/comboBoxSelect";
import useSWR, { preload } from "swr";
const fetcher = (url: string): Promise<any[]> =>
  fetch(url).then((res) => res.json());
preload(`/api/status`, fetcher);
export default function StatusSelect() {
  const {
    data: statuses,
    error: statusesError,
    isLoading,
  } = useSWR("/api/status/", fetcher);

  if (isLoading) return <>Loading ...</>;
  if (statusesError) return <>Error loading data</>;
  if (!statuses) return null;

  return <CheckboxReactHookFormMultiple items={statuses} label="Status" />;
}
