"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { FaCircle } from "react-icons/fa";
import { motion } from "framer-motion"; // Import Framer Motion

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

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

// Expense data, representing categories and amounts
const chartData = [
  { category: "Shopping", value: 275, fill: "#6C465D" },
  { category: "Home", value: 200, fill: "#A95166" },
  { category: "Food & Drink", value: 287, fill: "#EB6D3A" },
  { category: "Trips", value: 173, fill: "#E1A639" },
  { category: "Transport", value: 190, fill: "#386590" },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <motion.text
      initial={{ opacity: 0, y: 10 }} // Motion animation for chart labels
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="16"
      className="font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </motion.text>
  );
};

const chartConfig = {
  Shopping: {
    label: "Shopping%",
  },
  Home: {
    label: "Home",
  },
  "Food & Drink": {
    label: "Food & Drink",
  },
  Trips: {
    label: "Trips",
  },
  Transport: {
    label: "Transport",
  },
} satisfies ChartConfig;

export function Donut() {
  return (
    <div>
      <Card className="text-white border bg-background rounded-lg shadow-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CardHeader className="pb-1">
            <CardTitle className="text-xl font-bold tracking-wide">
              Personal Expense Breakdown
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Last 6 months of expenses categorized
            </CardDescription>
          </CardHeader>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CardContent className="p-0 flex-1">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[400px] w-full"
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
                  label={renderCustomizedLabel}
                  innerRadius={80}
                  outerRadius={140}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationBegin={400}
                  animationDuration={1200}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <motion.text
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-white text-2xl font-bold"
                            >
                              £1025
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-gray-400 text-md"
                            >
                              Total Expenses
                            </tspan>
                          </motion.text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="grid grid-cols-2 gap-2 font-medium text-gray-200">
            {/* <div className="grid grid-cols-2 gap-y-2 gap-x-4 font-medium text-gray-200"> */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-2"
              >
                <FaCircle className="h-3 w-3 text-[#6C465D]" /> Shopping
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-2"
              >
                <FaCircle className="h-3 w-3 text-[#A95166]" /> Home
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center gap-2"
              >
                <FaCircle className="h-3 w-3 text-[#EB6D3A]" /> Food & Drink
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center gap-2"
              >
                <FaCircle className="h-3 w-3 text-[#E1A639]" /> Trips
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex items-center gap-2"
              >
                <FaCircle className="h-3 w-3 text-[#386590]" /> Transport
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex items-center gap-2 font-medium leading-none mt-4 text-green-400"
            >
              Savings increased by 5.2% this month{" "}
              <TrendingUp className="h-5 w-5" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="leading-none text-gray-500"
            >
              Showing categorized expenses for the last 6 months
            </motion.div>
          </CardFooter>
        </motion.div>
      </Card>
    </div>
  );
}
