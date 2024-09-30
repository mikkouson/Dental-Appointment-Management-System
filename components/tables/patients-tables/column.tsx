import type { PatientCol } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DeleteModal } from "@/components/modal/deleteModal";
import { EditPatient } from "@/components/modal/patients/editPatient";
import { deletePatient } from "@/app/admin/action";
import { mutate } from "swr";

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
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const id = row.original.id;
  //     const patient = row.original;
  //     const handleDelete = () => {
  //       deletePatient(Number(id));
  //     };

  //     return (
  //       <div className="flex px-2">
  //         <DeleteModal formAction={handleDelete} />
  //         <EditPatient patient={patient} />
  //       </div>
  //     );
  //   },
  // },
];
