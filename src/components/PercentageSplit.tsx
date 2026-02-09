import React from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";

interface PercentageSplitProps {
  totalAmount: number;
  groupMembers: Array<{ _id: string; user?: { name?: string } }>;
  title?: string;
  subtitle?: string;
  splitPercentages:
    | Array<{ group_member_id: string; percentage: number }>
    | { group_member_id?: string; percentage?: number }
    | undefined;
}

const PercentageSplit: React.FC<PercentageSplitProps> = ({
  totalAmount,
  groupMembers,
  splitPercentages = [],
  title = "Percentage Split",
  subtitle,
}) => {
  if (groupMembers.length === 0) {
    return (
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold mb-4">Percentage Split</h3>
        <p>No members found for this group.</p>
      </Card>
    );
  }

  const percentageByMemberId: Record<string, number> = {};

  if (Array.isArray(splitPercentages)) {
    splitPercentages.forEach((split) => {
      if (split?.group_member_id && typeof split.percentage === "number") {
        percentageByMemberId[split.group_member_id] = split.percentage;
      }
    });
  } else if (
    splitPercentages &&
    typeof splitPercentages === "object" &&
    splitPercentages.group_member_id &&
    typeof splitPercentages.percentage === "number"
  ) {
    percentageByMemberId[splitPercentages.group_member_id] = splitPercentages.percentage;
  }

  const members = groupMembers.map((member) => {
    const raw = percentageByMemberId[member._id];
    const bounded = typeof raw === "number" ? Math.max(0, Math.min(raw, 100)) : 0;
    return {
      ...member,
      percentage: bounded,
    };
  });

  const specifiedCount = members.filter((m) => m.percentage > 0).length;
  const specifiedSum = members.reduce((sum, member) => sum + member.percentage, 0);

  let normalizedMembers = members;

  if (specifiedCount === 0) {
    const equal = 100 / members.length;
    normalizedMembers = members.map((member) => ({
      ...member,
      percentage: equal,
    }));
  } else if (specifiedCount === 1 && specifiedSum < 100 && members.length > 1) {
    const remaining = 100 - specifiedSum;
    const recipients = members.length - 1;
    normalizedMembers = members.map((member) => ({
      ...member,
      percentage:
        member.percentage > 0 ? member.percentage : remaining / recipients,
    }));
  } else if (specifiedSum > 0 && Math.abs(specifiedSum - 100) > 0.0001) {
    normalizedMembers = members.map((member) => ({
      ...member,
      percentage: (member.percentage / specifiedSum) * 100,
    }));
  }

  const totalCents = Math.round(totalAmount * 100);
  const memberCents = normalizedMembers.map((member) =>
    Math.floor((totalCents * member.percentage) / 100)
  );
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
        <h3 className="text-xl font-semibold mb-2 flex items-center">
          {title}
          <motion.span
            className="ml-2 text-primary"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📊
          </motion.span>
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
        )}

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

        {/* Member cards with stagger animation and progress bars */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {normalizedMembers.map((member, index) => {
            const memberAmount = (memberCents[index] / 100).toFixed(2);

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
                      <p className="font-medium">
                        {member.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.percentage.toFixed(2)}%
                      </p>
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
                    £{memberAmount}
                  </motion.p>
                </div>

                {/* Progress bar with gradient fill */}
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${member.percentage}%` }}
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

export default PercentageSplit;
