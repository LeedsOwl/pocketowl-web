import React from "react";

interface TransactionProps {
  status: string;
  description: string;
  date: Date;
  amount: number;
}

const Transaction = (props: TransactionProps) => {
  const transactionStatusList: {
    [key: string]: { color: string; text: string };
  } = {
    completed: {
      color: "bg-green-600",
      text: "Completed",
    },
    pending: {
      color: "bg-blue-500",
      text: "Pending",
    },
    failed: {
      color: "bg-red-600",
      text: "Failed",
    },
  };

  return (
    <div className="px-3 py-2">
      <div className="mt-1 space-y-4">
        {/* Transaction */}
        <div className="rounded-lg bg-card border border-gray-500 shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">{props.description}</p>
              <p className="text-sm text-gray-400">
                {props.date.toDateString()}{" "}
              </p>
              <p className="text-sm text-gray-300">
                {props.date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">£{props.amount}</p>
              <div
                className={`mt-1 rounded-full py-1 px-3 text-xs font-medium text-white ${transactionStatusList[props.status].color}`}
              >
                {transactionStatusList[props.status].text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
