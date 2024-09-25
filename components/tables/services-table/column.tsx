import type { Service } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DeleteModal } from "@/components/modal/deleteModal";
import { EditPatient } from "@/components/modal/patients/editPatient";

type Column = ColumnDef<Service>;

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
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "price",
    header: "PRICE",
  },
  // {
  //   accessorFn: (row) => row.address?.address || "N/A",
  //   id: "address",
  //   header: "ADDRESS",
  // },
  // {
  //   accessorKey: "sex",
  //   header: "SEX",
  // },
  // {
  //   accessorKey: "age",
  //   header: "Age",
  // },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const id = row.original.id;
  //     const patient = row.original;

  //     return (
  //       <div className="flex px-2">
  //         <DeleteModal id={id} />
  //         <EditPatient patient={patient} />
  //       </div>
  //     );
  //   },
  // },
];
