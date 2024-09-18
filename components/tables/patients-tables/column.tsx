import type { PatientCol } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DeleteModal } from "@/components/modal/deleteModal";

type Column = ColumnDef<PatientCol>;

export const columns: Column[] = [
  {
    id: "select",
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorFn: (row) => row.address?.address || "N/A",
    id: "address",
    header: "ADDRESS",
  },
  {
    accessorKey: "sex",
    header: "SEX",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex px-2">
          <DeleteModal id={id} />
          <SquarePen className="text-sm w-5 text-green-700 cursor-pointer" />
        </div>
      );
    },
  },
];
