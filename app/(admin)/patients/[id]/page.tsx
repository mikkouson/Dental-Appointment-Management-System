"use client";
import { useSetActiveAppointments } from "@/app/store";
import PatientAppointmentExport from "@/components/buttons/exportButtons/patientAppointmentExport";
import ToothHistoryCard from "@/components/cards/toothHistoryCard";
import StaticMaps from "@/components/staticMap";
import { columns } from "@/components/tables/patient-slug-table/column";
import { DataTableDemo } from "@/components/tables/patient-slug-table/dataTable";
import TeethChart from "@/components/teeth-permanent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsLinkTrigger } from "@/components/ui/tabs-link-trigger";
import { createClient } from "@/utils/supabase/client";
import { Activity, ClipboardList } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import Loading from "../loading";
import { BurgerMenu } from "@/components/buttons/burgerMenu";
interface PageProps {
  params: {
    id: string;
  };
}
const fetcher = async (url: any): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default function Page({ params }: PageProps) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/patientdetails?id=${params.id}`,
    fetcher
  );
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime tooth-history`)

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
  // Get the current "tabs" parameter from URL
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tabs") || "appointments";

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading patient data</div>;

  const acceptedAppointments = data?.appointments.filter(
    (appointment: { status?: { id?: number } }) => appointment.status?.id === 1
  );
  const completedAppointments = data?.appointments.filter(
    (appointment: { status?: { id?: number } }) => appointment.status?.id === 4
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4">
        {/* Header with Breadcrumb */}
        <header className=" text-center sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <BurgerMenu />

          <Breadcrumb className=" mt-4">
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
                <BreadcrumbPage>{data?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <main className="grid flex-1 items-start gap-4 px-2 sm:px-10 sm:py-0 md:gap-8">
          {/* Profile Cards Row */}
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            {/* Profile Card */}
            <Card>
              <CardHeader className="pb-2 text-center">
                <div className="flex flex-col items-center">
                  <Avatar className="w-16 h-16 mb-4">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <CardTitle>{data?.name}</CardTitle>
                  <CardDescription className="mb-2">
                    {data?.email}
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
              </CardHeader>
            </Card>

            {/* Patient Information Card */}
            <Card>
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
                    {data?.sex.charAt(0).toUpperCase() + data?.sex.slice(1)}
                  </p>
                </div>
                <div>
                  <CardDescription className="text-md text-muted-foreground">
                    Phone Number
                  </CardDescription>
                  <p className="text-xs">(+639) {data?.phone_number}</p>
                </div>
                <div>
                  <CardDescription className="text-md text-muted-foreground">
                    Date of Birth
                  </CardDescription>
                  <p className="text-xs">
                    {moment(data?.dob).format("MM/DD/YYYY")}
                  </p>
                </div>
                <div>
                  <CardDescription className="text-md text-muted-foreground">
                    Registered Date
                  </CardDescription>
                  <p className="text-xs">
                    {moment(data?.created_at).format("MM/DD/YYYY")}
                  </p>
                </div>
                <div>
                  <CardDescription className="text-md text-muted-foreground">
                    Status
                  </CardDescription>
                  <p className="text-xs">{data?.status}</p>
                </div>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card>
              <CardContent className="mt-6">
                <CardDescription className="text-md text-muted-foreground">
                  Address
                </CardDescription>
                <p className="text-xs mb-2">{data?.address?.address}</p>
                <StaticMaps
                  latitude={data?.address?.latitude}
                  longitude={data?.address?.longitude}
                />
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs value={currentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsLinkTrigger href="?tabs=appointments" value="appointments">
                <ClipboardList className="h-4 w-4" />
                Appointment History
              </TabsLinkTrigger>
              <TabsLinkTrigger href="?tabs=medical" value="medical">
                <Activity className="h-4 w-4" />
                Medical History
              </TabsLinkTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <div className="flex items-center mb-2">
                <div className="ml-auto">
                  <PatientAppointmentExport data={data?.appointments} />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>
                    Recent appointments from your clinic.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTableDemo
                    columns={columns}
                    data={data?.appointments}
                    mutate={mutate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical History Tab */}
            <TabsContent value="medical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                  <CardDescription>
                    Patients medical records and history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center">
                    {/* Static TeethChart Component */}
                    <div className="mr-4 md:mr-4 items-center flex justify-center pb-10 md:pb-0">
                      <TeethChart
                        history={data?.tooth_history}
                        id={params.id}
                      />
                    </div>
                    {/* Conditional Rendering for ToothHistoryCard */}
                    {data?.tooth_history && data.tooth_history.length > 0 ? (
                      <ToothHistoryCard treatments={data.tooth_history} />
                    ) : (
                      <div className="text-center text-gray-500 flex items-center justify-center w-full">
                        No tooth history available.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
