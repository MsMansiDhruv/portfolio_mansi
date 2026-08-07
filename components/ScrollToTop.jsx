"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(typeof window !== "undefined" && window.scrollY > 300);
    };
    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={cn(
            "fixed z-40 flex h-11 w-11 items-center justify-center",
            "bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
            "rounded-full border border-teal-700/20 bg-teal-700 text-white shadow-md",
            "transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
            "dark:border-teal-500/30 dark:bg-teal-600 dark:hover:bg-teal-500"
          )}
          aria-label="Scroll to top"
        >
          <ChevronUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
