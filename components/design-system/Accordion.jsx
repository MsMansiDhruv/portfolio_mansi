"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { dsTransition } from "./motion/motion";

export function Accordion({ children, className }) {
  return <div className={cn("ds-accordion", className)}>{children}</div>;
}

export function AccordionItem({ title, children, defaultOpen = false, className }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();
  const panelId = useId();

  return (
    <div className={cn("ds-accordion__item", className)}>
      <button
        type="button"
        className="ds-accordion__trigger ds-focus-ring"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : dsTransition.fast}
          className="inline-flex text-[var(--ds-text-muted)]"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : dsTransition.normal}
            style={{ overflow: "hidden" }}
          >
            <div className="ds-accordion__content">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
