"use client";

import moment from "moment";
import useSWR from "swr";

// Define the Appointment type
interface Appointment {
  id: string;
  time: string; // Assuming time is a string in "HH:mm" format
  patients?: {
    name: string;
  };
}

// Fetcher function with proper typing
const fetcher = (url: string): Promise<Appointment[]> =>
  fetch(url).then((res) => res.json());

// Update the groupAppointmentsByHour function with the typed parameter
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
    const hour = moment(appointment.time, "HH:mm").format("h A");
    if (hours[hour]) {
      hours[hour].push(appointment);
    }
  });

  return hours;
};

// Typing for AppointmentList props
interface AppointmentListProps {
  appointmentsByHour: { [key: string]: Appointment[] };
  hour: string;
}

// Updated AppointmentList component with typed props
const AppointmentList = ({
  appointmentsByHour,
  hour,
}: AppointmentListProps) => (
  <div key={hour} className="mb-6">
    <h2 className="text-lg font-semibold mb-2">{hour}</h2>
    {appointmentsByHour[hour] && appointmentsByHour[hour].length > 0 ? (
      appointmentsByHour[hour].map((appointment) => (
        <div
          key={appointment.id}
          className="flex justify-between items-center border-2 border-gray-muted-foreground p-2 mb-2"
        >
          <div className="mr-6">
            <p>{moment(appointment.time, "HH:mm").format("h:mm A")}</p>
          </div>
          <div className="text-start flex-grow">
            <p>{appointment.patients?.name}</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-3 py-1 rounded">
              Reschedule
            </button>
            <button className="bg-red-500 text-white px-3 py-1 rounded">
              Cancel
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No appointments</p>
    )}
  </div>
);

// Typing for List component props
interface ListProps {
  date: string;
}

// Updated List component with typed props and SWR data
export default function List({ date }: ListProps) {
  const { data, error } = useSWR<Appointment[]>(`/api?date=${date}`, fetcher);

  if (error) return <div>Failed to load</div>;

  const appointmentsByHour = data ? groupAppointmentsByHour(data) : {};
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
    <div className="w-full pl-10">
      {hoursArray.map((hour) => (
        <AppointmentList
          key={hour}
          appointmentsByHour={appointmentsByHour}
          hour={hour}
        />
      ))}
    </div>
  );
}
