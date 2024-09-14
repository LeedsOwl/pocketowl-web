import { useTheme } from "../theme-provider";

interface GroupTransactionProps {
  groupId: string;
  description: string;
  date: Date;
  amount: number;
}

const GroupTransaction = (props: GroupTransactionProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="px-3 py-2">
      <div className="mt-1 space-y-4">
        {/* Group Transaction */}
        <div
          className={`rounded-lg border shadow p-4 ${isDarkMode ? "bg-card border-gray-500" : "bg-glossy border-gray-400"
            }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-white"}`}>
                {props.description}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-200"}`}>
                {props.date.toDateString()}{" "}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-200"}`}>
                {props.date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-white"}`}>
                £{props.amount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupTransaction;
