"use client";
import useSWR from "swr";

import StaticMaps from "@/components/staticMap";
import { DataTableDemo } from "@/components/tables/appointment-table/dataTable";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  Truck,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { columns } from "@/components/tables/appointment-table/column";
import { useSetActiveAppointments } from "@/app/store";
const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
interface PageProps {
  params: {
    id: string; // Assuming id is a string, adjust type accordingly if different
    // Add other fields if params has more properties
  };
}
export default function Page({ params }: PageProps) {
  const activePatient = useSetActiveAppointments(
    (state) => state.selectedAppointment
  );
  const { data, error, isLoading } = useSWR(
    `/api/patientdetails?id=${params.id}`,
    fetcher
  );

  if (isLoading) return <>Loading</>;

  const acceptedAppointments = data.appointments.filter(
    (appointment: { status: { id: number } }) => appointment.status.id === 1
  );
  const completedAppointments = data.appointments.filter(
    (appointment: { status: { id: number } }) => appointment.status.id === 4
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 ">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Orders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recent Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="grid flex-1 items-start gap-4  sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
              {/* Card 1 - Personal Information */}
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

              {/* Card 2 - Contact Information */}
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

              {/* Card 3 - Address Information */}
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

            <Tabs defaultValue="Upcoming">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="Pending">Pending</TabsTrigger>
                  <TabsTrigger value="Completed">Completed</TabsTrigger>
                  <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Declined
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Refunded
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="Upcoming">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>
                      Recent appointmets from your clinic.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTableDemo
                      columns={columns}
                      data={data.appointments}
                      activePatient={
                        activePatient == 0
                          ? data.appointments[0].id
                          : activePatient
                      }
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Order Oe31b70H
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: November 23, 2023</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Track Order
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Glimmer Lamps x <span>2</span>
                      </span>
                      <span>$250.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Aqua Filters x <span>1</span>
                      </span>
                      <span>$49.00</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>$299.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>$5.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>$25.00</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>$329.00</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Shipping Information</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>
                  <div className="grid auto-rows-max gap-3">
                    <div className="font-semibold">Billing Information</div>
                    <div className="text-muted-foreground">
                      Same as shipping address
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>Liam Johnson</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">liam@acme.com</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">+1 234 567 890</a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Payment Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        Visa
                      </dt>
                      <dd>**** **** **** 4532</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
