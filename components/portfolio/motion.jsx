"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export function Reveal({ children, className, delay = 0, viewportAmount = 0.2, revealOn = "inView", as = "div" }) {
  const reduced = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (reduced) {
    if (as === "li") return <li className={className}>{children}</li>;
    return <div className={className}>{children}</div>;
  }

  if (revealOn === "mount") {
    return (
      <Component
        className={className}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: viewportAmount }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  );
}

export function HoverLift({ children, className }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
