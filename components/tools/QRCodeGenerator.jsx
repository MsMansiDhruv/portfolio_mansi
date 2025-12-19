"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "framer-motion";

const isValidUpiString = (value) =>
  value.startsWith("upi://pay?") && value.includes("pa=");

export default function QRCodeGenerator({
  value = "",
  autoGenerate = false,
  logoUrl,
  size = 200,
}) {
  const [qrPng, setQrPng] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (autoGenerate && value) {
      generateQR(value);
    }
  }, [value]);

  const generateQR = async (input) => {
    setError("");
    setQrPng("");

    if (!input.trim()) {
      setError("Empty QR value");
      return;
    }

    if (
      input.startsWith("upi://") &&
      !isValidUpiString(input)
    ) {
      setError("Invalid UPI payment string");
      return;
    }

    try {
      const png = await QRCode.toDataURL(input, {
        width: size,
        margin: 1,
      });

      setQrPng(png);
    } catch {
      setError("Failed to generate QR");
    }
  };

  return (
    
    <div className="flex flex-col items-center">
      <AnimatePresence>
        {qrPng && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-lg p-3"
          >
            <img
              src={qrPng}
              alt="QR Code"
              style={{ width: size, height: size }}
            />

            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded"
                style={{
                  width: size * 0.22,
                  height: size * 0.22,
                  padding: size * 0.04,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
