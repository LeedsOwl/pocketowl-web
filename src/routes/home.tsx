"use client";

import Balance from "@/components/balance";
import Transaction from "@/components/transaction";
import Chart from "@/components/bar-chart";
import ScrollButton from "@/components/ui/scroll-button";
import { useState } from "react";
import AddExpense from "@/components/add-expense";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { subDays, format } from "date-fns";
import { motion } from "framer-motion";

interface Transaction {
  _creationTime: number;
  _id: Id<"transactions">;
  amount: number;
  category: string;
  dateTime: string;
  description: string;
  user_id: Id<"users">;
}

const getLast7Days = () => {
  return Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
};

const getPrevious7Days = () => {
  const lastWeekStart = subDays(new Date(), 7);
  return Array.from({ length: 7 }, (_, i) => subDays(lastWeekStart, i)).reverse();
};

function Home() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const userTransactions = useQuery(api.transactions.getUserTransactions, {}) || [];

  const last7Days = getLast7Days();
  const previous7Days = getPrevious7Days();

  const weeklyData = last7Days.map((date) => ({
    day: format(date, "EEEE"),
    total: userTransactions
      .filter(
        (transaction: any) =>
          format(new Date(transaction.dateTime), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      )
      .reduce((sum: number, transaction: any) => sum + transaction.amount, 0),
  }));

  const previousWeekData = previous7Days.map((date) => ({
    day: format(date, "EEEE"),
    total: userTransactions
      .filter(
        (transaction: any) =>
          format(new Date(transaction.dateTime), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      )
      .reduce((sum: number, transaction: any) => sum + transaction.amount, 0),
  }));

  const totalCurrentWeek = weeklyData.reduce((sum, data) => sum + data.total, 0);
  const totalPreviousWeek = previousWeekData.reduce((sum, data) => sum + data.total, 0);
  const isFirstWeek = totalPreviousWeek === 0;
  const isSpendingUp = totalCurrentWeek > totalPreviousWeek;

  const handleAddExpenseButtonClick = () => {
    setShowAddExpense(!showAddExpense);
  };

  return (
    <div className="pb-16">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background shadow-md"
      >
        <Balance accountBalance={1000} income={500} expenses={200} currency="£" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Chart
          weeklyData={weeklyData}
          totalCurrentWeek={totalCurrentWeek}
          totalPreviousWeek={totalPreviousWeek}
          isFirstWeek={isFirstWeek}
          isSpendingUp={isSpendingUp}
        />
      </motion.div>

      <motion.h2
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mt-2 text-xl font-bold p-3"
      >
        Recent Transactions
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {userTransactions.map((transaction: Transaction, index) => (
          <motion.div
            key={transaction._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Transaction
              date={new Date(transaction._creationTime)}
              description={transaction.description}
              amount={transaction.amount}
              status={"completed"}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="fixed bottom-24 right-4 z-100"
      >
        <ScrollButton onClick={handleAddExpenseButtonClick} />
      </motion.div>

      <AddExpense open={showAddExpense} setOpen={setShowAddExpense} />

      <Toaster className="bottom-20" />
    </div>
  );
}

export default Home;
