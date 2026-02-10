"use client";

import Balance from "@/components/balance";
import Transaction from "@/components/transaction";
import Chart from "@/components/bar-chart";
import { useState } from "react";
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
import { LuReceipt } from "react-icons/lu";
import { Donut } from "@/components/pie-chart";
import { AnalyticsView } from "@/components/analytics-view";
import AddExpense from "@/components/add-expense";
import { Link } from "react-router-dom";

interface Transaction {
  _creationTime: number;
  _id: Id<"transactions">;
  amount: number;
  category: string;
  categoryFriendlyName?: string;
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
  const [showDesktopAddExpense, setShowDesktopAddExpense] = useState(false);
  const userTransactions = useQuery(api.transactions.getUserTransactions, {}) || [];
  const userFinancialData = useQuery(api.finance.getUserFinancialData, {});
  const userInfo = useQuery(api.users.getUserInfo, {});
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

  // Fetch financial data for Balance component
  const accountBalance = userFinancialData?.account_balance || 0;
  const income = userFinancialData?.income || 0;

  // Calculate total expenses
  const totalExpenses = chartTransactions
    .filter((transaction) => transaction.category.toLowerCase() !== "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const displayExpenses = Math.abs(totalExpenses);

  const desktopCategoryTotals = chartTransactions
    .filter((transaction) => transaction.category !== "Income")
    .reduce<Record<string, number>>((acc, transaction) => {
      const key = transaction.category.toLowerCase();
      acc[key] = (acc[key] || 0) + transaction.amount;
      return acc;
    }, {});
  const desktopTotalAmount = Object.values(desktopCategoryTotals).reduce(
    (sum, value) => sum + value,
    0
  );
  const desktopChartData = Object.entries(desktopCategoryTotals).map(
    ([category, value]) => ({
      category,
      value,
    })
  );

  return (
    <PageTransition>
      <>
        <div className="tab-page xl:hidden">
          <div className="tab-stack">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="z-40 scroll-mt-24"
              id="balance"
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
              id="spending-chart"
              className="scroll-mt-24"
            >
              <Chart
                timeframeData={timeframeData}
                totalCurrent={totalCurrent}
                totalPrevious={totalPrevious}
                isFirstPeriod={isFirstPeriod}
                isSpendingUp={isSpendingUp}
                activeTimeframe={activeTimeframe}
                timeframeTabs={
                  <TimeframeTabs
                    activeTimeframe={activeTimeframe}
                    onTimeframeChange={setActiveTimeframe}
                  />
                }
              />
            </motion.div>

            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-6 flex scroll-mt-24 items-center gap-2 px-0 text-3xl font-semibold text-white/95"
              id="transactions"
            >
              <LuReceipt className="h-6 w-6 text-[#6f866f]" />
              Recent Transactions
            </motion.h2>
            {usingDemoData && (
              <p className="px-0 text-xs text-white/55">
                Demo data
              </p>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="home-panel home-divide overflow-hidden"
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
                    category={transaction.category}
                    status={"completed"}
                    onEdit={usingDemoData ? () => {} : handleEditTransaction}
                    onDelete={usingDemoData ? () => {} : handleDeleteTransaction}
                  />
                </motion.div>
              ))}
            </motion.div>
            <Toaster className="bottom-20" />
          </div>
        </div>

        <div className="hidden xl:block px-5 pb-8 pt-4">
          <div className="mx-auto max-w-[1520px] space-y-4">
            <div className="surface-card rounded-3xl px-6 py-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-3 text-white/95">
                  <img src="/logo.png" alt="PocketOwl" className="h-7 w-7 rounded-md object-contain" />
                  <p className="text-3xl font-semibold leading-none">PocketOwl</p>
                </div>
                <div className="inline-flex items-center gap-7 text-base text-white/75">
                  <span className="text-white">Home</span>
                  <Link to="/groups" className="transition hover:text-white">Groups</Link>
                  <Link to="/insights" className="transition hover:text-white">Analytics</Link>
                  <Link to="/profile" className="transition hover:text-white">Profile</Link>
                </div>
                <div className="inline-flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white">
                    {userInfo?.name?.charAt(0)?.toUpperCase() || "I"}
                  </div>
                  <p className="text-lg font-semibold text-white/95">{userInfo?.name || "User"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3 space-y-4">
                <Balance
                  accountBalance={accountBalance}
                  income={income}
                  expenses={displayExpenses}
                  currency={"\u00A3"}
                />
              </div>

              <div className="col-span-6">
                <Chart
                  timeframeData={timeframeData}
                  totalCurrent={totalCurrent}
                  totalPrevious={totalPrevious}
                  isFirstPeriod={isFirstPeriod}
                  isSpendingUp={isSpendingUp}
                  activeTimeframe={activeTimeframe}
                  timeframeTabs={
                    <TimeframeTabs
                      activeTimeframe={activeTimeframe}
                      onTimeframeChange={setActiveTimeframe}
                    />
                  }
                />
              </div>

              <div className="col-span-3 space-y-4">
                <Donut
                  chartData={desktopChartData}
                  totalAmount={desktopTotalAmount}
                  categoryTotals={desktopCategoryTotals}
                  compact
                />
              </div>

              <div className="col-span-7 surface-card rounded-3xl p-4">
                <div className="mb-3 flex items-center gap-2 text-3xl font-semibold text-white/95">
                  <LuReceipt className="h-6 w-6 text-[#6f866f]" />
                  Shared Spending
                </div>
                <div className="home-divide overflow-hidden rounded-2xl border border-white/10">
                  {chartTransactions.slice(0, 6).map((transaction: Transaction) => (
                    <Transaction
                      key={transaction._id}
                      id={transaction._id}
                      date={new Date(transaction._creationTime)}
                      description={transaction.description}
                      amount={transaction.amount}
                      category={transaction.category}
                      status={"completed"}
                      onEdit={usingDemoData ? () => {} : handleEditTransaction}
                      onDelete={usingDemoData ? () => {} : handleDeleteTransaction}
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-5">
                <div className="space-y-4">
                  <AnalyticsView
                    categoryTotals={desktopCategoryTotals}
                    totalAmount={desktopTotalAmount}
                    currency={GBP}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDesktopAddExpense(true)}
                    className="w-full rounded-2xl border border-white/15 bg-[#0f1520] px-4 py-3 text-lg font-semibold text-white transition hover:border-[#6f866f]"
                  >
                    Add Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
          <AddExpense open={showDesktopAddExpense} setOpen={setShowDesktopAddExpense} />
          <Toaster />
        </div>
      </>
    </PageTransition>
  );
}

export default Home;
