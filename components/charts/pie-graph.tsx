"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";

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

// Define types for appointment and statusCounts
interface Appointment {
  status: string;
}

interface StatusCounts {
  [key: string]: number;
}

// Sample appointment data
const appointments: Appointment[] = [
  { status: "Canceled" },
  { status: "Reject" },
  { status: "Accepted" },
  { status: "Canceled" },
  { status: "Canceled" },
  { status: "Pending" },
  { status: "Canceled" },
  { status: "Accepted" },
  { status: "Canceled" },
  { status: "Canceled" },
];

// Initialize and populate statusCounts with type annotations
const statusCounts: StatusCounts = appointments.reduce(
  (acc: StatusCounts, appointment) => {
    const { status } = appointment;
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status]++;
    return acc;
  },
  {}
);

// Create data for pie chart with specific colors
const chartData = Object.keys(statusCounts).map((status) => ({
  status,
  count: statusCounts[status],
  fill:
    status === "Accepted"
      ? "#4caf50"
      : status === "Canceled"
      ? "#f44336"
      : status === "Reject"
      ? "#ff9800"
      : "#2196f3", // Custom colors
}));

const chartConfig = {
  visitors: {
    label: "Appointments",
  },
  Canceled: {
    label: "Canceled",
    color: "hsl(var(--chart-1))",
  },
  Reject: {
    label: "Reject",
    color: "hsl(var(--chart-2))",
  },
  Accepted: {
    label: "Accepted",
    color: "hsl(var(--chart-3))",
  },
  Pending: {
    label: "Pending",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function PieGraph() {
  const totalAppointments = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Appointment Status</CardTitle>
        <CardDescription>October 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAppointments.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Appointments
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Showing status distribution for October 2024
        </div>
      </CardFooter>
    </Card>
  );
}
