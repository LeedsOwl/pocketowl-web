import React from "react";

interface EqualSplitProps {
  totalAmount: number;
  groupMembers: Array<{ _id: string; user?: { name: string } }>;
}

const EqualSplit: React.FC<EqualSplitProps> = ({ totalAmount, groupMembers }) => {
  const equalSplitAmount = (totalAmount / groupMembers.length).toFixed(2);

  return (
    <div className="p-4 bg-background shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Equal Split</h3>
      <p className="text-lg font-bold">Total: £{totalAmount.toFixed(2)}</p>
      <p>Each member owes: £{equalSplitAmount}</p>

      <div className="mt-4">
        {groupMembers.map((member) => (
          <div key={member._id} className="flex justify-between">
            <p>{member.user?.name || "Unknown"}:</p>
            <p>£{equalSplitAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EqualSplit;
