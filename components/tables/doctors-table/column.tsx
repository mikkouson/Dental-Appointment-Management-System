import type { DoctorCol } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DeleteModal } from "@/components/modal/deleteModal";
import { EditPatient } from "@/components/modal/patients/editPatient";

type Column = ColumnDef<DoctorCol>;

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
    accessorFn: (row) => `(+639) ${row.contact_info}`,
    id: "contact_info",
    header: "CONTACT",
  },
];
