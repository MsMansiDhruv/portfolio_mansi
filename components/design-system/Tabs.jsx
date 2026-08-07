"use client";

import { createContext, useContext, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";
import { dsTransition } from "./motion/motion";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value: controlled, onValueChange, children, className }) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const value = controlled !== undefined ? controlled : internal;

  const setValue = (v) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("ds-tabs", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className, "aria-label": ariaLabel = "Tabs" }) {
  return (
    <div className={cn("ds-tabs__list", className)} role="tablist" aria-label={ariaLabel}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className, disabled }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

  const active = ctx.value === value;
  const id = useId();

  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      disabled={disabled}
      className={cn("ds-tabs__trigger ds-focus-ring", active && "ds-tabs__trigger--active", className)}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const ctx = useContext(TabsContext);
  const reduced = useReducedMotion();
  if (!ctx) throw new Error("TabsContent must be used within Tabs");

  const active = ctx.value === value;

  return (
    <AnimatePresence mode="wait">
      {active ? (
        <motion.div
          key={value}
          role="tabpanel"
          className={cn("ds-tabs__panel", className)}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          transition={dsTransition.fast}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
