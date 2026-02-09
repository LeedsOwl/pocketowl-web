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

const GBP = "\u00A3";
const formatCurrency = (value: number) => `${GBP}${value.toFixed(2)}`;

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
  const trendClass = isSpendingUp ? "text-amber-500" : "text-cyan-500";
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
    <div className="px-0">
      <Card className="surface-card border-white/30 bg-transparent">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-slate-900 dark:text-slate-100">Expenditures</CardTitle>
            <img src="/credit-card.gif" alt="Stats Gif" className="ml-2 h-6 w-6" />
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            {getTimeframeTitle()}
          </CardDescription>
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
                tick={{ fontSize: 12, fill: "hsl(var(--chart-axis-foreground))" }}
                height={50}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="expenses" fill="#3b82f6" radius={[10, 10, 0, 0]}>
                <LabelList
                  dataKey="expenses"
                  position="top"
                  offset={12}
                  fill="hsl(var(--chart-axis-foreground))"
                  fontSize={10}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {isFirstPeriod ? (
            <div className="flex gap-2 font-medium leading-none text-slate-900 dark:text-slate-100">
              Total expenditure this {activeTimeframe}: {formatCurrency(totalCurrent)}
            </div>
          ) : (
            <div className={`flex gap-2 font-medium leading-none ${trendClass}`}>
              Spending {isSpendingUp ? "increased" : "decreased"} by{" "}
              {formatCurrency(Math.abs(totalCurrent - totalPrevious))} this {activeTimeframe}
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="leading-none text-slate-600 dark:text-slate-300">
            Showing total Expenditures for the {getTimeframeTitle().toLowerCase()}.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chart;
