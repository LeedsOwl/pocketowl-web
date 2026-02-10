import { LuTrash2 } from "react-icons/lu";
import { useTheme } from "../theme-provider";

interface GroupTransactionProps {
  groupId: string;
  transactionId?: string;
  description: string;
  date: Date;
  amount: number;
  initiatedBy?: string;
  canDelete?: boolean;
  onDelete?: (transactionId: string) => void;
}

const GroupTransaction = (props: GroupTransactionProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="px-3 py-2">
      <div className="mt-1 space-y-4">
        <div
          className={`rounded-lg border p-4 shadow ${
            isDarkMode ? "border-gray-500 bg-card" : "border-gray-400 bg-glossy"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">{props.description}</p>
              {props.initiatedBy && (
                <p className="text-xs text-gray-300">by {props.initiatedBy}</p>
              )}
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-200"}`}>
                {props.date.toDateString()}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-200"}`}>
                {props.date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-sm font-bold text-white">GBP {props.amount.toFixed(2)}</p>
              {props.canDelete && props.onDelete && props.transactionId && (
                <button
                  type="button"
                  aria-label="Delete transaction"
                  onClick={() => props.onDelete?.(props.transactionId as string)}
                  className="inline-flex items-center justify-center rounded-md border border-red-400/30 bg-red-500/10 p-1.5 text-red-300 transition hover:bg-red-500/20"
                >
                  <LuTrash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupTransaction;
