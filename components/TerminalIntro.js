"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TerminalIntro({ text }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono text-primary text-4xl md:text-6xl font-bold"
    >
        {display}
        <span className="animate-pulse text-primary ml-1" style={{ fontSize: "0.8em" }}>
        |
        </span>

    </motion.div>
  );
}
