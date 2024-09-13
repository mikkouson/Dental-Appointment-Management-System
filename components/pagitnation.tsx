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

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
      <Pagination>
        <PaginationContent>
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
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {isInputVisible ? (
              <Input
                value={inputPage}
                min={1}
                max={totalPages}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-10 text-center rounded"
                autoFocus
              />
            ) : (
              <span
                onClick={handleEllipsisClick}
                className="cursor-pointer text-gray-400"
              >
                &hellip;
              </span>
            )}
          </PaginationItem>
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
