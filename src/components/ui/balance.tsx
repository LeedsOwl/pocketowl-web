import React from 'react';
import { LuArrowDownSquare, LuArrowUpSquare } from "react-icons/lu";

interface BalanceProps {
  accountBalance: number;
  income: number;
  expenses: number;
}

const Balance: React.FC<BalanceProps> = ({ accountBalance, income, expenses }) => {
  return (
    <div className="bg-gradient-to-t from-gray-600 to-gray-900 text-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <p className="text-lg">Account Balance</p>
        <p className="text-4xl font-semibold">£{accountBalance}</p>
      </div>
      <div className="flex justify-around">
        <div className="bg-gray-700 p-4 rounded-lg flex items-center">
          <div className="bg-gray-500 p-2 rounded-full mr-3">
            <LuArrowDownSquare />
          </div>
          <div>
            <p className="text-sm">Income</p>
            <p className="text-xl font-medium">£{income}</p>
          </div>
        </div>
        <div className="bg-indigo-700 p-4 rounded-lg flex items-center">
          <div className="bg-indigo-500 p-2 rounded-full mr-3">
            <LuArrowUpSquare />
          </div>
          <div>
            <p className="text-sm">Expenses</p>
            <p className="text-xl font-medium">£{expenses}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
