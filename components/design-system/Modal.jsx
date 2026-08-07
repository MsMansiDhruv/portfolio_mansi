"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import { dsTransition, dsVariants } from "./motion/motion";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "default",
  className,
  closeOnOverlay = true,
}) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onOpenChange?.(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const sizeClass =
    size === "lg" ? "ds-modal--lg" : size === "xl" ? "ds-modal--xl" : "";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="ds-modal-overlay"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={dsTransition.fast}
          onClick={closeOnOverlay ? () => onOpenChange?.(false) : undefined}
          role="presentation"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            className={cn("ds-modal ds-focus-ring", sizeClass, className)}
            initial={reduced ? false : dsVariants.scaleIn.hidden}
            animate={dsVariants.scaleIn.show}
            exit={dsVariants.scaleIn.exit}
            transition={reduced ? { duration: 0 } : dsTransition.springSoft}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || description) && (
              <div className="ds-modal__header">
                <div>
                  {title ? (
                    <h2 id={titleId} className="ds-modal__title m-0">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p id={descId} className="ds-modal__description m-0">
                      {description}
                    </p>
                  ) : null}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Close dialog"
                  onClick={() => onOpenChange?.(false)}
                >
                  ✕
                </Button>
              </div>
            )}
            <div className="ds-modal__body">{children}</div>
            {footer ? <div className="ds-modal__footer">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
