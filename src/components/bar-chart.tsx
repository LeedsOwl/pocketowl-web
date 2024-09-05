"use client"

import * as React from "react";
import { useQuery } from "convex/react"; // Assuming your API is set up to fetch recent transactions
import { api } from "../../convex/_generated/api";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { subDays, format } from "date-fns"; // Import subDays and format

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

// Helper function to get the last 7 days
const getLast7Days = () => {
  return Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'EEEE')).reverse(); // Reverse to get Monday-Sunday order
};

// Helper function to get the previous 7 days
const getPreviousWeek = () => {
  const lastWeekStart = subDays(new Date(), 7);
  return Array.from({ length: 7 }, (_, i) => format(subDays(lastWeekStart, i), 'EEEE')).reverse();
};

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
};

const Chart = () => {
  // Fetch recent transactions for the current user
  const transactions = useQuery(api.transactions.getUserTransactions) || [];

  // Group transactions by day for the last 7 days
  const last7Days = getLast7Days();
  const previousWeek = getPreviousWeek();

  const weeklyData = last7Days.map((day) => ({
    day,
    total: transactions
      .filter((transaction: any) => format(new Date(transaction.dateTime), 'EEEE') === day)
      .reduce((sum: number, transaction: any) => sum + transaction.amount, 0),
  }));

  const previousWeekData = previousWeek.map((day) => ({
    day,
    total: transactions
      .filter((transaction: any) => format(new Date(transaction.dateTime), 'EEEE') === day)
      .reduce((sum: number, transaction: any) => sum + transaction.amount, 0),
  }));

  // Calculate total spending for the last 7 days and previous 7 days
  const totalCurrentWeek = weeklyData.reduce((sum, data) => sum + data.total, 0);
  const totalPreviousWeek = previousWeekData.reduce((sum, data) => sum + data.total, 0);

  // If previous week's total is 0, always show spending "up" by the total amount this week
  const showComparison = totalPreviousWeek > 0;
  const isSpendingUp = totalCurrentWeek > totalPreviousWeek;

  // Determine the class for the text and icon based on the comparison
  const trendClass = isSpendingUp ? "text-green-500" : "text-red-500";
  const Icon = isSpendingUp ? TrendingUp : TrendingDown;

  // Prepare data for the chart
  const chartData = weeklyData.map(({ day, total }) => ({
    day: day.slice(0, 3), // Shorten day names to 3 letters (Mon, Tue, etc.)
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
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="expenses" fill="var(--primary)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {!showComparison ? (
            // No previous week data, so show total spending this week
            <div className="flex gap-2 font-medium leading-none text-green-500">
              Spending up by £{totalCurrentWeek} this week
              <TrendingUp className="h-4 w-4" />
            </div>
          ) : (
            // Compare with the previous week's spending
            <div className={`flex gap-2 font-medium leading-none ${trendClass}`}>
              Spending {isSpendingUp ? "up" : "down"} by £{Math.abs(totalCurrentWeek - totalPreviousWeek)} this week
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="leading-none text-muted-foreground">
            Showing total Expenses for the last 7 days.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chart;
