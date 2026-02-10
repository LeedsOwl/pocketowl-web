import * as React from "react";
import { Pie, PieChart, PieLabelRenderProps, Label, Cell } from "recharts"; 
import { FaCircle } from "react-icons/fa";
import { motion } from "framer-motion"; 
import { LuSparkles } from "react-icons/lu";
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
import { getCategoryColor, getCategoryLabel } from "@/lib/category-meta";

const GBP = "\u00A3";

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
  compact?: boolean;
}

export function Donut({ chartData, totalAmount, categoryTotals, compact = false }: DonutProps) {
  if (totalAmount === 0) {
    return (
      <Card className="surface-card relative overflow-hidden rounded-3xl text-white">
        <div className="pointer-events-none absolute -top-16 left-[-8%] h-44 w-44 rounded-full bg-[#9fb0a7]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-[-8%] h-48 w-48 rounded-full bg-[#445056]/16 blur-3xl" />
        <CardHeader className="relative z-10 pb-2">
          <CardTitle className="text-xl text-white/95 font-semibold tracking-wide">
            Personal Expense Breakdown
          </CardTitle>
          <CardDescription className="text-sm text-white/55">
            This month
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pb-6">
          <div className="relative grid min-h-[240px] place-items-center overflow-hidden rounded-2xl border border-white/12 bg-black/20 text-center">
            <div className="pointer-events-none absolute -top-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[#9eb89f]/20 blur-2xl" />
            <div className="relative z-10 space-y-3 px-6">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/75">
                <LuSparkles className="h-3.5 w-3.5 text-[#9eb89f]" />
                Waiting for Data
              </div>
              <p className="text-xl font-semibold text-white/92">Nothing to chart yet</p>
              <p className="mx-auto max-w-xs text-sm text-white/62">
                Once you add expenses, your category mix and percentages will appear here automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = chartData.length > 0 
    ? { expenses: { label: "Expenses" } } 
    : { expenses: { label: "No Data" } };

  const categoryEntries = Object.entries(categoryTotals || {})
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <div>
      <Card className="surface-card relative overflow-hidden rounded-3xl text-white">
        <div className="pointer-events-none absolute -top-16 left-[-8%] h-44 w-44 rounded-full bg-[#9fb0a7]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-[-8%] h-48 w-48 rounded-full bg-[#445056]/16 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CardHeader className="relative z-10 pb-1">
            <CardTitle className="text-xl text-white/95 font-semibold tracking-wide">
              Personal Expense Breakdown
            </CardTitle>
            <CardDescription className="text-sm text-white/55">
              This month
            </CardDescription>
          </CardHeader>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CardContent className="relative z-10 p-0 flex-1">
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
                    innerRadius={84}
                    outerRadius={136}
                    strokeWidth={3}
                    stroke="rgba(5, 8, 12, 0.85)"
                    isAnimationActive={true}
                    animationBegin={400}
                    animationDuration={1200}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getCategoryColor(entry.category)}
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
                                className="fill-white text-2xl text-center font-bold"
                              >
                                {GBP}{totalAmount.toFixed(2)}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-white/55 text-md"
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
          <CardFooter className="relative z-10 flex-col gap-2 text-sm">
            <div className="grid grid-cols-2 gap-2 font-medium text-white/80">
              {categoryEntries.map(([category, value], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
                >
                  <FaCircle
                    className="h-3 w-3"
                    style={{
                      color: getCategoryColor(category),
                    }}
                  />
                  <span>
                    {getCategoryLabel(category)} {((value / totalAmount) * 100).toFixed(0)}%
                  </span>
                </motion.div>
              ))}
            </div>
          </CardFooter>
        </motion.div>
      </Card>

      {!compact && (
        <div className="mt-3 space-y-2">
          {categoryEntries.map(([category, value], index) => (
            <motion.div
              key={`amount-${category}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="surface-card flex items-center justify-between rounded-xl border-white/15 px-3 py-2 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <FaCircle
                  className="h-3 w-3"
                  style={{
                    color: getCategoryColor(category),
                  }}
                />
                <span className="font-medium text-slate-100">
                  {getCategoryLabel(category)}
                </span>
              </div>
              <span className="font-semibold text-slate-100">
                {GBP}{value.toFixed(2)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

