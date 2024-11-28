import type { PatientCol } from "@/app/schema";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type Column = ColumnDef<PatientCol>;

export const columns: Column[] = [
  {
    id: "select",
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => {
      const name = row.original.name;
      const formattedName = name
        ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        : "N/A";

      return row.original.id ? (
        <Link
          href={`/patients/${row.original.id}`}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          {formattedName}
        </Link>
      ) : (
        formattedName
      );
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorFn: (row) => row.address?.address || "N/A",
    id: "address",
    header: "ADDRESS",
    cell: ({ row }) => {
      const address = row.original.address?.address;
      if (!address) return "N/A";

      const firstCommaIndex = address.indexOf(",");
      if (firstCommaIndex === -1) return address;

      return address.substring(firstCommaIndex + 1).trim();
    },
  },
  {
    accessorKey: "sex",
    header: "SEX",
    cell: ({ row }) => {
      const sex = row.original.sex;
      return (
        <Badge variant="outline">
          {sex
            ? sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()
            : "N/A"}
        </Badge>
      );
    },
  },
];
