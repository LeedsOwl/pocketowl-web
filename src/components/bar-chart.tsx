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

interface TimeframeData {
  label: string;
  total: number;
}

interface ChartProps {
  timeframeData: TimeframeData[];
  totalCurrent: number;
  totalPrevious: number;
  isFirstPeriod: boolean;
  isSpendingUp: boolean;
  activeTimeframe: string;
}

const Chart: React.FC<ChartProps> = ({
  timeframeData,
  totalCurrent,
  totalPrevious,
  isFirstPeriod,
  isSpendingUp,
  activeTimeframe,
}) => {
  const trendClass = isSpendingUp ? "text-red-500" : "text-green-500";
  const Icon = isSpendingUp ? TrendingUp : TrendingDown;

  const chartData = timeframeData.map(({ label, total }) => ({
    label: activeTimeframe === "week" ? label.slice(0, 3) : label,
    expenses: total,
  }));

  const getTimeframeTitle = () => {
    switch (activeTimeframe) {
      case "week":
        return "Last 7 Days";
      case "month":
        return "Last 6 Months";
      case "year":
        return "Last 5 Years";
      default:
        return "";
    }
  };

  return (
    <div className="p-3">
      <Card className="bg-background">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle>Expenditures</CardTitle>
            <img
              src="/credit-card.gif"
              alt="Stats Gif"
              className="ml-2 w-6 h-6"
            />
          </div>
          <CardDescription>{getTimeframeTitle()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              height={300}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 12 }}
                height={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="expenses"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="expenses"
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                  formatter={(value: number) => `£${value}`}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {isFirstPeriod ? (
            <div className="flex gap-2 font-medium leading-none text-slate-900 dark:text-primary">
              Total expenditure this {activeTimeframe}: £{totalCurrent}
            </div>
          ) : (
            <div className={`flex gap-2 font-medium leading-none ${trendClass}`}>
              Spending {isSpendingUp ? "increased" : "decreased"} by £
              {Math.abs(totalCurrent - totalPrevious)} this {activeTimeframe}
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="leading-none text-gray-500 dark:text-gray-400">
            Showing total Expenditures for the {getTimeframeTitle().toLowerCase()}.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chart;
