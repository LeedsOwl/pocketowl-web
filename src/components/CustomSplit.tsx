import React from "react";

interface CustomSplitProps {
  totalAmount: number;
  groupMembers: Array<{ _id: string; user?: { name: string } }>;
  customSplitData: Record<string, number>;
}

const CustomSplit: React.FC<CustomSplitProps> = ({ totalAmount, groupMembers, customSplitData }) => {
  return (
    <div className="p-4 bg-background shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Custom Split</h3>
      <p className="text-lg font-bold">Total: £{totalAmount.toFixed(2)}</p>

      <div className="mt-4">
        {groupMembers.map((member) => {
          const customAmount = customSplitData[member._id] || 0;
          return (
            <div key={member._id} className="flex justify-between">
              <p>{member.user?.name || "Unknown"}:</p>
              <p>£{customAmount.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomSplit;
