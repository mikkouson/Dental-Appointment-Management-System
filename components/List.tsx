"use client";

import { cancelAppointment } from "@/app/admin/action";
import moment from "moment";
import useSWR, { mutate } from "swr";
import { SheetDemo } from "./Sheet";
import SubmitButton from "./submitBtn";
import { useGetDate } from "@/app/store";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  time: string;
  status: string;
  patients?: {
    name: string;
  };
  time_slots?: {
    time: string;
  };
}

interface AppointmentListProps {
  appointmentsByHour: { [key: string]: Appointment[] };
  hour: string;
  status: string[];
  date: string;
}

interface ListProps {
  date: string;
  status: string[];
}

const fetcher = (url: string): Promise<Appointment[]> =>
  fetch(url).then((res) => res.json());

const groupAppointmentsByHour = (appointments: Appointment[]) => {
  const hours: { [key: string]: Appointment[] } = {
    "8 AM": [],
    "9 AM": [],
    "10 AM": [],
    "11 AM": [],
    "12 PM": [],
    "1 PM": [],
    "2 PM": [],
    "3 PM": [],
    "4 PM": [],
  };

  appointments.forEach((appointment) => {
    const hour = moment(appointment.time_slots?.time, "HH:mm").format("h A");
    if (hours[hour]) {
      hours[hour].push(appointment);
    }
  });

  return hours;
};

function AppointmentList({
  appointmentsByHour,
  hour,
  status,
  date,
}: AppointmentListProps) {
  const branch = useGetDate((state) => state.branch);
  const supabase = createClient();
  const router = useRouter();
  useEffect(() => {
    const channel = supabase
      .channel("realtime appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          mutate(
            `/api/appointments?date=${date}&branch=${branch}&status=${status.join(
              ","
            )}`
          );
          console.log("asd");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);
  return (
    <div key={hour} className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{hour}</h2>
      {appointmentsByHour[hour] && appointmentsByHour[hour].length > 0 ? (
        appointmentsByHour[hour].map((appointment) => (
          <div
            key={appointment.id}
            className="flex justify-between items-center border-2 border-gray-muted-foreground p-2 mb-2"
          >
            <div className="mr-6">
              <p>
                {moment(appointment.time_slots?.time, "HH:mm").format("h:mm A")}
              </p>
            </div>
            <div className="text-start flex-grow">
              <p>{appointment.patients?.name}</p>
              <p>Status: {appointment.status}</p>
            </div>
            <div className="flex space-x-2">
              <form>
                <SheetDemo id={appointment.id} date={date} />
                {appointment.status === "accepted" && (
                  <SubmitButton
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    formAction={async () => {
                      await cancelAppointment({ aptId: appointment.id });
                    }}
                    pendingText="Cancelling..."
                  >
                    Cancel
                  </SubmitButton>
                )}
              </form>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No appointments</p>
      )}
    </div>
  );
}

export default function List({ date, status }: ListProps) {
  const branch = useGetDate((state) => state.branch);
  const supabase = createClient();
  const router = useRouter();
  const { data: appointments, error } = useSWR<Appointment[]>(
    `/api/appointments?date=${date}&branch=${branch}&status=${status.join(
      ","
    )}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;

  const appointmentsByHour = appointments
    ? groupAppointmentsByHour(appointments)
    : {};
  const hoursArray = [
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
  ];

  return (
    <div>
      {hoursArray.map((hour) => (
        <AppointmentList
          key={hour}
          appointmentsByHour={appointmentsByHour}
          hour={hour}
          date={date}
          status={status}
        />
      ))}
    </div>
  );
}
