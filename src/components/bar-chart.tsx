"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
};

interface WeeklyData {
  day: string;
  total: number;
}

interface ChartProps {
  weeklyData: WeeklyData[];
  totalCurrentWeek: number;
  totalPreviousWeek: number;
  isFirstWeek: boolean;
  isSpendingUp: boolean;
}


const Chart: React.FC<ChartProps> = ({ weeklyData, totalCurrentWeek, totalPreviousWeek, isFirstWeek, isSpendingUp }) => {
  const trendClass = isSpendingUp ? "text-red-500" : "text-green-500";
  const Icon = isSpendingUp ? TrendingUp : TrendingDown;

  const chartData = weeklyData.map(({ day, total }) => ({
    day: day.slice(0, 3),
    expenses: total,
  }));

  return (
    <div className="p-3">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Expenses - Bar Chart</CardTitle>
          <CardDescription>Last 7 Days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="expenses" fill="var(--primary)" radius={8}>
                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {isFirstWeek ? (
            <div className="flex gap-2 font-medium leading-none text-primary">
              Total expenditure this week: £{totalCurrentWeek}
            </div>
          ) : (
            <div className={`flex gap-2 font-medium leading-none ${trendClass}`}>
              Expenditure {isSpendingUp ? "up" : "down"} by £{Math.abs(totalCurrentWeek - totalPreviousWeek)} this week
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="leading-none text-gray-400">
            Showing total Expenses for the last 7 days.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chart;
