import type { Doctor } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DeleteModal } from "@/components/modal/deleteModal";
import { EditPatient } from "@/components/modal/patients/editPatient";

type Column = ColumnDef<Doctor>;

export const columns: Column[] = [
  {
    id: "select",
    enableSorting: true,
    enableHiding: false,
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
    accessorKey: "contact_info",
    header: "CONTACT",
  },
  // {
  //   accessorKey: "price",
  //   header: "PRICE",
  // },
];
