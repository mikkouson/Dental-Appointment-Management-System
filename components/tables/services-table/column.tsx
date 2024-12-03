import type { Service } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DeleteModal } from "@/components/modal/deleteModal";
import { EditPatient } from "@/components/modal/patients/editPatient";
import Image from "next/image";

type Column = ColumnDef<Service>;

export const columns: Column[] = [
  {
    id: "select",
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "service_url",
    header: () => null,
    cell: ({ row }) => {
      const url = row.original.service_url;
      return url ? (
        <div className="relative w-10 h-10">
          {" "}
          {/* Changed to w-6 (24px) */}
          <Image
            src={url}
            alt="Service"
            fill
            className="rounded-sm object-cover"
            sizes="24px"
            unoptimized
          />
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "price",
    header: "PRICE",
  },
];
