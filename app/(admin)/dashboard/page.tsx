"use client";
import { PatientChart } from "@/components/charts/area-graph";
import { RevenueGraph } from "@/components/charts/bar-graph";
import { PieGraph } from "@/components/charts/pie-graph";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { useAppointments } from "@/components/hooks/useAppointment";
import { usePatients } from "@/components/hooks/usePatient";
import PageContainer from "@/components/layout/page-container";
import { InventoryStocksChart } from "@/components/recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import DashboardLoading from "./loading ";
import PDFExportButton from "@/components/buttons/exportButtons/dashboardExport";
import BurgerMenu from "@/components/buttons/burgerMenu";
import SelectBranch from "@/components/buttons/selectBranch";

interface Appointment {
  date: string;
  patient_id: string;
  status?: {
    id: number;
  };
  services?: {
    price: number;
  };
}

interface Patient {
  status?: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const dates = searchParams.get("date")?.split(",") || [];
  const branch = searchParams.get("branches") || "";
  let dateRangeStart;
  let dateRangeEnd;

  if (
    dates.length === 2 &&
    moment(dates[0]).isValid() &&
    moment(dates[1]).isValid()
  ) {
    dateRangeStart = moment(dates[0]).format("YYYY-MM-DD");
    dateRangeEnd = moment(dates[1]).format("YYYY-MM-DD");
  } else {
    dateRangeStart = moment().startOf("month").format("YYYY-MM-DD");
    dateRangeEnd = moment().endOf("month").format("YYYY-MM-DD");
  }

  const { appointments, appointmentsLoading } = useAppointments(
    null,
    null,
    branch,
    null,
    null,
    null,
    null,
    null
  );
  const { patients, patientLoading } = usePatients();

  if (patientLoading || appointmentsLoading) return <DashboardLoading />;

  // Filter out appointments with status.id 3 or 5
  const filteredAppointments = {
    ...appointments,
    data:
      appointments?.data?.filter(
        (appointment: any) =>
          appointment?.status?.id !== 3 && appointment?.status?.id !== 5
      ) || [],
  };

  const calculateMetrics = () => {
    if (!appointments?.data?.length || !patients?.data?.length)
      return {
        revenue: 0,
        revenueChange: 0,
        completedAppointments: 0,
        completedAppointmentsChange: 0,
        periodLength: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        pendingRescheduleAppointments: 0,
      };

    const endDate = moment(dateRangeEnd);
    const startDate = moment(dateRangeStart);
    const daysDiff = endDate.diff(startDate, "days") + 1;

    // Ensure appointments data is typed correctly
    const appointmentsData = appointments.data as Appointment[];

    // Current period calculations
    const currentPeriodAppointments = appointmentsData.filter((appointment) => {
      if (!appointment.date) return false;
      const appointmentDate = moment(appointment.date);
      return appointmentDate.isBetween(startDate, endDate, "day", "[]");
    });

    // Count completed appointments
    const currentCompletedAppointments = currentPeriodAppointments.filter(
      (appointment) => appointment.status?.id === 4
    ).length;

    // Count pending appointments (status id = 2)
    const pendingAppointments = currentPeriodAppointments.filter(
      (appointment) => appointment.status?.id === 2
    ).length;

    // Count pending reschedule appointments (status id = 6)
    const pendingRescheduleAppointments = currentPeriodAppointments.filter(
      (appointment) => appointment.status?.id === 6
    ).length;

    const revenueCurrentPeriod = currentPeriodAppointments
      .filter((appointment) => appointment.status?.id === 4)
      .reduce(
        (total, appointment) => total + (appointment.services?.price || 0),
        0
      );

    // Previous period calculations
    const previousStartDate = startDate.clone().subtract(daysDiff, "days");
    const previousEndDate = endDate.clone().subtract(daysDiff, "days");
    const previousPeriodAppointments = appointmentsData.filter(
      (appointment) => {
        if (!appointment.date) return false;
        const appointmentDate = moment(appointment.date);
        return appointmentDate.isBetween(
          previousStartDate,
          previousEndDate,
          "day",
          "[]"
        );
      }
    );

    const previousCompletedAppointments = previousPeriodAppointments.filter(
      (appointment) => appointment.status?.id === 4
    ).length;

    const revenuePreviousPeriod = previousPeriodAppointments
      .filter((appointment) => appointment.status?.id === 4)
      .reduce(
        (total, appointment) => total + (appointment.services?.price || 0),
        0
      );

    // Calculate percentage changes
    const revenueChange = calculatePercentageChange(
      revenuePreviousPeriod,
      revenueCurrentPeriod
    );
    const completedAppointmentsChange = calculatePercentageChange(
      previousCompletedAppointments,
      currentCompletedAppointments
    );

    return {
      revenue: Number(revenueCurrentPeriod.toFixed(2)),
      revenueChange: Number(revenueChange.toFixed(2)),
      completedAppointments: currentCompletedAppointments,
      completedAppointmentsChange: Number(
        completedAppointmentsChange.toFixed(1)
      ),
      totalAppointments: currentPeriodAppointments.length,
      periodLength: daysDiff,
      pendingAppointments,
      pendingRescheduleAppointments,
    };
  };

  const calculatePercentageChange = (previous: number, current: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const metrics = calculateMetrics();

  return (
    <main className="overflow-auto rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
      <PageContainer>
        <div className="space-y-2">
          <div className="flex md:items-center space-y-2 flex-col md:flex-row md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight flex items-center">
              <BurgerMenu />
              Welcome back 👋
            </h2>
            <div className="flex items-center space-x-2 ">
              <SelectBranch />
              <CalendarDateRangePicker />
              <PDFExportButton
                dateRange={{ start: dateRangeStart, end: dateRangeEnd }}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.revenue.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.completedAppointments}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  {metrics.completedAppointmentsChange > 0 ? "+" : ""}
                  {metrics.completedAppointmentsChange}% from previous period
                </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.pendingAppointments}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reschedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.pendingRescheduleAppointments}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <RevenueGraph
                range={{ start: dateRangeStart, end: dateRangeEnd }}
                metrics={metrics}
              />
            </div>
            <InventoryStocksChart branch={branch} />

            <div className="col-span-4 PatientChart">
              <PatientChart
                range={{ start: dateRangeStart, end: dateRangeEnd }}
                data={filteredAppointments}
              />
            </div>

            <div className="col-span-4 md:col-span-3 PieGraph">
              <PieGraph
                branch={branch}
                range={{ start: dateRangeStart, end: dateRangeEnd }}
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
