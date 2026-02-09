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
import { useMutation } from "convex/react";
import {
  subDays,
  subMonths,
  subYears,
  format,
  isSameDay,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { motion } from "framer-motion";
import { TimeframeTabs } from "@/components/ui/timeframe-tabs";
import { PageTransition } from "@/components/PageTransition";

interface Transaction {
  _creationTime: number;
  _id: Id<"transactions">;
  amount: number;
  category: string;
  dateTime: string;
  description: string;
  user_id: Id<"users">;
}

const getThisWeek = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
};

const getLastWeek = () => {
  const endOfLastWeek = subDays(new Date(), 7);
  return Array.from({ length: 7 }, (_, i) => subDays(endOfLastWeek, 6 - i));
};

const getLast6Months = () => {
  return Array.from({ length: 6 }, (_, i) => subMonths(new Date(), i)).reverse();
};

const getLast5Years = () => {
  return Array.from({ length: 5 }, (_, i) => subYears(new Date(), i)).reverse();
};

function Home() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const userTransactions = useQuery(api.transactions.getUserTransactions, {}) || [];
  const userFinancialData = useQuery(api.finance.getUserFinancialData, {});
  const GBP = "\u00A3";

  const demoTransactions: Transaction[] = [
    {
      _creationTime: subDays(new Date(), 6).getTime(),
      _id: "demo-1" as Id<"transactions">,
      amount: 24.5,
      category: "Food",
      dateTime: subDays(new Date(), 6).toISOString(),
      description: "Coffee and breakfast",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subDays(new Date(), 5).getTime(),
      _id: "demo-2" as Id<"transactions">,
      amount: 58.2,
      category: "Bills",
      dateTime: subDays(new Date(), 5).toISOString(),
      description: "Phone bill",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subDays(new Date(), 4).getTime(),
      _id: "demo-3" as Id<"transactions">,
      amount: 16.75,
      category: "Food",
      dateTime: subDays(new Date(), 4).toISOString(),
      description: "Lunch",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subDays(new Date(), 3).getTime(),
      _id: "demo-4" as Id<"transactions">,
      amount: 34.1,
      category: "Travel",
      dateTime: subDays(new Date(), 3).toISOString(),
      description: "Train tickets",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subDays(new Date(), 2).getTime(),
      _id: "demo-5" as Id<"transactions">,
      amount: 42.3,
      category: "Shopping",
      dateTime: subDays(new Date(), 2).toISOString(),
      description: "Groceries",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subDays(new Date(), 1).getTime(),
      _id: "demo-6" as Id<"transactions">,
      amount: 19.99,
      category: "Others",
      dateTime: subDays(new Date(), 1).toISOString(),
      description: "Streaming subscription",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subDays(new Date(), 14).getTime(),
      _id: "demo-7" as Id<"transactions">,
      amount: 73.4,
      category: "Bills",
      dateTime: subDays(new Date(), 14).toISOString(),
      description: "Utilities",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subMonths(new Date(), 1).getTime(),
      _id: "demo-8" as Id<"transactions">,
      amount: 128.99,
      category: "Shopping",
      dateTime: subMonths(new Date(), 1).toISOString(),
      description: "House supplies",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subMonths(new Date(), 2).getTime(),
      _id: "demo-9" as Id<"transactions">,
      amount: 46.25,
      category: "Food",
      dateTime: subMonths(new Date(), 2).toISOString(),
      description: "Dinner out",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subMonths(new Date(), 3).getTime(),
      _id: "demo-10" as Id<"transactions">,
      amount: 92.7,
      category: "Travel",
      dateTime: subMonths(new Date(), 3).toISOString(),
      description: "Weekend transport",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subMonths(new Date(), 4).getTime(),
      _id: "demo-11" as Id<"transactions">,
      amount: 35.5,
      category: "Others",
      dateTime: subMonths(new Date(), 4).toISOString(),
      description: "Pharmacy",
      user_id: "demo-user" as Id<"users">,
    },
    {
      _creationTime: subYears(new Date(), 1).getTime(),
      _id: "demo-12" as Id<"transactions">,
      amount: 210,
      category: "Bills",
      dateTime: subYears(new Date(), 1).toISOString(),
      description: "Annual insurance",
      user_id: "demo-user" as Id<"users">,
    },
  ];
  const usingDemoData = userTransactions.length === 0;
  const chartTransactions = usingDemoData ? demoTransactions : userTransactions;

  const deleteTransaction = useMutation(api.transactions.deleteTransaction);
  const updateTransaction = useMutation(api.transactions.updateTransaction);

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction({ id }); // Call the mutation
  };

  const handleEditTransaction = (id: string, updatedData: { description: string; amount: number }) => {
    updateTransaction({ id, ...updatedData }); // Call the mutation
  };

  const [activeTimeframe, setActiveTimeframe] = useState("week");

  const getTimeframeData = () => {
    switch (activeTimeframe) {
      case "week":
        return getThisWeek().map((date) => ({
          label: format(date, "EEEE"),
          total: chartTransactions
            .filter((transaction) =>
              isSameDay(new Date(transaction._creationTime), date)
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      case "month":
        return getLast6Months().map((date) => ({
          label: format(date, "MMM"),
          total: chartTransactions
            .filter((transaction) =>
              isSameMonth(new Date(transaction._creationTime), date)
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      case "year":
        return getLast5Years().map((date) => ({
          label: format(date, "yyyy"),
          total: chartTransactions
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
        return getLastWeek().map((date) => ({
          label: format(date, "EEEE"),
          total: chartTransactions
            .filter((transaction) =>
              isSameDay(new Date(transaction._creationTime), date)
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      case "month":
        return getLast6Months().map((date) => ({
          label: format(subMonths(date, 1), "MMM"),
          total: chartTransactions
            .filter((transaction) =>
              isSameMonth(new Date(transaction._creationTime), subMonths(date, 1))
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0),
        }));
      case "year":
        return getLast5Years().map((date) => ({
          label: format(subYears(date, 1), "yyyy"),
          total: chartTransactions
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

  // Fetch financial data for Balance component
  const accountBalance = userFinancialData?.account_balance || 0;
  const income = userFinancialData?.income || 0;

  // Calculate total expenses
  const totalExpenses = chartTransactions
    .filter((transaction) => transaction.category !== "Income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const displayExpenses = Math.abs(totalExpenses);

  return (
    <PageTransition>
      <div className="tab-page">
      <div className="tab-stack">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="z-40"
      >
        <Balance
          accountBalance={accountBalance}
          income={income}
          expenses={displayExpenses}
          currency={"\u00A3"}
        />
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
        className="mt-2 px-0 text-lg font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300"
      >
        Recent Transactions
      </motion.h2>
      {usingDemoData && (
        <p className="px-0 text-xs text-slate-600 dark:text-slate-300">
          Demo data
        </p>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {chartTransactions.map((transaction: Transaction, index) => (
          <motion.div
            key={transaction._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Transaction
              id={transaction._id}
              date={new Date(transaction._creationTime)}
              description={transaction.description}
              amount={transaction.amount}
              status={"completed"}
              onEdit={usingDemoData ? () => {} : handleEditTransaction}
              onDelete={usingDemoData ? () => {} : handleDeleteTransaction}
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
      </div>
    </PageTransition>
  );
}

export default Home;
