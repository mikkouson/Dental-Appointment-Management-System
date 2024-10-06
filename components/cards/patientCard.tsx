"use client";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Expand, Copy, MoreVertical } from "lucide-react";
import useSWR from "swr";
import StaticMaps from "../staticMap";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import PatientCardSkeleton from "../skeleton/patientCardSkeleton";

const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
const PatientCard = ({ activePatient }: { activePatient: Number }) => {
  const { data, error, isLoading } = useSWR(
    `/api/patientdetails?id=${activePatient}`,
    fetcher
  );

  if (isLoading) {
    return <PatientCardSkeleton />;
  }

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Patient ID: {data?.id}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Date of Birth: {moment(data?.dob).format("MMMM DD, YYYY")}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
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
      <ScrollArea className="h-[calc(80vh-160px)]">
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Patient Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd>{data?.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href={`mailto:${data?.email}`}>{data?.email}</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Sex</dt>
                <dd>{data?.sex}</dd>
              </div>
            </dl>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Patient Address</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>{data?.address?.address}</span>
              </address>
              <StaticMaps
                latitude={data?.address?.latitude}
                longitude={data?.address?.longitude}
              />
            </div>
          </div>
          <Separator className="my-4" />

          {data?.appointments.length > 0 ? (
            <div className="grid gap-3">
              <div className="font-semibold">Latest Appointment</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd>{data?.appointments[0].date}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Branch</dt>
                  <dd>{data?.appointments[0].branch.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Service</dt>
                  <dd>{data?.appointments[0].services.name}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <>no appointments</>
          )}
          <Link href={`/patients/${data.id}`}>
            <Button variant="outline" className="h-8 w-full gap-1 mt-2 flex">
              <Expand className="h-3.5 w-3.5 mr-2" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Expand Details
              </span>
            </Button>
          </Link>
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
