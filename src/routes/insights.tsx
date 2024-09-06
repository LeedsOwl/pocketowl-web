import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Donut } from "@/components/pie-chart";
import { FaUtensils, FaMoneyBill, FaPlane, FaShoppingCart, FaEllipsisH } from "react-icons/fa"; 
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const categoryColors = {
  Food: "#6C465D",
  Bills: "#A95166",
  Travel: "#EB6D3A",
  Others: "#E1A639",
  Shopping: "#386590",
};

const categoryIcons = {
  Food: <FaUtensils />,
  Bills: <FaMoneyBill />,
  Travel: <FaPlane />,
  Others: <FaEllipsisH />,
  Shopping: <FaShoppingCart />,
};

interface Categories {
  totalAmount: number;
  categoryTotals: { [key: string]: number };
}

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
  const transactions: Categories = useQuery(api.insights.getInsights, { period: "month" }) || { totalAmount: 0, categoryTotals: {} };
  
  const [startAnimation, setStartAnimation] = useState(false); // Control animation start
  const categoryTotals = transactions?.categoryTotals;

  const chartData = Object.keys(categoryTotals).map(category => ({
    category,
    value: categoryTotals[category],
    color: categoryColors[category as keyof typeof categoryColors],
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-1 overflow-y-auto max-h-screen">
      <div
        className="text-white p-14 bg-background rounded-lg shadow-md"
        style={{
          backgroundImage: "url('/stacked-waves.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="items-center text-center">
          <p className="text-2xl font-semibold">Category Summary</p>
          <p className="text-lg font-bold text-gray-400">
            January - September 2024
          </p>
        </div>
      </div>

      <div className="p-2 pb-24 pt-4">
        <Donut chartData={chartData} totalAmount={transactions.totalAmount} categoryTotals={categoryTotals} />

        {startAnimation && categories.map((category, index) => {
          const categoryTotal = transactions.categoryTotals[category.value] || 0;

          return (
            <motion.div
              key={index}
              className="rounded-lg border border-gray-500 shadow p-4 mt-4 flex items-center"
              style={{
                backgroundColor: categoryColors[category.friendly_name as keyof typeof categoryColors] || "#333",
              }}
              initial="hidden"
              animate="visible"
              custom={index}
              variants={containerVariants}
            >
              <div className="mr-4 text-2xl">
                {categoryIcons[category.friendly_name as keyof typeof categoryIcons] || <FaEllipsisH />}
              </div>
              <div className="flex justify-between w-full">
                <div>
                  <p className="text-sm font-bold">{category.friendly_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-md font-bold">£{categoryTotal}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Insights;
