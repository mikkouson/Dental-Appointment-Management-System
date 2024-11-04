"use client";
import { AreaGraph } from "@/components/charts/area-graph";
import { BarGraph } from "@/components/charts/bar-graph";
import { PieGraph } from "@/components/charts/pie-graph";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { useAppointments } from "@/components/hooks/useAppointment";
import { usePatients } from "@/components/hooks/usePatient";
import PageContainer from "@/components/layout/page-container";
import { RecentSales } from "@/components/recent-sales";
import { SidebarDemo } from "@/components/sidebar";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const { appointments, appointmentsLoading } = useAppointments();
  const { patients, patientLoading } = usePatients();

  if (patientLoading || appointmentsLoading) return <> Loading</>;

  const calculateMetrics = () => {
    if (!appointments?.data?.length || !patients?.count)
      return { rate: 0, change: 0, revenueChange: 0, patientChange: 0 };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January)
    const currentYear = currentDate.getFullYear();

    const currentMonthAppointments = appointments.data.filter((appointment) => {
      if (!appointment.date) return false;
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getMonth() === currentMonth &&
        appointmentDate.getFullYear() === currentYear
      );
    });

    const previousMonthAppointments = appointments.data.filter(
      (appointment) => {
        if (!appointment.date) return false;
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getMonth() === currentMonth - 1 &&
          appointmentDate.getFullYear() === currentYear
        );
      }
    );

    const totalCurrentMonth = currentMonthAppointments.length;
    const completedCurrentMonth = currentMonthAppointments.filter(
      (appointment) => appointment.status?.id === 4 // Completed status
    ).length;

    const totalPreviousMonth = previousMonthAppointments.length;
    const completedPreviousMonth = previousMonthAppointments.filter(
      (appointment) => appointment.status?.id === 4
    ).length;

    const revenueCurrentMonth = currentMonthAppointments.reduce(
      (total, appointment) => total + (appointment?.services?.price || 0),
      0
    );

    const revenuePreviousMonth = previousMonthAppointments.reduce(
      (total, appointment) => total + (appointment?.services?.price || 0),
      0
    );

    const rate = (completedCurrentMonth / totalCurrentMonth) * 100;
    const formattedRate = Number(rate.toFixed(1));

    const previousRate =
      totalPreviousMonth > 0
        ? (completedPreviousMonth / totalPreviousMonth) * 100
        : 0;
    const formattedPreviousRate = Number(previousRate.toFixed(1));

    const revenueChange =
      ((revenueCurrentMonth - revenuePreviousMonth) /
        (revenuePreviousMonth || 1)) *
      100;
    const patientChange =
      ((patients.count - previousMonthAppointments.length) /
        (previousMonthAppointments.length || 1)) *
      100;
    const change = ((rate - previousRate) / (previousRate || 1)) * 100;

    return {
      rate: formattedRate,
      change: Number(change.toFixed(1)),
      revenueChange: Number(revenueChange.toFixed(1)),
      patientChange: Number(patientChange.toFixed(1)),
    };
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
                  ₱
                  {appointments?.data
                    .reduce(
                      (total, appointment) =>
                        total + (appointment?.services?.price || 0),
                      0
                    )
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.revenueChange > 0 ? "+" : ""}
                  {metrics.revenueChange}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{patients?.count}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.patientChange > 0 ? "+" : ""}
                  {metrics.patientChange}% from last month
                </p>
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
                  {
                    appointments?.data.filter(
                      (appointment) => appointment.status?.id === 1
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Pending appointments this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Appointment Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.rate}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.change > 0 ? "+" : ""}
                  {metrics.change}% from last period
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <BarGraph />
            </div>

            <Card className="col-span-4 md:col-span-3">
              <CardHeader>
                <CardTitle>Latest appointments</CardTitle>
                <CardDescription>
                  You made {appointments?.data.length} appointments this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>

            <div className="col-span-4">
              <AreaGraph />
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
