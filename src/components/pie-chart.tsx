import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TrendingUp } from "lucide-react";
import { TrendingDown } from "lucide-react";
import { Pie, PieChart, PieLabelRenderProps, Label, Cell } from "recharts"; // Import Cell for individual color control
import { FaCircle } from "react-icons/fa";
import { motion } from "framer-motion"; 
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

// Define category colors for the PieChart and icons
const categoryColors = {
  food: "#6C465D",
  bills: "#A95166",
  travel: "#EB6D3A",
  others: "#E1A639",
  shopping: "#386590",
};

const friendlyNameMap = {
  food: "Food",
  bills: "Bills",
  travel: "Travel",
  others: "Others",
  shopping: "Shopping",
};

const chartConfig = {
  food: { label: "Food" },
  bills: { label: "Bills" },
  travel: { label: "Travel" },
  others: { label: "Others" },
  shopping: { label: "Shopping" },
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <motion.text
      initial={{ opacity: 0, y: 10 }}
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
}

interface Insights {
  totalAmount: number;
  categoryTotals: { [key: string]: number; };
}

export function Donut() {
  const transactions: Insights = useQuery(api.insights.getInsights, { period: "month" }) || { totalAmount: 0, categoryTotals: {} };
  console.log(transactions);

  const categoryTotals = transactions?.categoryTotals;

  const chartData = Object.keys(categoryTotals).map(category => ({
    category,
    value: categoryTotals[category],
    color: categoryColors[category as keyof typeof categoryColors],
  }));

  if (transactions.totalAmount === 0) {
    return <div>No transactions available for this period.</div>;
  }

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
              This month
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
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
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
                              £{transactions.totalAmount}
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
              {Object.keys(categoryTotals).map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <FaCircle className="h-3 w-3" style={{ color: categoryColors[category as keyof typeof categoryColors] }} /> {friendlyNameMap[category as keyof typeof friendlyNameMap] || category}
                </motion.div>
              ))}
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
          </CardFooter>
        </motion.div>
      </Card>
    </div>
  );
}
