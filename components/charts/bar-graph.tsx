import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAppointments } from "../hooks/useAppointment";
import moment from "moment";

interface revenueData {
  date: string;
  revenue: number;
}

const chartConfig: ChartConfig = {
  desktop: {
    label: "revenue",
    color: "hsl(var(--chart-1))",
  },
};

interface DateRange {
  start: string;
  end: string;
}

interface RevenueGraphProps {
  range: DateRange;
  metrics: any;
}

export function RevenueGraph({ range, metrics }: RevenueGraphProps) {
  const { appointments, appointmentsLoading } = useAppointments();

  if (appointmentsLoading) return <>loading</>;

  const revenueData: Record<string, number> = {};

  // Filter for completed appointments (status.id === 4) and within date range
  appointments?.data
    ?.filter((appointment) => {
      const date = moment(appointment.date);
      const startDate = moment(range.start);
      const endDate = moment(range.end);
      return (
        date.isBetween(startDate, endDate, "day", "[]") &&
        appointment.status?.id === 4 // Only include completed appointments
      );
    })
    .forEach((appointment) => {
      const date = moment(appointment.date).format("YYYY-MM-DD");
      const price = appointment?.services?.price || 0;

      if (!revenueData[date]) {
        revenueData[date] = 0;
      }
      revenueData[date] += price;
    });

  // Fill in missing dates with zero revenue
  const startDate = moment(range.start);
  const endDate = moment(range.end);
  const currentDate = startDate.clone();

  while (currentDate.isSameOrBefore(endDate)) {
    const dateStr = currentDate.format("YYYY-MM-DD");
    if (!revenueData[dateStr]) {
      revenueData[dateStr] = 0;
    }
    currentDate.add(1, "day");
  }

  const chartData: revenueData[] = Object.entries(revenueData)
    .map(([date, revenue]) => ({
      date,
      revenue,
    }))
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  // Format currency for Y-axis (Philippine Peso)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Total Revenue Over {moment(range.start).format("MMMM D")} to{" "}
          {moment(range.end).format("MMMM D")}
        </CardTitle>
        <CardDescription>
          Revenue from completed appointments by day
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 40,
              bottom: 0,
              left: 32,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => moment(value).format("MMM D")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatCurrency}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {metrics.revenueChange > 0 ? (
            <>
              Trending up by {metrics.revenueChange > 0 ? "+" : ""}
              {metrics.revenueChange}% from previous {metrics.periodLength} days{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(metrics.revenueChange)}% from previous{" "}
              {metrics.periodLength} days <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing completed appointment revenue from{" "}
          {moment(range.start).format("MMMM D")} to{" "}
          {moment(range.end).format("MMMM D")}
        </div>
      </CardFooter>
    </Card>
  );
}

export default RevenueGraph;
