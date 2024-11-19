import type { AppointmentsCol } from "@/app/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import moment from "moment";

type Column = ColumnDef<AppointmentsCol>;

const formatTime = (time: string) => {
  try {
    // Assuming time is in format "HH:mm:ss" or "HH:mm"
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase(); // Convert to uppercase for AM/PM
  } catch {
    return time; // Return original value if parsing fails
  }
};

export const columns: Column[] = [
  {
    id: "select",
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorFn: (row) => ({
      name: row.patients?.name || "N/A",
      id: row.patients?.id,
    }),
    id: "patient_link",
    header: "PATIENT",
    cell: ({ row }) => {
      const patient = row.getValue("patient_link") as {
        name: string;
        id: string;
      };
      return patient.id ? (
        <Link
          href={`/patients/${patient.id}`}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          {patient.name}
        </Link>
      ) : (
        patient.name
      );
    },
  },
  {
    accessorFn: (row) => row.date || "N/A",
    id: "date",
    header: "DATE",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return moment(date).format("dddd, MMM D, YYYY");
    },
  },
  {
    accessorFn: (row) => row.time_slots?.time || "N/A",
    id: "time",
    header: "TIME",
    cell: ({ row }) => {
      const time = row.getValue("time") as string;
      return formatTime(time);
    },
  },
  {
    accessorFn: (row) => row.services?.name || "N/A",
    id: "services",
    header: "SERVICE",
  },
  {
    accessorFn: (row) => ({
      name: row.status?.name || "N/A",
      id: row.status?.id,
    }),
    id: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as { name: string; id: number };
      return (
        <Badge variant="outline" className="ml-2">
          {status.name}
        </Badge>
      );
    },
  },
];
