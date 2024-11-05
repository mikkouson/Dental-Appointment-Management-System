import type { AppointmentsCol } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DeleteModal } from "@/components/modal/deleteModal";
import { EditPatient } from "@/components/modal/patients/editPatient";

type Column = ColumnDef<AppointmentsCol>;

export const columns: Column[] = [
  {
    id: "select",
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "date",
    header: "DATE",
  },
  {
    accessorFn: (row) => row.time_slots?.time || "N/A",
    id: "time",
    header: "TIME",
  },
  {
    accessorFn: (row) => row.services?.name || "N/A",
    id: "services",
    header: "SERVICE",
  },

  {
    accessorFn: (row) => row.status?.name || "N/A",
    id: "status",
    header: "STATUS",
  },

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
