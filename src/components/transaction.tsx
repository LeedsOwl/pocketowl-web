import { useState } from "react";
import { useTheme } from "../theme-provider";

interface TransactionProps {
  id: string;
  status: string;
  description: string;
  date: Date;
  amount: number;
  onEdit: (id: string, updatedData: { description: string; amount: number }) => void;
  onDelete: (id: string) => void;
}

const Transaction = (props: TransactionProps) => {
  const transactionStatusList: {
    [key: string]: { color: string; text: string };
  } = {
    completed: {
      color: "bg-green-400 dark:bg-green-600",
      text: "Completed",
    },
    pending: {
      color: "bg-primary",
      text: "Pending",
    },
    failed: {
      color: "bg-red-400 dark:bg-red-600",
      text: "Failed",
    },
  };

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Add state to handle editing mode and store updated values
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState(props.description);
  const [updatedAmount, setUpdatedAmount] = useState(props.amount);

  const handleSaveClick = () => {
    props.onEdit(props.id, { description: updatedDescription, amount: updatedAmount });
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    props.onDelete(props.id);
  };

  return (
    <div className="px-3 py-2">
      <div className="mt-1 space-y-4">
        <div
          className={`rounded-lg border shadow p-4 ${isDarkMode ? "bg-card border-gray-500" : "bg-glossy border-gray-400"}`}
        >
          {isEditing ? (
            <div>
              <input
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                className="input-class"
                placeholder="Update Description"
              />
              <input
                type="number"
                value={updatedAmount}
                onChange={(e) => setUpdatedAmount(Number(e.target.value))}
                className="input-class"
                placeholder="Update Amount"
              />
              <button onClick={handleSaveClick} className="button-class">Save</button>
              <button onClick={() => setIsEditing(false)} className="button-class">Cancel</button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-white"}`}>{props.description}</p>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-white"}`}>
                  {props.date.toDateString()}{" "}
                </p>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-200"}`}>
                  {props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-white"}`}>£{props.amount}</p>
                <div className={`mt-1 rounded-full py-1 px-3 text-xs font-medium text-white ${transactionStatusList[props.status].color}`}>
                  {transactionStatusList[props.status].text}
                </div>
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => setIsEditing(true)} className="button-class">Edit</button>
                  <button onClick={handleDeleteClick} className="button-class">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
