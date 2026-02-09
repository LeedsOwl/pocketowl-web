import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { motion } from "framer-motion";

type GroupButtonProps = {
  onClick: () => void;
};

const GroupButton = ({ onClick }: GroupButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        size="lg"
        className="relative overflow-hidden px-6 py-3 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white font-semibold shadow-lg hover:shadow-[0_0_35px_rgba(125,173,226,0.32),0_0_60px_rgba(140,185,220,0.22)] dark:hover:shadow-[0_0_35px_rgba(125,173,226,0.38),0_0_60px_rgba(140,185,220,0.28)] transition-all duration-300 border-0 group"
        onClick={onClick}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <PlusIcon className="h-5 w-5 drop-shadow-lg" />
            <div className="absolute inset-0 blur-md bg-white/40 rounded-full"></div>
          </motion.div>

          <span className="text-white drop-shadow-md">
            Create Group
          </span>
        </div>

        {/* Glow ring animation */}
        <div className="absolute inset-0 rounded-full animate-glow-pulse opacity-0 group-hover:opacity-100 bg-primary/30 blur-xl"></div>
      </Button>
    </motion.div>
  );
};

export default GroupButton;
