"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";
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
const barShadeScale = ["#2f3c31", "#3b4a3d", "#47594a", "#556b57", "#67806a", "#849b86", "#c2d2c4"];

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
  timeframeTabs?: React.ReactNode;
}

const Chart: React.FC<ChartProps> = ({
  timeframeData,
  totalCurrent,
  totalPrevious,
  isFirstPeriod,
  isSpendingUp,
  activeTimeframe,
  timeframeTabs,
}) => {
  const trendClass = isSpendingUp ? "text-amber-500" : "text-[#9eb89f]";
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
      <Card className="home-panel home-panel-chart bg-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <CardTitle className="text-[2rem] font-semibold leading-none text-white/95">Expenditures</CardTitle>
            <img src="/credit-card.gif" alt="Stats Gif" className="ml-2 h-6 w-6" />
          </div>
          <CardDescription className="pt-1 text-sm text-white/62">
            {getTimeframeTitle()}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 12, right: 0, left: 0, bottom: 0 }}
              height={248}
            >
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.09)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={9}
                axisLine={{ stroke: "rgba(255,255,255,0.14)" }}
                interval={0}
                tick={{ fontSize: 11, fill: "rgba(228,233,240,0.62)" }}
                height={42}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="expenses" radius={[10, 10, 0, 0]}>
                {chartData.map((_, index) => {
                  const shadeIndex = Math.round(
                    (index / Math.max(chartData.length - 1, 1)) * (barShadeScale.length - 1)
                  );
                  return <Cell key={`cell-${index}`} fill={barShadeScale[shadeIndex]} />;
                })}
                <LabelList
                  dataKey="expenses"
                  position="top"
                  offset={10}
                  fill="rgba(236,240,246,0.78)"
                  fontSize={9}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {isFirstPeriod ? (
            <div className="flex gap-2 font-semibold leading-none text-white/92">
              Total expenditure this {activeTimeframe}: {formatCurrency(totalCurrent)}
            </div>
          ) : (
            <div className={`flex gap-2 font-medium leading-none ${trendClass}`}>
              Spending {isSpendingUp ? "increased" : "decreased"} by{" "}
              {formatCurrency(Math.abs(totalCurrent - totalPrevious))} this {activeTimeframe}
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="leading-none text-white/55">
            Showing total Expenditures for the {getTimeframeTitle().toLowerCase()}.
          </div>
        </CardFooter>
        {timeframeTabs ? <div className="px-6 pb-4">{timeframeTabs}</div> : null}
      </Card>
    </div>
  );
};

export default Chart;
