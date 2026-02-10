import { Pie, PieChart, Cell, Label } from "recharts";
import { motion } from "framer-motion";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { useState } from "react";

const categoryColors: Record<string, string> = {
  groceries: "hsl(152, 30%, 50%)",
  transportation: "hsl(45, 30%, 50%)",
  "eating out": "hsl(200, 30%, 50%)",
  subscriptions: "hsl(30, 30%, 50%)",
  food: "hsl(152, 30%, 50%)",
  bills: "hsl(45, 30%, 50%)",
  travel: "hsl(200, 30%, 50%)",
  others: "hsl(30, 30%, 50%)",
  shopping: "hsl(280, 30%, 50%)",
};

const chartConfig = {
  expenses: {
    label: "Expenses",
  },
} satisfies ChartConfig;

interface SpendingViewProps {
  chartData: Array<{ category: string; value: number }>;
  totalAmount: number;
  currency: string;
  activeTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export function SpendingView({
  chartData,
  totalAmount,
  currency,
  activeTimeframe,
  onTimeframeChange,
}: SpendingViewProps) {
  return (
    <div className="surface-card rounded-3xl p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground mb-2">Your Spending</h1>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-foreground">
            {currency}{totalAmount.toFixed(2)}
          </p>
          <span className="text-sm text-muted-foreground">Last 6o Sood</span>
        </div>
      </motion.div>

      {/* Donut Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        {chartData && chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                dataKey="value"
                nameKey="category"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={0}
                isAnimationActive={true}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={categoryColors[entry.category.toLowerCase()] || "hsl(var(--muted))"}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {currency}{totalAmount.toFixed(2)}
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            No expenses to display
          </div>
        )}
      </motion.div>

      {/* Category List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-3 mb-6"
      >
        {chartData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: categoryColors[item.category.toLowerCase()] || "hsl(var(--muted))",
                }}
              />
              <span className="text-foreground capitalize">{item.category}</span>
            </div>
            <span className="text-foreground font-medium">
              {currency}{item.value.toFixed(0)}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeframe Tabs */}
      <div className="flex gap-2 justify-center">
        {["week", "month", "year"].map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => onTimeframeChange(timeframe)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTimeframe === timeframe
                ? "bg-accent/20 text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
