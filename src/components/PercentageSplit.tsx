import React from "react";

interface PercentageSplitProps {
  totalAmount: number;
  groupMembers: any[];
  splitPercentages: Array<{ group_member_id: string; percentage: number }> | undefined;
}

const PercentageSplit: React.FC<PercentageSplitProps> = ({ totalAmount, groupMembers, splitPercentages = [] }) => {
  return (
    <div className="p-4 bg-background shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Percentage Split</h3>
      <p className="text-lg font-bold">Total: £{totalAmount.toFixed(2)}</p>

      <div className="mt-4">
        {groupMembers.map((member) => {
          // Safely find the percentage for each member
          const split = splitPercentages?.find((split) => split.group_member_id === member._id);
          const percentage = split?.percentage || 0; // Default to 0 if no percentage found
          const memberAmount = (totalAmount * (percentage / 100)).toFixed(2);

          return (
            <div key={member._id} className="flex justify-between">
              <p>
                {member.user?.name || "Unknown"} ({percentage}%):
              </p>
              <p>£{memberAmount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PercentageSplit;
