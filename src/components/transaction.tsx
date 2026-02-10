import { motion } from "framer-motion";
import {
  LuArrowDownSquare,
  LuCoffee,
  LuShoppingBag,
  LuTrain,
  LuPhone,
  LuUtensils,
  LuHome,
  LuMoreHorizontal
} from "react-icons/lu";

interface TransactionProps {
  id: string;
  status: string;
  description: string;
  date: Date;
  amount: number;
  category?: string;
  onEdit: (id: string, updatedData: { description: string; amount: number }) => void;
  onDelete: (id: string) => void;
}

const Transaction = (props: TransactionProps) => {
  const normalizedCategory = props.category?.toLowerCase().replace(/\s+/g, "_");

  // Map descriptions to icons
  const getIcon = () => {
    if (normalizedCategory) {
      const categoryMap: Record<string, JSX.Element> = {
        food: <LuUtensils className="w-5 h-5" />,
        groceries: <LuShoppingBag className="w-5 h-5" />,
        dining: <LuCoffee className="w-5 h-5" />,
        shopping: <LuShoppingBag className="w-5 h-5" />,
        travel: <LuTrain className="w-5 h-5" />,
        transportation: <LuTrain className="w-5 h-5" />,
        fuel: <LuTrain className="w-5 h-5" />,
        bills: <LuPhone className="w-5 h-5" />,
        rent: <LuHome className="w-5 h-5" />,
        utilities: <LuHome className="w-5 h-5" />,
        internet: <LuPhone className="w-5 h-5" />,
        insurance: <LuHome className="w-5 h-5" />,
        healthcare: <LuHome className="w-5 h-5" />,
        education: <LuHome className="w-5 h-5" />,
        entertainment: <LuCoffee className="w-5 h-5" />,
        subscriptions: <LuPhone className="w-5 h-5" />,
        gifts: <LuShoppingBag className="w-5 h-5" />,
        personal_care: <LuShoppingBag className="w-5 h-5" />,
        childcare: <LuHome className="w-5 h-5" />,
        pets: <LuHome className="w-5 h-5" />,
        income: <LuArrowDownSquare className="w-5 h-5" />,
        savings: <LuArrowDownSquare className="w-5 h-5" />,
        taxes: <LuHome className="w-5 h-5" />,
        others: <LuMoreHorizontal className="w-5 h-5" />,
      };

      if (categoryMap[normalizedCategory]) {
        return categoryMap[normalizedCategory];
      }
    }

    const desc = props.description.toLowerCase();
    if (desc.includes("coffee") || desc.includes("breakfast")) return <LuCoffee className="w-5 h-5" />;
    if (desc.includes("groceries") || desc.includes("shopping")) return <LuShoppingBag className="w-5 h-5" />;
    if (desc.includes("train") || desc.includes("transport") || desc.includes("uber")) return <LuTrain className="w-5 h-5" />;
    if (desc.includes("phone") || desc.includes("bill")) return <LuPhone className="w-5 h-5" />;
    if (desc.includes("lunch") || desc.includes("dinner") || desc.includes("food")) return <LuUtensils className="w-5 h-5" />;
    if (desc.includes("utilities") || desc.includes("insurance")) return <LuHome className="w-5 h-5" />;
    return <LuMoreHorizontal className="w-5 h-5" />;
  };

  const formatDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (props.date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (props.date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return days[props.date.getDay()];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 transition-colors"
    >
      {/* Left: Icon and Info */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/5 text-[#b7c7b9]">
          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-white/92">{props.description}</p>
          <p className="text-xs text-white/55">{formatDate()}</p>
        </div>
      </div>

      {/* Right: Amount */}
      <div className="text-right">
        <p className="text-sm font-semibold text-white/92">
          -£{props.amount.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

export default Transaction;
