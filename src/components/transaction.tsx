import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../theme-provider";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";

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
      color: "bg-cyan-500/85",
      text: "Completed",
    },
    pending: {
      color: "bg-sky-500/85",
      text: "Pending",
    },
    failed: {
      color: "bg-rose-500/85",
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      layout
      className="px-3 py-2"
    >
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        className="mt-1 space-y-4"
      >
        <div className="surface-card rounded-xl border-white/25 p-4 transition-shadow duration-300 hover:shadow-2xl">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border border-sky-300/25 bg-gradient-to-br from-sky-500/10 to-cyan-500/5 p-4"
              >
                <h3 className="mb-4 text-center text-lg font-bold text-white">Edit Transaction</h3>

                {/* Input Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                    className="block w-full p-2 mb-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_0_25px_rgba(125,173,226,0.22),0_0_40px_rgba(140,185,220,0.14)] transition-all duration-300"
                    placeholder="Update Description"
                  />
                  <input
                    type="number"
                    value={updatedAmount}
                    onChange={(e) => setUpdatedAmount(Number(e.target.value))}
                    className="block w-full p-2 mb-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_0_25px_rgba(125,173,226,0.22),0_0_40px_rgba(140,185,220,0.14)] transition-all duration-300"
                    placeholder="Update Amount"
                  />
                </div>

                {/* Save and Cancel Buttons */}
                <div className="flex justify-between mt-4 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveClick}
                    className="p-2 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-lg flex justify-center items-center"
                  >
                    <FaCheck size={14} />
                    <span className="ml-2">Save</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(false)}
                    className="p-2 w-full rounded-lg bg-gradient-to-r from-slate-500 to-slate-700 text-white shadow-lg flex justify-center items-center"
                  >
                    <FaTimes size={14} />
                    <span className="ml-2">Cancel</span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-bold text-white">{props.description}</p>
                  <p className="text-sm text-slate-300">
                    {props.date.toDateString()}
                  </p>
                  <p className="text-sm text-slate-300">
                    {props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">£{props.amount}</p>
                  <div className={`mt-1 rounded-full py-1 px-3 text-xs font-medium text-white ${transactionStatusList[props.status].color}`}>
                    {transactionStatusList[props.status].text}
                  </div>
                  <div className="flex space-x-2 mt-2 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsEditing(true)}
                      className="p-1 rounded-lg bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white shadow-lg"
                    >
                      <FaEdit size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDeleteClick}
                      className="p-1 rounded-lg bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white shadow-lg"
                    >
                      <FaTrashAlt size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Transaction;
