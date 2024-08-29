import React from "react";

interface TransactionProps {
  status: string;
  description: string;
  date: Date;
  amount: number;
}

const Transaction = (props: TransactionProps) => {
  const transactionStatusList: { [key: string]: { color: string; text: string; } } = {
    completed: {
      color: "success",
      text: "Completed",
    },
    pending: {
      color: "primary",
      text: "Pending",
    },
    failed: {
      color: "destructive",
      text: "Failed",
    },
  };

  return (
    <div className="w-screen px-3 py-2">
      <div className="mt-1 space-y-4">
        {/* Transaction */}
        <div className="rounded-lg bg-card border border-gray-500 shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">{props.description}</p>
              <p className="text-sm text-gray-400">{props.date.toDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">£{props.amount}</p>
              <div
                className={`mt-1 rounded-full bg-${transactionStatusList[props.status].color} py-1 px-3 text-xs font-medium text-white`}
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
