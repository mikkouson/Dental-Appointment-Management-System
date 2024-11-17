import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Doctor {
  id: number;
  name: string;
  email: string;
  branch: number | null;
  contact_info: string;
}

interface Appointment {
  branch: {
    id: number;
    name: string;
  };
}

interface DoctorSelectProps {
  doctors?: Doctor[];
  appointment: Appointment;
  onDoctorSelect: (doctorId: string) => void;
}

const DoctorSelect = ({
  doctors = [],
  appointment,
  onDoctorSelect,
}: DoctorSelectProps) => {
  // Filter doctors based on appointment branch or show all if doctor has no branch
  const filteredDoctors =
    doctors?.filter(
      (doctor) =>
        doctor.branch === null || doctor.branch === appointment?.branch?.id
    ) || [];

  if (!doctors?.length) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="No doctors available" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <div className="space-y-4">
      <Select onValueChange={onDoctorSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a doctor" />
        </SelectTrigger>
        <SelectContent>
          {filteredDoctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id.toString()}>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt={doctor.name}
                  />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {doctor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doctor.email}
                  </p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DoctorSelect;
