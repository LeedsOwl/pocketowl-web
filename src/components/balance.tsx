import React from "react";
import { motion } from "framer-motion";
import { LuArrowDownSquare, LuArrowUpSquare, LuSparkles } from "react-icons/lu";

interface BalanceProps {
  accountBalance: number;
  income: number;
  expenses: number;
  currency: string;
}

const currencyFormat = (value: number, currency: string) =>
  `${currency}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Balance: React.FC<BalanceProps> = ({
  accountBalance,
  income,
  expenses,
  currency,
}) => {
  return (
    <div className="px-0">
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="surface-card relative overflow-hidden rounded-2xl p-5"
      >
        <div className="pointer-events-none absolute -top-20 right-[-10%] h-52 w-52 rounded-full bg-[#8cb9dc]/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-[-8%] h-52 w-52 rounded-full bg-[#7dade2]/16 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Net Position
              </p>
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
                className="mt-2 text-3xl font-bold leading-none text-slate-900 dark:text-slate-100 sm:text-4xl"
              >
                {currencyFormat(accountBalance, currency)}
              </motion.p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#7dade2]/40 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 dark:border-[#8cb9dc]/35 dark:bg-slate-900/50 dark:text-slate-200">
              <LuSparkles className="h-4 w-4 text-[#7dade2] dark:text-[#8cb9dc]" />
              <span>PocketOwl</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              whileHover={{ y: -2 }}
              className="metric-card metric-income"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/75 p-2 text-[#0ea5e9] shadow dark:bg-slate-900/70 dark:text-[#7dd3fc]">
                  <LuArrowDownSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    Income
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormat(income, currency)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ y: -2 }}
              className="metric-card metric-expense"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/75 p-2 text-[#8b5cf6] shadow dark:bg-slate-900/70 dark:text-[#c4b5fd]">
                  <LuArrowUpSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    Expenses
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormat(expenses, currency)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Balance;
