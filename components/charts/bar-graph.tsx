import React from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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

interface IncomeData {
  date: string;
  income: number;
}

const chartConfig: ChartConfig = {
  desktop: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
};

export function BarGraph() {
  const { appointments, appointmentsLoading } = useAppointments();

  if (appointmentsLoading) return <>loading</>;

  const incomeData: Record<string, number> = {};

  appointments?.data.forEach((appointment) => {
    const date = moment(appointment.date).format("YYYY-MM-DD");
    const price = appointment?.services?.price || 0;

    if (!incomeData[date]) {
      incomeData[date] = 0;
    }
    incomeData[date] += price;
  });

  const chartData: IncomeData[] = Object.entries(incomeData)
    .map(([date, income]) => ({
      date,
      income,
    }))
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Chart</CardTitle>
        <CardDescription>Income by day</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 0,
              bottom: 4,
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
            <Line
              dataKey="income"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total income for the last 6 days
        </div>
      </CardFooter>
    </Card>
  );
}
