import React from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";

interface CustomSplitProps {
  totalAmount: number;
  groupMembers: Array<{ _id: string; user?: { name?: string } }>;
  customSplitData?: Record<string, number>;
}

const CustomSplit: React.FC<CustomSplitProps> = ({ totalAmount, groupMembers, customSplitData }) => {
  if (groupMembers.length === 0) {
    return (
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold mb-4">Custom Split</h3>
        <p>No members found for this group.</p>
      </Card>
    );
  }

  const safeData = customSplitData || {};
  const rawAmounts = groupMembers.map((member) => Math.max(0, safeData[member._id] || 0));
  const rawTotal = rawAmounts.reduce((sum, amount) => sum + amount, 0);

  let normalizedAmounts = rawAmounts;

  if (rawTotal <= 0) {
    const equal = totalAmount / groupMembers.length;
    normalizedAmounts = groupMembers.map(() => equal);
  } else {
    normalizedAmounts = rawAmounts.map((amount) => (amount / rawTotal) * totalAmount);
  }

  const totalCents = Math.round(totalAmount * 100);
  const memberCents = normalizedAmounts.map((amount) => Math.floor(amount * 100));
  let centsAssigned = memberCents.reduce((sum, cents) => sum + cents, 0);
  let remainder = totalCents - centsAssigned;

  for (let i = 0; i < memberCents.length && remainder > 0; i += 1) {
    memberCents[i] += 1;
    remainder -= 1;
    centsAssigned += 1;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <Card variant="glass" className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          Custom Split
          <motion.span
            className="ml-2 text-primary"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.span>
        </h3>

        {/* Total amount with gradient background */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <motion.p
            className="text-2xl font-bold text-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            £{totalAmount.toFixed(2)}
          </motion.p>
        </div>

        {/* Member cards with stagger animation */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {groupMembers.map((member, index) => {
            const customAmount = (memberCents[index] / 100).toFixed(2);
            const percentage = ((memberCents[index] / totalCents) * 100).toFixed(1);

            return (
              <motion.div
                key={member._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/5 dark:bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    {/* Avatar with gradient */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-lg">
                      {member.user?.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="font-medium">{member.user?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{percentage}% of total</p>
                    </div>
                  </div>
                  <motion.p
                    className="text-lg font-bold text-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      delay: index * 0.1 + 0.3,
                    }}
                  >
                    £{customAmount}
                  </motion.p>
                </div>

                {/* Progress bar with gradient fill */}
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1 + 0.4,
                      ease: "easeOut",
                    }}
                  ></motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </Card>
  );
};

export default CustomSplit;
