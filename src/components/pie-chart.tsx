import * as React from "react";
import { Pie, PieChart, PieLabelRenderProps, Label, Cell } from "recharts"; 
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

const categoryColors: Record<string, string> = {
  food: "#6C465D",
  bills: "#A95166",
  travel: "#EB6D3A",
  others: "#E1A639",
  shopping: "#386590",
};

const friendlyNameMap: Record<string, string> = {
  food: "Food",
  bills: "Bills",
  travel: "Travel",
  others: "Others",
  shopping: "Shopping",
};

const defaultColor = "#333";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent = 0,
}: PieLabelRenderProps) => {
  if (percent === 0) return null; 
  
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
};


interface DonutProps {
  chartData: Array<{ category: string; value: number }>;
  totalAmount: number;
  categoryTotals: { [key: string]: number };
}

export function Donut({ chartData, totalAmount, categoryTotals }: DonutProps) {
  if (totalAmount === 0) {
    return <div>No transactions available for this period.</div>;
  }

  const chartConfig = chartData.length > 0 
    ? { expenses: { label: "Expenses" } } 
    : { expenses: { label: "No Data" } };

  return (
    <div>
      <Card className="text-white border bg-background rounded-lg shadow-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CardHeader className="pb-1">
            <CardTitle className="text-xl text-black dark:text-white font-bold tracking-wide">
              Personal Expense Breakdown
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
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
            {chartData && (
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
                      <Cell
                        key={`cell-${index}`}
                        fill={categoryColors[entry.category.toLowerCase()] || defaultColor}
                      />
                    ))}
                    <Label className="text-center"
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
                                className="text-black dark:fill-white text-2xl text-center font-bold"
                              >
                                £{totalAmount}
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
            )}
          </CardContent>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="grid grid-cols-2 gap-2 font-medium text-gray-800 dark:text-gray-200 ">
              {Object.keys(categoryTotals || {}).map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <FaCircle
                    className="h-3 w-3"
                    style={{
                      color: categoryColors[category.toLowerCase()] || defaultColor,
                    }}
                  />{" "}
                  {friendlyNameMap[category.toLowerCase() as keyof typeof friendlyNameMap] || category}
                </motion.div>
              ))}
            </div>
          </CardFooter>
        </motion.div>
      </Card>
    </div>
  );
}
