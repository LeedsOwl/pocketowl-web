import { useState } from "react";
import { useTheme } from "../theme-provider";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa"; // Added FaCheck and FaTimes for Save/Cancel buttons

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

  // State to handle editing mode and store updated values
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
            <div className="transition-all duration-300 ease-in-out transform scale-105 shadow-2xl bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              {/* Fancy Edit Drawer */}
              <h3 className="text-lg font-bold text-center text-gray-800 dark:text-gray-200 mb-4">Edit Transaction</h3>

              {/* Input Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input for Description */}
                <input
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  className={`block w-full p-2 mb-2 border rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Update Description"
                />

                {/* Input for Amount */}
                <input
                  type="number"
                  value={updatedAmount}
                  onChange={(e) => setUpdatedAmount(Number(e.target.value))}
                  className={`block w-full p-2 mb-2 border rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Update Amount"
                />
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleSaveClick}
                  className="p-2 w-full mr-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white hover:scale-105 transition-transform duration-300 flex justify-center"
                >
                  <FaCheck size={14} />
                  <span className="ml-2">Save</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 w-full ml-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:scale-105 transition-transform duration-300 flex justify-center"
                >
                  <FaTimes size={14} />
                  <span className="ml-2">Cancel</span>
                </button>
              </div>
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
                {/* Edit and Delete Icons with Gradient Styling */}
                <div className="flex space-x-2 mt-2 justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded-lg bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white hover:scale-105 transition-transform duration-300"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="p-1 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:scale-105 transition-transform duration-300"
                  >
                    <FaTrashAlt size={14} />
                  </button>
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
