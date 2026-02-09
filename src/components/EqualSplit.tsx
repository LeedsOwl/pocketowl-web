import React from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";

interface EqualSplitProps {
  totalAmount: number;
  groupMembers: Array<{ _id: string; user?: { name: string } }>;
}

const EqualSplit: React.FC<EqualSplitProps> = ({ totalAmount, groupMembers }) => {
  if (groupMembers.length === 0) {
    return (
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-semibold mb-4">Equal Split</h3>
        <p>No members found for this group.</p>
      </Card>
    );
  }

  const totalCents = Math.round(totalAmount * 100);
  const baseShare = Math.floor(totalCents / groupMembers.length);
  const remainder = totalCents % groupMembers.length;

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
          Equal Split
          <motion.span
            className="ml-2 text-primary"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💰
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

        <p className="text-sm text-muted-foreground mb-4">
          Each member owes an equal share.
        </p>

        {/* Member cards with stagger animation */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {groupMembers.map((member, index) => {
            const memberCents = baseShare + (index < remainder ? 1 : 0);
            const memberAmount = (memberCents / 100).toFixed(2);
            return (
              <motion.div
                key={member._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/5 dark:bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {/* Avatar with gradient */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-lg">
                      {member.user?.name?.[0] || "?"}
                    </div>
                    <p className="font-medium">{member.user?.name || "Unknown"}</p>
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
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </Card>
  );
};

export default EqualSplit;
