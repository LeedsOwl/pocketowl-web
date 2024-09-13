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
import { subDays, subMonths, subYears, format, startOfMonth, isSameDay, isSameMonth, isSameYear } from "date-fns";
import { motion } from "framer-motion";
import { TimeframeTabs } from "@/components/ui/timeframe-tabs";

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
  return Array.from({ length: 7 }, (_, i) =>
    subDays(lastWeekStart, i)
  ).reverse();
};

const getLast12Months = () => {
  return Array.from({ length: 12 }, (_, i) => subMonths(new Date(), i)).reverse();
};

const getLast5Years = () => {
  return Array.from({ length: 5 }, (_, i) => subYears(new Date(), i)).reverse();
};

function Home() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const userTransactions =
    useQuery(api.transactions.getUserTransactions, {}) || [];

  const [activeTimeframe, setActiveTimeframe] = useState("week");

  const getTimeframeData = () => {
    switch (activeTimeframe) {
      case "week":
        return getLast7Days().map((date) => ({
          label: format(date, "EEEE"),
          total: userTransactions
            .filter((transaction) =>
              isSameDay(new Date(transaction._creationTime), date)
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      case "month":
        return getLast12Months().map((date) => ({
          label: format(date, "MMM"),
          total: userTransactions
            .filter((transaction) =>
              isSameMonth(new Date(transaction._creationTime), date)
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      case "year":
        return getLast5Years().map((date) => ({
          label: format(date, "yyyy"),
          total: userTransactions
            .filter((transaction) =>
              isSameYear(new Date(transaction._creationTime), date)
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      default:
        return [];
    }
  };

  const timeframeData = getTimeframeData();
  const totalCurrent = timeframeData.reduce((sum, data) => sum + data.total, 0);

  const getPreviousTimeframeData = () => {
    switch (activeTimeframe) {
      case "week":
        return getLast7Days().map((date) => ({
          label: format(subDays(date, 7), "EEEE"),
          total: userTransactions
            .filter((transaction) =>
              isSameDay(new Date(transaction._creationTime), subDays(date, 7))
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      case "month":
        return getLast12Months().map((date) => ({
          label: format(subMonths(date, 1), "MMM"),
          total: userTransactions
            .filter((transaction) =>
              isSameMonth(new Date(transaction._creationTime), subMonths(date, 1))
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      case "year":
        return getLast5Years().map((date) => ({
          label: format(subYears(date, 1), "yyyy"),
          total: userTransactions
            .filter((transaction) =>
              isSameYear(new Date(transaction._creationTime), subYears(date, 1))
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      default:
        return [];
    }
  };

  const previousTimeframeData = getPreviousTimeframeData();
  const totalPrevious = previousTimeframeData.reduce((sum, data) => sum + data.total, 0);

  const isFirstPeriod = totalPrevious === 0;
  const isSpendingUp = totalCurrent > totalPrevious;

  const handleAddExpenseButtonClick = () => {
    setShowAddExpense(!showAddExpense);
  };

  return (
    <div className="pb-24">
      {" "}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background shadow-md"
      >
        {" "}
        <Balance
          accountBalance={1000}
          income={500}
          expenses={200}
          currency="£"
        />{" "}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Chart
          timeframeData={timeframeData}
          totalCurrent={totalCurrent}
          totalPrevious={totalPrevious}
          isFirstPeriod={isFirstPeriod}
          isSpendingUp={isSpendingUp}
          activeTimeframe={activeTimeframe}
        />
        <TimeframeTabs
          activeTimeframe={activeTimeframe}
          onTimeframeChange={setActiveTimeframe}
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
function filterTransactions(transactions: Transaction[], date: Date, startDate: Date) {
  return transactions
    .filter((transaction) =>
      new Date(transaction.dateTime) >= startDate &&
      new Date(transaction.dateTime) < startOfMonth(subMonths(startDate, -1))
    )
    .reduce((sum: number, transaction) => sum + transaction.amount, 0);
}
