import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Area, AreaChart, XAxis } from "recharts";
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
  metrics: any; // Replace 'any' with the appropriate type
}
export function RevenueGraph({ range, metrics }: RevenueGraphProps) {
  const { appointments, appointmentsLoading } = useAppointments();

  if (appointmentsLoading) return <>loading</>;

  const revenueData: Record<string, number> = {};

  appointments?.data
    .filter((appointment) => {
      const date = moment(appointment.date);
      const startDate = moment(range.start);
      const endDate = moment(range.end);
      return date.isBetween(startDate, endDate, "day", "[]");
    })
    .forEach((appointment) => {
      const date = moment(appointment.date).format("YYYY-MM-DD");
      const price = appointment?.services?.price || 0;

      if (!revenueData[date]) {
        revenueData[date] = 0;
      }
      revenueData[date] += price;
    });

  const chartData: revenueData[] = Object.entries(revenueData)
    .map(([date, revenue]) => ({
      date,
      revenue,
    }))
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Total Revenue Over {moment(range.start).format("MMMM D")} to{" "}
          {moment(range.end).format("MMMM D")}
        </CardTitle>

        <CardDescription>Revenue by day</CardDescription>
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
              left: 12,
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
          Showing total revenue from {moment(range.start).format("MMMM D")} to{" "}
          {moment(range.end).format("MMMM D")}
        </div>
      </CardFooter>
    </Card>
  );
}
