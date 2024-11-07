// useBranches.tsx
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return res.json();
};

export const useBranches = () => {
  const {
    data: branches,
    error: branchError,
    isLoading: branchLoading,
  } = useSWR("/api/branch/", fetcher);

  return { branches, branchLoading, branchError };
};
