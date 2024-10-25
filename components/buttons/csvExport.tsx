// CSVExportButton.tsx
"use client";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

interface CSVExportButtonProps {
  data: object[];
  filename: string;
}

export function CSVExportButton({ data, filename }: CSVExportButtonProps) {
  return (
    <CSVLink data={data} filename={filename}>
      <Button
        variant="outline"
        className="text-xs sm:text-sm px-2 sm:px-4 mr-2"
      >
        <File className="h-3.5 w-3.5 mr-2" />
        <span className="sr-only sm:not-sr-only">Export</span>
      </Button>
    </CSVLink>
  );
}
