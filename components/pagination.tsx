import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

interface PaginationDemoProps {
  totalPages: number;
}

export function PaginationDemo({ totalPages }: PaginationDemoProps) {
  // Use nuqs to sync the current page and limit with the URL
  const [currentPage, setCurrentPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (value) => parseInt(value, 10) || 1,
    serialize: (value) => value.toString(),
  });

  const [limit, setLimit] = useQueryState("limit", {
    defaultValue: 10,
    parse: (value) => parseInt(value, 10) || 10,
    serialize: (value) => value.toString(),
  });

  // Helper function to generate page numbers (max 5)
  const getPageNumbers = () => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      // Adjust start and end pages if near the edges
      if (startPage === 1) {
        for (let i = startPage; i <= Math.min(endPage, 5); i++) {
          pages.push(i);
        }
      } else if (endPage === totalPages) {
        for (let i = Math.max(1, totalPages - 4); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(
          startPage,
          startPage + 1,
          startPage + 2,
          endPage - 1,
          endPage
        );
      }
    }

    return pages;
  };
  return (
    <div className="flex  items-center mt-2 sm:mt-4 justify-between">
      <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-400 ">
        Page {currentPage} of {totalPages}
      </div>

      {/* Centered Limit Selector */}
      <div className="flex justify-center  sm:order-none sm:mx-auto">
        <Select
          value={limit.toString()}
          onValueChange={(value) => {
            setLimit(parseInt(value, 10));
            setCurrentPage(null);
          }}
        >
          <SelectTrigger className="w-[80px] h-[30px] rounded-2xl">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination on end */}
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage <= 1}
              onClick={(e) => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                } else {
                  e.preventDefault();
                }
              }}
              className={cn("", currentPage <= 1 ? "cursor-not-allowed" : "")}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <PaginationItem key={page} className="hidden sm:block">
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage >= totalPages}
              onClick={(e) => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                } else {
                  e.preventDefault();
                }
              }}
              className={cn(
                "",
                currentPage >= totalPages ? "cursor-not-allowed" : ""
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
