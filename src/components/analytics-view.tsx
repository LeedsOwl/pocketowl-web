import { useState } from "react";
import { motion } from "framer-motion";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { LuMoreVertical } from "react-icons/lu";
import { getCategoryColor, getCategoryLabel } from "@/lib/category-meta";

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

interface AnalyticsViewProps {
  categoryTotals: Record<string, number>;
  totalAmount: number;
  currency: string;
}

export function AnalyticsView({ categoryTotals, totalAmount, currency }: AnalyticsViewProps) {
  const [activeMonth, setActiveMonth] = useState<"this" | "last">("this");

  const lineChartData: Array<{ date: string; amount: number }> = [];

  // Get top 3 categories
  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const maxCategoryValue = Math.max(...topCategories.map(([, value]) => value));

  return (
    <div className="surface-card rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <button className="text-foreground hover:text-accent transition-colors">
          <LuMoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Month Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveMonth("this")}
          className={`text-sm font-medium transition-colors ${
            activeMonth === "this"
              ? "text-foreground border-b-2 border-accent pb-1"
              : "text-muted-foreground"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setActiveMonth("last")}
          className={`text-sm font-medium transition-colors ${
            activeMonth === "last"
              ? "text-foreground border-b-2 border-accent pb-1"
              : "text-muted-foreground"
          }`}
        >
          Last Month
        </button>
      </div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        {lineChartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="grid h-[200px] place-items-center rounded-xl border border-white/10 bg-black/10 text-sm text-muted-foreground">
            No trend data available yet.
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">Total this month</p>
          <p className="text-lg font-bold text-foreground">
            {currency}{totalAmount.toFixed(0)}
          </p>
        </div>
      </motion.div>

      {/* Category Progress Bars */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {topCategories.map(([category, value], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: getCategoryColor(category) }}
                />
                <span className="text-sm text-foreground">{getCategoryLabel(category)}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {currency}{value.toFixed(0)}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value / maxCategoryValue) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 + 0.1 * index }}
                className="h-full rounded-full"
                style={{ backgroundColor: getCategoryColor(category) }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Note */}
      <p className="text-xs text-muted-foreground mt-6 text-center">
        Track your top spending categories this month and adjust early to stay on budget.
      </p>
    </div>
  );
}
