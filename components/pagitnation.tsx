import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "./ui/input";

interface PaginationDemoProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationDemo({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationDemoProps) {
  const [inputPage, setInputPage] = useState(currentPage);
  const [isInputVisible, setInputVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputPage(Number(value));
    }
  };

  const handleInputBlur = () => {
    if (inputPage >= 1 && inputPage <= totalPages) {
      onPageChange(inputPage);
    }
    setInputVisible(false);
  };

  const handleEllipsisClick = () => {
    setInputVisible(true);
  };

  // Helper function to generate page numbers with a single ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // If total pages are 5 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);

      if (currentPage > 3) {
        // Show ellipsis if the current page is beyond the 3rd page
        pages.push("ellipsis");
      }

      // Determine range of middle pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        // Show ellipsis if current page is far from the last pages
        pages.push("ellipsis");
      }

      // Always show the last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
      <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-400 mb-2 sm:mb-0">
        Page {currentPage} of {totalPages}
      </div>

      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage <= 1}
              onClick={(e) => {
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                } else {
                  e.preventDefault();
                }
              }}
              className={cn("", currentPage <= 1 ? "cursor-not-allowed" : "")}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span
                    onClick={handleEllipsisClick}
                    className="cursor-pointer text-gray-400"
                  >
                    &hellip;
                  </span>
                </PaginationItem>
              );
            } else {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={() => onPageChange(page as number)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          })}

          {/* Input for Page Number (Optional) */}
          {isInputVisible && (
            <PaginationItem>
              <Input
                value={inputPage}
                min={1}
                max={totalPages}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-10 text-center rounded"
                autoFocus
              />
            </PaginationItem>
          )}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage >= totalPages}
              onClick={(e) => {
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
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
