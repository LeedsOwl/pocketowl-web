import React from "react";
import { LuArrowDownSquare, LuArrowUpSquare } from "react-icons/lu";
import { useTheme } from "../theme-provider";

interface BalanceProps {
  accountBalance: number;
  income: number;
  expenses: number;
  currency: string;
}

const Balance: React.FC<BalanceProps> = ({
  accountBalance,
  income,
  expenses,
  currency,
}) => {
  const { theme } = useTheme(); // Get current theme

  const backgroundImage = theme === "dark" ? "/stacked-waves.svg" : "/register.svg"; // Conditionally choose the background image

  return (
    <div className="p-1">
      <div
        className="text-white p-6 px-2 rounded-lg shadow-md"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center mb-6">
          <p className="text-lg font-semibold">Account Balance</p>
          <p className="text-3xl font-bold">
            {currency}
            {accountBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-around">
          <div className="bg-slate-900 dark:bg-background border border-gray-400 p-4 rounded-3xl flex items-center lg:w-1/6 sm:w-2/5">
            <div className="bg-slate-900 dark:bg-background border border-gray-200 p-2 rounded-full mr-3">
              <LuArrowDownSquare />
            </div>
            <div>
              <p className="text-sm">Income</p>
              <p className="text-xl font-medium">
                {currency}
                {income.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <div className="bg-primary border border-gray-400 p-4 rounded-3xl flex items-center lg:w-1/6 sm:w-2/5">
            <div className="bg-[#6597b7] border border-gray-200 p-2 rounded-full mr-3">
              <LuArrowUpSquare />
            </div>
            <div>
              <p className="text-sm">Expenses</p>
              <p className="text-xl font-medium">
                {currency}
                {expenses.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
