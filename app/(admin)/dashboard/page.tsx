"use client";
import { PatientChart } from "@/components/charts/area-graph";
import { RevenueGraph } from "@/components/charts/bar-graph";
import { PieGraph } from "@/components/charts/pie-graph";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { useAppointments } from "@/components/hooks/useAppointment";
import { usePatients } from "@/components/hooks/usePatient";
import PageContainer from "@/components/layout/page-container";
import { RecentSales } from "@/components/recent-sales";
import { Button } from "@/components/ui/button";

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

export default function Page() {
  const searchParams = useSearchParams();
  const dates = searchParams.get("date")?.split(",") || [];

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

  const { appointments, appointmentsLoading } = useAppointments();
  const { patients, patientLoading } = usePatients();

  if (patientLoading || appointmentsLoading) return <DashboardLoading />;

  const calculateMetrics = () => {
    if (!appointments?.data?.length || !patients?.data?.length)
      return {
        revenue: 0,
        revenueChange: 0,
        newPatients: 0,
        newPatientsChange: 0,
        appointmentCompletionRate: 0,
        appointmentCompletionRateChange: 0,
        periodLength: 0,
        activePatients: 0,
        activePatientsChange: 0,
        totalAppointments: 0,
      };

    const endDate = moment(dateRangeEnd);
    const startDate = moment(dateRangeStart);
    const daysDiff = endDate.diff(startDate, "days") + 1;

    // Current period calculations
    const currentPeriodAppointments = appointments.data.filter(
      (appointment) => {
        if (!appointment.date) return false;
        const appointmentDate = moment(appointment.date);
        return appointmentDate.isBetween(startDate, endDate, "day", "[]");
      }
    );

    // Get unique patient IDs with appointments in the period
    const currentActivePatientIds = new Set(
      currentPeriodAppointments.map((appointment) => appointment.patient_id)
    );

    // New patients are those created within the period
    const currentNewPatients = patients.data.filter((patient) => {
      if (!patient.created_at) return false;
      const patientDate = moment(patient.created_at);
      return patientDate.isBetween(startDate, endDate, "day", "[]");
    });

    // Calculate completion rate (completed appointments / total appointments)
    const currentCompletedAppointments = currentPeriodAppointments.filter(
      (appointment) => appointment.status?.id === 3 // Assuming 3 is the status ID for completed appointments
    ).length;

    const currentCompletionRate =
      currentPeriodAppointments.length > 0
        ? (currentCompletedAppointments / currentPeriodAppointments.length) *
          100
        : 0;

    const revenueCurrentPeriod = currentPeriodAppointments.reduce(
      (total, appointment) => total + (appointment?.services?.price || 0),
      0
    );

    // Previous period calculations
    const previousStartDate = startDate.clone().subtract(daysDiff, "days");
    const previousEndDate = endDate.clone().subtract(daysDiff, "days");

    const previousPeriodAppointments = appointments.data.filter(
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

    const previousActivePatientIds = new Set(
      previousPeriodAppointments.map((appointment) => appointment.patient_id)
    );

    const previousNewPatients = patients.data.filter((patient) => {
      if (!patient.created_at) return false;
      const patientDate = moment(patient.created_at);
      return patientDate.isBetween(
        previousStartDate,
        previousEndDate,
        "day",
        "[]"
      );
    });

    const previousCompletedAppointments = previousPeriodAppointments.filter(
      (appointment) => appointment.status?.id === 3
    ).length;

    const previousCompletionRate =
      previousPeriodAppointments.length > 0
        ? (previousCompletedAppointments / previousPeriodAppointments.length) *
          100
        : 0;

    const revenuePreviousPeriod = previousPeriodAppointments.reduce(
      (total, appointment) => total + (appointment?.services?.price || 0),
      0
    );

    // Calculate percentage changes
    const revenueChange = calculatePercentageChange(
      revenuePreviousPeriod,
      revenueCurrentPeriod
    );
    const newPatientsChange = calculatePercentageChange(
      previousNewPatients.length,
      currentNewPatients.length
    );
    const activePatientsChange = calculatePercentageChange(
      previousActivePatientIds.size,
      currentActivePatientIds.size
    );
    const completionRateChange = calculatePercentageChange(
      previousCompletionRate,
      currentCompletionRate
    );

    return {
      revenue: Number(revenueCurrentPeriod.toFixed(2)),
      revenueChange: Number(revenueChange.toFixed(2)),
      newPatients: currentNewPatients.length,
      newPatientsChange: Number(newPatientsChange.toFixed(2)),
      activePatients: currentActivePatientIds.size,
      activePatientsChange: Number(activePatientsChange.toFixed(2)),
      appointmentCompletionRate: Number(currentCompletionRate.toFixed(1)),
      appointmentCompletionRateChange: Number(completionRateChange.toFixed(1)),
      totalAppointments: currentPeriodAppointments.length,
      periodLength: daysDiff,
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
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Hi, Welcome back 👋
            </h2>
            <div className="hidden items-center space-x-2 md:flex">
              <CalendarDateRangePicker />
              <Button>Download</Button>
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
                  ₱{metrics.revenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.revenueChange > 0 ? "+" : ""}
                  {metrics.revenueChange}% from previous {metrics.periodLength}{" "}
                  days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.activePatients}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.activePatientsChange > 0 ? "+" : ""}
                  {metrics.activePatientsChange}% from previous{" "}
                  {metrics.periodLength} days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.newPatients}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.newPatientsChange > 0 ? "+" : ""}
                  {metrics.newPatientsChange}% from previous{" "}
                  {metrics.periodLength} days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Appointment Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.appointmentCompletionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.appointmentCompletionRateChange > 0 ? "+" : ""}
                  {metrics.appointmentCompletionRateChange}% from previous
                  period
                </p>
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
            <RecentSales />

            <div className="col-span-4">
              <PatientChart
                range={{ start: dateRangeStart, end: dateRangeEnd }}
                data={appointments}
              />
            </div>

            <div className="col-span-4 md:col-span-3">
              <PieGraph />
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
