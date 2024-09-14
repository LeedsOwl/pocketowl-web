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

  const backgroundImage =
    theme === "dark" ? "/stacked-waves.svg" : "/register.svg"; // Conditionally choose the background image

  return (
    <div className="p-1">
      <div
        className="rounded-xl shadow-lg p-6 text-white bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <p className="text-sm font-semibold italic text-gray-300 tracking-wide">Account Balance</p>
            <p className="text-3xl font-extrabold sm:text-4xl">
              {currency}
              {accountBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="text-right text-2xl text-primary italic">
            <span>Pocket</span><span className="font-extrabold">Owl</span>
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-center justify-between">
          {/* Income Card */}
          <div className="bg-gradient-to-br from-green-400 to-teal-600 p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out w-full sm:w-1/2 lg:w-1/3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-full text-teal-600">
                <LuArrowDownSquare size={24} />
              </div>
              <div>
                <p className="text-sm font-medium">Income</p>
                <p className="text-lg font-bold sm:text-xl">
                  {currency}
                  {income.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-gradient-to-br from-red-400 to-pink-600 p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out w-full sm:w-1/2 lg:w-1/3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-full text-pink-600">
                <LuArrowUpSquare size={24} />
              </div>
              <div>
                <p className="text-sm font-medium">Expenses</p>
                <p className="text-lg font-bold sm:text-xl">
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
    </div>
  );
};

export default Balance;
