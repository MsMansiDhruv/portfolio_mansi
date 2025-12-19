"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "framer-motion";
import QRCodeGenerator from "../../../components/tools/QRCodeGenerator";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import GpuSparks from "../../../components/GpuSparks";

/* ---------- helpers ---------- */
const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isValidUpiId = (vpa) => {
  if (!vpa) return false;
  const trimmed = vpa.trim().toLowerCase();
  if (!trimmed.includes("@")) return false;
  const [user, bank] = trimmed.split("@");
  if (!user || !bank) return false;
  if (!/^[a-z0-9._-]{2,50}$/.test(user)) return false;
  if (!/^[a-z]{2,50}$/.test(bank)) return false;
  return true;
};

const buildUpiString = ({ vpa, name, amount, note }) => {
  const params = new URLSearchParams();
  params.set("pa", vpa);
  if (name) params.set("pn", name);
  if (amount) params.set("am", amount);
  params.set("cu", "INR");
  if (note) params.set("tn", note);
  return `upi://pay?${params.toString()}`;
};

export default function QRPage() {
  const fileInputRef = useRef(null);

  const [text, setText] = useState("");
  const [size, setSize] = useState(220);

  /* ---------- Logo ---------- */
  const [logoSource, setLogoSource] = useState("none");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFileUrl, setLogoFileUrl] = useState("");

  /* ---------- UPI ---------- */
  const [upiVpa, setUpiVpa] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [upiNote, setUpiNote] = useState("");
  const [upiError, setUpiError] = useState("");

  /* ---------- Validate UPI ---------- */
  useEffect(() => {
    if (!upiVpa) setUpiError("");
    else if (!isValidUpiId(upiVpa))
      setUpiError("Invalid UPI ID format (example: name@bank)");
    else setUpiError("");
  }, [upiVpa]);

  /* ---------- Logo handlers ---------- */
  const onLogoBrowse = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoFileUrl(url);
    setLogoSource("file");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onLogoUrlChange = (value) => {
    setLogoUrl(value);
    setLogoSource(value ? "url" : "none");
    setLogoFileUrl("");
  };

  const activeLogo =
    logoSource === "file"
      ? logoFileUrl
      : logoSource === "url"
      ? logoUrl
      : undefined;

  /* ---------- Generate UPI QR ---------- */
  const generateUpiQr = () => {
    if (!upiVpa || upiError) return;

    const upi = buildUpiString({
      vpa: upiVpa.trim(),
      name: upiName.trim(),
      amount: upiAmount,
      note: upiNote.trim(),
    });

    setText(upi);
  };

  /* ---------- Downloads ---------- */
  const downloadPng = () => {
    const img = document.querySelector("#qr-preview img");
    if (!img) return;
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "qr-code.png";
    a.click();
  };

  const downloadSvg = async () => {
    if (!text) return;
    const svg = await QRCode.toString(text, {
      type: "svg",
      width: size,
      margin: 1,
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const canGenerate =
    text.trim() && (!text.startsWith("http") || isValidUrl(text));

  /* ---------- Shared classes ---------- */
  const panelClass =
    "p-4 rounded-lg border bg-card-bg border-card-border";

  const labelClass =
    "block text-sm text-text-muted";

  const inputClass =
    "w-full p-2 mt-1 text-sm rounded-md bg-transparent border border-card-border";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <GpuSparks />
      <Breadcrumbs
        labelMap={{
          tools: "Community Tools",
          qr: "QR Code Generator",
        }}
      />
      <h1 className="text-4xl font-bold mb-6" style={{ color: "var(--site-accent)" }}>
        QR Code Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ---------- Controls ---------- */}
        <div className="space-y-4">
          {/* Text */}
          <div className={panelClass}>
            <label className={labelClass}>Text / URL</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={inputClass}
              placeholder="Text, URL, or payment string"
            />
          </div>

          {/* UPI */}
          <div className={panelClass}>
            <div className="text-sm font-medium mb-2">
              UPI Payment
            </div>

            <label className={labelClass}>UPI ID</label>
            <input
              value={upiVpa}
              onChange={(e) => setUpiVpa(e.target.value)}
              placeholder="example@bank"
              className={inputClass}
            />

            {upiError && (
              <p className="text-xs text-red-500 mt-1">{upiError}</p>
            )}

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  value={upiName}
                  onChange={(e) => setUpiName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Amount</label>
                <input
                  value={upiAmount}
                  onChange={(e) => setUpiAmount(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <label className={`${labelClass} mt-3`}>Note</label>
            <input
              value={upiNote}
              onChange={(e) => setUpiNote(e.target.value)}
              className={inputClass}
            />

            <button
              onClick={generateUpiQr}
              disabled={!!upiError}
              className="mt-4 px-3 py-1.5 text-sm rounded-md border border-card-border hover:scale-[1.02] transition disabled:opacity-40"
            >
              Generate UPI QR
            </button>
          </div>

          {/* Logo */}
          <div className={panelClass}>
            <label className={labelClass}>Logo (optional)</label>
            <input
              value={logoUrl}
              onChange={(e) => onLogoUrlChange(e.target.value)}
              placeholder="Logo URL"
              className={inputClass}
            />

            <div className="mt-3 flex items-center gap-3">
              <label
                htmlFor="qr-logo"
                className="px-3 py-1.5 text-sm rounded-md border border-card-border cursor-pointer"
              >
                Browse
              </label>

              {activeLogo && (
                <img
                  src={activeLogo}
                  alt="logo"
                  className="h-8 w-8 object-contain rounded bg-white p-1 border border-card-border"
                />
              )}
            </div>

            <input
              ref={fileInputRef}
              id="qr-logo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onLogoBrowse(e.target.files?.[0])}
            />

            <div className="mt-4">
              <label className={labelClass}>QR Size</label>
              <input
                type="range"
                min={120}
                max={320}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* ---------- Preview ---------- */}
        <div className={`${panelClass} flex items-center justify-center`}>
          <AnimatePresence>
            {canGenerate ? (
              <motion.div
                id="qr-preview"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <QRCodeGenerator
                  value={text}
                  autoGenerate
                  logoUrl={activeLogo}
                  size={size}
                />

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={downloadPng}
                    className="px-3 py-1.5 text-sm rounded-md border border-card-border"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={downloadSvg}
                    className="px-3 py-1.5 text-sm rounded-md border border-card-border"
                  >
                    Download SVG
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-sm opacity-60">
                Enter text or generate UPI QR
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- Disclaimer ---------- */}
      <div className="mt-10 text-xs text-slate-600 dark:text-slate-400 border-t pt-4 leading-relaxed">
        <p className="mb-2 font-medium">Privacy & Security Notice</p>
        <p>
          This tool runs entirely in your browser. We do <strong>not</strong>{" "}
          capture, store, transmit, or log any QR content, UPI IDs, payment
          details, or amounts.
        </p>
        <p className="mt-2">
          All QR codes are generated locally on your device. Please verify
          payment details before sharing or using QR codes for transactions.
        </p>
      </div>
    </div>
  );
}
