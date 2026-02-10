import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AnalyticsView } from "@/components/analytics-view";
import { Donut } from "@/components/pie-chart";
import { PageTransition } from "@/components/PageTransition";
import { useState } from "react";
import { motion } from "framer-motion";
import { LuPieChart, LuLineChart } from "react-icons/lu";

const GBP = "\u00A3";

interface Categories {
  totalAmount: number;
  categoryTotals: { [key: string]: number };
}

const Insights = () => {
  const [chartType, setChartType] = useState<"pie" | "analytics">("pie");

  const transactions: Categories = useQuery(api.insights.getInsights, {
    period: "month",
  }) || { totalAmount: 0, categoryTotals: {} };
  const categoryTotals = transactions.categoryTotals;
  const totalAmount = transactions.totalAmount;

  const chartData = Object.entries(categoryTotals).map(([category, value]) => ({
    category,
    value,
  }));

  return (
    <PageTransition>
      <div className="tab-page">
        <div className="tab-stack">
          {/* Chart Type Toggle */}
          <div className="flex gap-2 justify-center mb-4">
            <button
              onClick={() => setChartType("pie")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2 ${
                chartType === "pie"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LuPieChart className="h-4 w-4" />
              Pie Chart
            </button>
            <button
              onClick={() => setChartType("analytics")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2 ${
                chartType === "analytics"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LuLineChart className="h-4 w-4" />
              Analytics
            </button>
          </div>

          {/* Chart Display */}
          <motion.div
            key={chartType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            id="insights-chart"
            className="scroll-mt-24"
          >
            {chartType === "pie" ? (
              <Donut
                chartData={chartData}
                totalAmount={totalAmount}
                categoryTotals={categoryTotals}
              />
            ) : (
              <AnalyticsView
                categoryTotals={categoryTotals}
                totalAmount={totalAmount}
                currency={GBP}
              />
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Insights;
