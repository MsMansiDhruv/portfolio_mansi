"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { CHARACTER, PORTRAIT } from "@/lib/data/story";

const STAGE_STYLES = {
  curiosity: {
    filter: "brightness(0.45) contrast(1.1) saturate(0.6)",
    scale: 0.92,
    opacity: 0.55,
  },
  learning: {
    filter: "brightness(0.65) contrast(1.05) saturate(0.75)",
    scale: 0.96,
    opacity: 0.72,
  },
  building: {
    filter: "brightness(0.85) contrast(1.05) saturate(0.85)",
    scale: 1,
    opacity: 0.88,
  },
  leading: {
    filter: "brightness(0.95) contrast(1.08) saturate(0.9)",
    scale: 1.02,
    opacity: 0.95,
  },
  present: {
    filter: "brightness(1) contrast(1.05) saturate(0.95)",
    scale: 1,
    opacity: 1,
  },
};

export default function StoryCharacter({
  stage = "present",
  variant = "portrait",
  className,
  priority = false,
  preferCharacter = true,
}) {
  const reduced = useReducedMotion();
  const [src, setSrc] = useState(preferCharacter ? CHARACTER.src : PORTRAIT.src);
  const [failed, setFailed] = useState(false);
  const style = STAGE_STYLES[stage] ?? STAGE_STYLES.present;
  const silhouette = variant === "silhouette";
  const alt = src === CHARACTER.src ? CHARACTER.alt : PORTRAIT.alt;

  function handleError() {
    if (src !== PORTRAIT.src) {
      setSrc(PORTRAIT.src);
      return;
    }
    setFailed(true);
  }

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative h-full w-full transition-all duration-[1.4s] story-ease"
        style={{
          transform: `scale(${style.scale})`,
          opacity: style.opacity,
        }}
      >
        {!failed ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={cn(
              "object-cover object-[center_12%] transition-all duration-[1.4s] story-ease",
              silhouette && "brightness-[0.35] contrast-[1.2] saturate-0"
            )}
            style={{ filter: silhouette ? undefined : style.filter }}
            sizes="(max-width: 768px) 280px, 400px"
            onError={handleError}
          />
        ) : (
          <div className="flex h-full items-end bg-[var(--story-charcoal)] p-6">
            <p className="story-editorial text-2xl italic text-[var(--story-grey)]">Portrait</p>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-[1.4s]"
          style={{
            background:
              stage === "curiosity"
                ? "linear-gradient(to top, var(--story-midnight) 40%, transparent 70%)"
                : stage === "present"
                  ? "linear-gradient(to top, var(--story-midnight) 20%, transparent 55%)"
                  : "linear-gradient(to top, var(--story-midnight) 30%, transparent 65%)",
          }}
        />
      </div>
    </motion.div>
  );
}
