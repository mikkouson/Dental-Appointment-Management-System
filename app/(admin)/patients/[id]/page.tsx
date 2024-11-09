"use client";
import useSWR from "swr";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSetActiveAppointments } from "@/app/store";
import StaticMaps from "@/components/staticMap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { columns } from "@/components/tables/patient-slug-table/column";
import { DataTableDemo } from "@/components/tables/patient-slug-table/dataTable";
import PatientAppointmentExport from "@/components/buttons/exportButtons/patientAppointmentExport";
import TeethChart from "@/components/teeth-permanent";

const fetcher = async (url: any): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

interface PageProps {
  params: {
    id: string; // Assuming id is a string, adjust type accordingly if different
  };
}

export default function Page({ params }: PageProps) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/patientdetails?id=${params.id}`,
    fetcher
  );

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime tooth_history")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tooth_history" },

        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, mutate]);

  const active = useSetActiveAppointments((state) => state.selectedAppointment);

  if (isLoading) return <>Loading</>;

  const acceptedAppointments = data.appointments.filter(
    (appointment: { status?: { id?: number } }) => appointment.status?.id === 1
  );
  const completedAppointments = data.appointments.filter(
    (appointment: { status?: { id?: number } }) => appointment.status?.id === 4
  );
  const activeAppointment = data.appointments.find(
    (appointment: { id: number }) => appointment.id === active
  );

  return (
    <div className="flex min-h-screen w-full flex-col ">
      <div className="flex flex-col sm:gap-4 ">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex mt-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/patients">Patients</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="grid flex-1 items-start gap-4  sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
              <Card
                className="sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1"
                x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-2 text-center">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-16 h-16 mb-4 md-lg">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription className="mb-2">
                      {data.email}
                    </CardDescription>
                    <div className="space-y-1">
                      <CardDescription className="text-sm font-medium leading-none">
                        Total Appointments
                      </CardDescription>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex h-8 items-center justify-between space-x-2 text-xs">
                      <div className="mx-1 p-1">
                        <CardTitle>{acceptedAppointments.length}</CardTitle>
                        <CardDescription>Upcoming</CardDescription>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="mx-1 p-1">
                        <CardTitle>{completedAppointments.length}</CardTitle>
                        <CardDescription>Completed</CardDescription>
                      </div>
                    </div>
                  </div>
                  <Separator orientation="vertical" />
                </CardHeader>
                <CardFooter className="text-center"></CardFooter>
              </Card>

              <Card
                className="sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1"
                x-chunk="dashboard-05-chunk-9"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Patient Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-2 grid grid-cols-2 gap-2">
                  <div>
                    <CardDescription className="text-md text-muted-foreground">
                      Sex
                    </CardDescription>
                    <p className="text-xs">
                      {data.sex.charAt(0).toUpperCase() + data.sex.slice(1)}
                    </p>
                  </div>

                  <div>
                    <CardDescription className="text-md text-muted-foreground">
                      Phone Number
                    </CardDescription>
                    <p className="text-xs">(+639) {data.phone_number}</p>
                  </div>

                  <div>
                    <CardDescription className="text-md text-muted-foreground">
                      Date of Birth
                    </CardDescription>
                    <p className="text-xs">
                      {moment(data.dob).format("MM/DD/YYYY")}
                    </p>
                  </div>
                  <div>
                    <CardDescription className="text-md text-muted-foreground">
                      Registered Date
                    </CardDescription>
                    <p className="text-xs ">
                      {moment(data.created_at).format("MM/DD/YYYY")}{" "}
                    </p>
                  </div>
                  <div>
                    <CardDescription className="text-md text-muted-foreground">
                      Status
                    </CardDescription>
                    <p className="text-xs ">{data.status}</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1"
                x-chunk="dashboard-05-chunk-10"
              >
                <CardContent className="mt-6">
                  <CardDescription className="text-md text-muted-foreground">
                    Address
                  </CardDescription>
                  <p className="text-xs mb-2">{data.address.address}</p>
                  <StaticMaps
                    latitude={data.address?.latitude}
                    longitude={data.address?.longitude}
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2 mb-2">
                  <PatientAppointmentExport data={data.appointments} />
                </div>
              </div>
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>
                    Recent appointments from your clinic.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTableDemo
                    columns={columns}
                    data={data.appointments}
                    // activePatient={active}
                    mutate={mutate}
                  />
                </CardContent>
              </Card>
              <TeethChart history={data.tooth_history} id={params.id} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
