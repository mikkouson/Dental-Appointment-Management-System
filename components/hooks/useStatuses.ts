// useStatuses.tsx
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return res.json();
};

export const useStatuses = () => {
  const {
    data: statuses,
    error: statusError,
    isLoading: statusLoading,
  } = useSWR("/api/status/", fetcher);

  return { statuses, statusLoading, statusError };
};
