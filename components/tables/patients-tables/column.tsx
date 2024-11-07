import type { PatientCol } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DeleteModal } from "@/components/modal/deleteModal";
import { EditPatient } from "@/components/modal/patients/editPatient";
import { deletePatient } from "@/app/(admin)/action";
import { mutate } from "swr";

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
      return name
        ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        : "N/A";
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
      return sex
        ? sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()
        : "N/A";
    },
  },
];
