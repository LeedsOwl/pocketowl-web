import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Donut } from "@/components/pie-chart";
import {
  FaUtensils,
  FaMoneyBill,
  FaPlane,
  FaShoppingCart,
  FaEllipsisH,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const categoryColors = {
  Food: "#6366F1",
  Bills: "#8B5CF6",
  Travel: "#3B82F6",
  Others: "#A78BFA",
  Shopping: "#0EA5E9",
};

const categoryIcons = {
  Food: <FaUtensils className="text-white"/>,
  Bills: <FaMoneyBill className="text-white"/>,
  Travel: <FaPlane className="text-white"/>,
  Others: <FaEllipsisH className="text-white"/>,
  Shopping: <FaShoppingCart className="text-white"/>,
};
const GBP = "\u00A3";

interface Categories {
  totalAmount: number;
  categoryTotals: { [key: string]: number };
}

const demoCategoryTotals: { [key: string]: number } = {
  food: 86.4,
  bills: 132.75,
  travel: 54.2,
  others: 31.5,
  shopping: 97.35,
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      type: "spring",
      stiffness: 100,
    },
  }),
};

const Insights = () => {
  const categories = useQuery(api.categories.getCategories, {}) || [];
  const transactions: Categories = useQuery(api.insights.getInsights, {
    period: "month",
  }) || { totalAmount: 0, categoryTotals: {} };

  const [startAnimation, setStartAnimation] = useState(false);
  const hasRealInsightsData =
    transactions.totalAmount > 0 ||
    Object.values(transactions.categoryTotals || {}).some((value) => value > 0);

  const categoryTotals = hasRealInsightsData
    ? transactions.categoryTotals
    : demoCategoryTotals;
  const totalAmount = hasRealInsightsData
    ? transactions.totalAmount
    : Object.values(demoCategoryTotals).reduce((sum, value) => sum + value, 0);

  const chartData = Object.keys(categoryTotals).map((category) => ({
    category,
    value: categoryTotals[category],
    color: categoryColors[category as keyof typeof categoryColors],
  }));

  // Sort the categories based on total amount in descending order
  const sortedCategories = [...categories].sort((a, b) => {
    const totalA = categoryTotals[a.value] || 0;
    const totalB = categoryTotals[b.value] || 0;
    return totalB - totalA;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="tab-page">
      <div className="tab-stack">
      <div className="surface-card relative overflow-hidden rounded-2xl p-10 shadow-2xl">
        <div className="pointer-events-none absolute -top-20 left-[-10%] h-52 w-52 rounded-full bg-[#6366f1]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-[-12%] h-56 w-56 rounded-full bg-[#8b5cf6]/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#8b5cf6]/15 dark:from-[#6366f1]/15 dark:to-[#000000]/25" />
        <div className="relative z-10 items-center text-center">
          <p className="text-2xl font-semibold tracking-wide text-slate-900 dark:text-slate-100">Insights</p>
          <p className="text-sm font-medium tracking-[0.12em] uppercase text-slate-600 dark:text-slate-300">
            Category spending breakdown
          </p>
        </div>
      </div>

      <div className="space-y-3 pb-24">
        <Donut
          chartData={chartData}
          totalAmount={totalAmount}
          categoryTotals={categoryTotals}
        />

        {startAnimation &&
          sortedCategories.map((category, index) => {
            const categoryTotal =
              transactions.categoryTotals[category.value] || 0;

            return (
              <motion.div
                key={index}
                className="mt-4 flex items-center rounded-xl p-4 text-white shadow-xl"
                style={{
                  background: `linear-gradient(140deg, ${
                    categoryColors[
                      category.friendly_name as keyof typeof categoryColors
                    ] || "#333"
                  } 0%, ${
                    categoryColors[
                      category.friendly_name as keyof typeof categoryColors
                    ] || "#333"
                  }DD 100%)`,
                  border: "1px solid rgba(255, 255, 255, 0.24)",
                }}
                initial="hidden"
                animate="visible"
                custom={index}
                variants={containerVariants}
              >
                <div className="mr-4 text-2xl">
                  {categoryIcons[
                    category.friendly_name as keyof typeof categoryIcons
                  ] || <FaEllipsisH />}
                </div>
                <div className="flex justify-between w-full text-white">
                  <div>
                    <p className="text-sm font-bold">
                      {category.friendly_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-md font-bold">{GBP}{categoryTotal}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
      </div>
    </div>
  );
};

export default Insights;
