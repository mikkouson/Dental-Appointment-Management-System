import React from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import moment from "moment";

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

interface ServiceUsage {
  name: string;
  count: number;
  totalPrice: number;
}

interface DateRange {
  start: string;
  end: string;
}

const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
};

const barColors = [
  chartConfig.desktop.color,
  chartConfig.mobile.color,
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function PieGraph({
  branch,
  range,
}: {
  branch: string;
  range: DateRange;
}) {
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

  if (appointmentsLoading) return <>loading</>;

  const serviceUsage: Record<string, ServiceUsage> = {};

  // Filter appointments by date range and status equals 4
  const filteredAppointments = appointments?.data.filter((appointment) => {
    const appointmentDate = moment(appointment.date);
    const isInRange = appointmentDate.isBetween(
      moment(range.start),
      moment(range.end),
      "day",
      "[]"
    );
    return isInRange && appointment?.status?.id === 4;
  });

  // Process only the filtered appointments
  filteredAppointments?.forEach((appointment) => {
    const service = appointment.services;
    if (service) {
      const serviceId = service.id;
      const serviceName = service.name || "";
      const servicePrice = service.price || 0;

      if (!serviceUsage[serviceId]) {
        serviceUsage[serviceId] = {
          name: serviceName,
          count: 0,
          totalPrice: 0,
        };
      }

      serviceUsage[serviceId].count += 1;
      serviceUsage[serviceId].totalPrice += servicePrice;
    }
  });

  const chartData: ServiceUsage[] = Object.values(serviceUsage);
  const top5Services = chartData.sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top 5 Services </CardTitle>
        <CardDescription>
          Usage of top 5 services for status 4 appointments between{" "}
          {moment(range.start).format("MMM D, YYYY")} and{" "}
          {moment(range.end).format("MMM D, YYYY")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[270px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={top5Services}
            layout="vertical"
            margin={{
              left: 50,
              right: 20,
              top: 10,
              bottom: 10,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" radius={5}>
              {top5Services.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing usage of the top 5 services for appointments with completed
          within the selected date range
        </div>
      </CardFooter>
    </Card>
  );
}

export default PieGraph;
