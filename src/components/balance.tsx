import React from "react";
import { motion } from "framer-motion";
import { LuArrowDownSquare, LuArrowUpSquare } from "react-icons/lu";

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
        className="home-panel home-panel-net p-6"
      >
        <div className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 text-sm italic tracking-wide text-[#6f866f]">
          <span className="relative inline-flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-[#6f866f]/25" />
            <span className="absolute inset-0 rounded-full border border-transparent border-t-[#6f866f] animate-spin" />
            <img src="/logo.png" alt="PocketOwl" className="h-5 w-5 rounded-sm object-contain" />
          </span>
          <span>PocketOwl.</span>
        </div>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-sm leading-none tracking-tight text-white/72">
              Current Balance
            </p>
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
              className="mt-2 text-3xl font-semibold leading-none text-white"
            >
              {currencyFormat(accountBalance, currency)}
            </motion.p>
          </div>
          <div />
        </div>

        <div className="border-t border-b home-divider py-4">
          <div className="flex items-center justify-between py-2">
            <p className="text-xl leading-none text-white/80">Income</p>
            <p className="text-xl leading-none text-white/95">
              {currencyFormat(income, currency)}
            </p>
          </div>
          <div className="my-2 border-t home-divider" />
          <div className="flex items-center justify-between py-2">
            <p className="text-xl leading-none text-white/80">Expenses</p>
            <p className="text-xl leading-none text-[#6f866f]">
              -{currencyFormat(expenses, currency)}
            </p>
          </div>
        </div>

        <div className="sr-only">
          <LuArrowDownSquare />
          <LuArrowUpSquare />
        </div>
      </motion.div>
    </div>
  );
};

export default Balance;
