"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { FaCircle } from "react-icons/fa";

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

const chartData = [
  { category: "chrome", value: 275, fill: "#6C465D" },
  { category: "safari", value: 200, fill: "#A95166" },
  { category: "firefox", value: 287, fill: "#EB6D3A" },
  { category: "edge", value: 173, fill: "#E1A639" },
  { category: "other", value: 190, fill: "#386590" },
];

// const RADIAN = Math.PI / 180
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5
//   const x = cx + radius * Math.cos(-midAngle * RADIAN)
//   const y = cy + radius * Math.sin(-midAngle * RADIAN)

//   return (
//     <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14">
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   )
// }

const chartConfig = {
  chrome: {
    label: "23%",
  },
  safari: {
    label: "17%",
  },
  firefox: {
    label: "32%",
  },
  edge: {
    label: "14%",
  },
  other: {
    label: "14%",
  },
} satisfies ChartConfig;

export function Donut() {
  // const totalVisitors = React.useMemo(() => {
  //   return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  // }, [])

  return (
    <Card
      className="text-white border border-gray-400 rounded-lg shadow-md"
      style={{
        backgroundImage: "url('/stacked-waves.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CardHeader className="items-center">
        <CardTitle>Category Summary</CardTitle>
        <CardDescription className="text-gray-400">
          January - September 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              dataKey="value"
              nameKey="category"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="white"
                  >
                    {`${
                      chartConfig[payload.category as keyof typeof chartConfig]
                        ?.label
                    }`}
                  </text>
                );
              }}
              innerRadius={60}
              strokeWidth={5}
            >
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
                          Cunts
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 16}
                          className="fill-white"
                        >
                          Visited
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
      <div className="p-1"></div>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none max-w-sm">
          <FaCircle className="h-3 w-3 border text-[#6C465D]" /> Shopping{" "}
          <FaCircle className="h-3 w-3 border text-[#A95166]" /> Home
        </div>
        <div className="flex items-center gap-2 font-medium leading-none max-w-sm">
          <FaCircle className="h-3 w-3 border text-[#EB6D3A]" /> Food & Drink{" "}
          <FaCircle className="h-3 w-3 border text-[#E1A639]" /> Trips{" "}
          <FaCircle className="h-3 w-3 border text-[#386590]" /> Transport
        </div>
        <br />
        <div className="flex items-center gap-2 font-medium leading-none">
          Expenditures up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-400">
          Showing total Cunts for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
