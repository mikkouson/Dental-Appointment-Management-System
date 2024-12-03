"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../ui/chart";

interface AggregatedDataPoint {
  day: string;
  New: number;
  Returnee: number;
}

interface AggregatedData {
  [key: string]: AggregatedDataPoint;
}

interface DateRange {
  start: string; // Format: 'YYYY-MM-DD'
  end: string; // Format: 'YYYY-MM-DD'
}

const chartConfig = {
  newPatient: {
    label: "New",
    color: "hsl(var(--chart-1))",
  },
  returneePatient: {
    label: "Returnee",
    color: "#FFB347", // Changed to a darker orange-yellow color
  },
} satisfies ChartConfig;

interface AreaGraphProps {
  range: DateRange;
  data: any;
}

export function PatientChart({ range, data }: AreaGraphProps) {
  const aggregatedData: AggregatedData = {};

  data.data.forEach((item: any) => {
    const date = new Date(item.date);
    const day = date.toISOString().split("T")[0];

    if (day >= range.start && day <= range.end) {
      if (!aggregatedData[day]) {
        aggregatedData[day] = { day, New: 0, Returnee: 0 };
      }

      const patientOccurrences = data.data.filter(
        (p: { patient_id: any }) => p.patient_id === item.patient_id
      ).length;

      if (patientOccurrences === 1) {
        aggregatedData[day].New += 1;
      } else {
        aggregatedData[day].Returnee += 1;
      }
    }
  });

  const chartData = Object.values(aggregatedData).sort((a, b) => {
    return new Date(a.day).getTime() - new Date(b.day).getTime();
  });

  const totalNew = chartData.reduce((sum, item) => sum + item.New, 0);
  const totalReturnee = chartData.reduce((sum, item) => sum + item.Returnee, 0);
  const total = totalNew + totalReturnee;

  const newPercentage =
    total > 0 ? ((totalNew / total) * 100).toFixed(1) : "0.0";
  const returneePercentage =
    total > 0 ? ((totalReturnee / total) * 100).toFixed(1) : "0.0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Types - New vs Returnee</CardTitle>
        <CardDescription>
          Showing the number of new and returnee patients from {range.start} to{" "}
          {range.end}.
        </CardDescription>

        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <div className="flex items-center space-x-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: chartConfig.newPatient.color }}
            ></span>
            <div className="flex">
              <h2 className="text-lg font-semibold leading-none mr-2">
                {totalNew}
              </h2>
              <h3 className="text-sm text-gray-600">New ({newPercentage}%)</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: chartConfig.returneePatient.color }}
            ></span>
            <div className="flex">
              <h2 className="text-lg font-semibold leading-none mr-2">
                {totalReturnee}
              </h2>
              <h3 className="text-sm text-gray-600">
                Returnee ({returneePercentage}%)
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-block w-4 h-4 rounded-full bg-gray-400"></span>
            <div className="flex">
              <h2 className="text-lg font-semibold leading-none mr-2">
                {total}
              </h2>
              <h3 className="text-sm text-gray-600">Total</h3>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("default", {
                  month: "short",
                  day: "numeric",
                });
              }}
              minTickGap={20}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              content={<ChartTooltipContent indicator="dot" />}
              cursor={{ stroke: "#ccc", strokeWidth: 1 }}
            />
            <Bar
              dataKey="New"
              fill={chartConfig.newPatient.color}
              name={chartConfig.newPatient.label}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Returnee"
              fill={chartConfig.returneePatient.color}
              name={chartConfig.returneePatient.label}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
