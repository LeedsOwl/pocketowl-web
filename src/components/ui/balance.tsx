import React from 'react';
import { LuArrowDownSquare, LuArrowUpSquare } from "react-icons/lu";

interface BalanceProps {
  accountBalance: number;
  income: number;
  expenses: number;
  currency: string; 
}

const Balance: React.FC<BalanceProps> = ({ accountBalance, income, expenses, currency  }) => {
  return (
    <div
      className="text-white p-6 rounded-lg shadow-md"
      style={{
        backgroundImage: "url('/stacked-waves.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center mb-6">
        <p className="text-lg">Account Balance</p>
        <p className="text-4xl font-semibold">{currency}{accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="flex justify-around">
        <div className="bg-gray-700 p-4 rounded-3xl flex items-center w-2/5">
          <div className="bg-gray-500 p-2 rounded-full mr-3">
            <LuArrowDownSquare />
          </div>
          <div>
            <p className="text-sm">Income</p>
            <p className="text-xl font-medium">{currency}{income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="bg-sky-700 p-4 rounded-3xl flex items-center w-2/5">
          <div className="bg-sky-600 p-2 rounded-full mr-3">
            <LuArrowUpSquare />
          </div>
          <div>
            <p className="text-sm">Expenses</p>
            <p className="text-xl font-medium">{currency}{expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
