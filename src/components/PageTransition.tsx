import { motion } from "framer-motion";
import { ReactNode } from "react";

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    filter: "blur(4px)",
  },
  in: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  out: {
    opacity: 0,
    x: 20,
    filter: "blur(4px)",
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};
