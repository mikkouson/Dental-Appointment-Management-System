"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

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

// Define an array of colors for the bars
const barColors = [
  chartConfig.desktop.color, // Desktop color
  chartConfig.mobile.color, // Mobile color
  "hsl(var(--chart-3))", // Additional color for the third service
  "hsl(var(--chart-4))", // Additional color for the fourth service
  "hsl(var(--chart-5))", // Additional color for the fifth service
];

export function PieGraph() {
  const { appointments, appointmentsLoading } = useAppointments();

  if (appointmentsLoading) return <>loading</>;

  const serviceUsage: Record<string, ServiceUsage> = {};

  appointments?.data.forEach((appointment) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Services</CardTitle>
        <CardDescription>Usage of top 5 services</CardDescription>
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
              left: 0,
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
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing usage of the top 5 services
        </div>
      </CardFooter>
    </Card>
  );
}
