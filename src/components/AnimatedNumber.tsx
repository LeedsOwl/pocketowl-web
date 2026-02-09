import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedNumber = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedNumberProps) => {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => {
    const formatted = decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString();
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
};
