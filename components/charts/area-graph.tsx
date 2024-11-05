"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import useSWR from "swr";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../ui/chart";

interface ApiResponse {
  data: PatientRecord[];
}

interface PatientRecord {
  date: string;
  patient_id: string;
}

interface AggregatedDataPoint {
  day: string;
  New: number;
  Returnee: number;
}

interface AggregatedData {
  [key: string]: AggregatedDataPoint;
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const chartConfig = {
  newPatient: {
    label: "New",
    color: "hsl(var(--chart-1))",
  },
  returneePatient: {
    label: "Returnee",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function AreaGraph() {
  const { data, error } = useSWR<ApiResponse>("/api/apt", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const aggregatedData: AggregatedData = {};

  data.data.forEach((item) => {
    const date = new Date(item.date);
    const day = date.toISOString().split("T")[0];

    if (!aggregatedData[day]) {
      aggregatedData[day] = { day, New: 0, Returnee: 0 };
    }

    const patientOccurrences = data.data.filter(
      (p) => p.patient_id === item.patient_id
    ).length;

    if (patientOccurrences === 1) {
      aggregatedData[day].New += 1;
    } else {
      aggregatedData[day].Returnee += 1;
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
          Showing the number of new and returnee patients per day.
        </CardDescription>

        <div className="mt-4 flex space-x-12 items-center">
          <div className="flex items-center space-x-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: "hsl(var(--chart-1))" }}
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
              style={{ backgroundColor: "hsl(var(--chart-4))" }}
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
