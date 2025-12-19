"use client";

import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import QRCodeGenerator from "./QRCodeGenerator";
import Breadcrumbs from "../common/Breadcrumbs";

/* ---------------- Main Component ---------------- */

export default function BillGenerator() {
  /* ---------- QR ---------- */
  const [includeQR, setIncludeQR] = useState(false);
  const [qrText, setQrText] = useState("");

  /* ---------- Invoice State ---------- */
  const [companyName, setCompanyName] = useState("My Company Pvt Ltd");
  const [billTo, setBillTo] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`
  );
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([{ id: 1, desc: "Sample item", qty: 1, rate: 100 }]);
  const [taxPercent, setTaxPercent] = useState(18);
  const [discount, setDiscount] = useState(0);

  const [logoFile, setLogoFile] = useState(null);
  const [logoDataUrl, setLogoDataUrl] = useState(null);

  const [summary, setSummary] = useState("");
  const [deliverables, setDeliverables] = useState(["Deliverable 1"]);
  const [terms, setTerms] = useState("Payment due in 15 days. Late fees apply.");
  const [footerText, setFooterText] = useState(
    "GSTIN: XXXXXXXXXXX\nThis is a computer-generated invoice."
  );

  const [isDark, setIsDark] = useState(false);
  const invoiceRef = useRef(null);

  /* ---------- Theme Sync ---------- */
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const mo = new MutationObserver(() =>
      setIsDark(root.classList.contains("dark"))
    );
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  /* ---------- Helpers ---------- */
  const addItem = () =>
    setItems((s) => [...s, { id: Date.now(), desc: "", qty: 1, rate: 0 }]);
  const updateItem = (id, key, value) =>
    setItems((s) => s.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  const removeItem = (id) =>
    setItems((s) => s.filter((it) => it.id !== id));

  const addDeliverable = () =>
    setDeliverables((s) => [...s, `Deliverable ${s.length + 1}`]);
  const updateDeliverable = (i, v) =>
    setDeliverables((s) => s.map((d, idx) => (idx === i ? v : d)));
  const removeDeliverable = (i) =>
    setDeliverables((s) => s.filter((_, idx) => idx !== i));

  const subtotal = items.reduce(
    (s, it) => s + Number(it.qty) * Number(it.rate),
    0
  );
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount - discount;

  const inputClass =
    "w-full p-2 mt-1 text-sm rounded-md bg-transparent border border-gray-200 dark:border-gray-700";
  const labelClass = "block text-sm text-slate-600 dark:text-slate-400";
  const cardClass =
    "p-4 rounded-lg border bg-white dark:bg-[#1e293b80] border-gray-200 dark:border-gray-700";

  /* ---------- Render ---------- */
  return (
    <div className="max-w-6xl mx-auto p-4">
      <Breadcrumbs
        labelMap={{
          tools: "Community Tools",
          bill: "Bill Generator",
        }}
      />

      <h1 className="text-4xl font-bold mb-6" style={{ color: "var(--site-accent)" }}>
        Bill Generator
      </h1>

      {/* ---------------- Layout ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* ---------------- Form ---------------- */}
        <div className="md:col-span-2 space-y-3">
          {/* Company */}
          <div className={cardClass}>
            <label className={labelClass}>Company Name</label>
            <input className={inputClass} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <label className={labelClass}>Bill To</label>
                <input className={inputClass} value={billTo} onChange={(e) => setBillTo(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Invoice #</label>
                <input className={inputClass} value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className={cardClass}>
            <div className="flex justify-between mb-2">
              <h3 className="font-medium text-sm">Items</h3>
              <button onClick={addItem} className="text-sm border px-2 py-1 rounded">
                + Add
              </button>
            </div>

            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-5 gap-2 mb-2">
                <input className={inputClass} value={it.desc} onChange={(e) => updateItem(it.id, "desc", e.target.value)} />
                <input type="number" className={inputClass} value={it.qty} onChange={(e) => updateItem(it.id, "qty", e.target.value)} />
                <input type="number" className={inputClass} value={it.rate} onChange={(e) => updateItem(it.id, "rate", e.target.value)} />
                <div className="text-sm flex items-center">₹ {(it.qty * it.rate).toFixed(2)}</div>
                <button onClick={() => removeItem(it.id)} className="text-sm border rounded">
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary + Deliverables */}
          <div className={cardClass}>
            <label className={labelClass}>Summary</label>
            <textarea className={inputClass} rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />

            <div className="mt-3">
              <label className={labelClass}>Deliverables</label>
              {deliverables.map((d, i) => (
                <div key={i} className="flex gap-2 mt-1">
                  <input className={inputClass} value={d} onChange={(e) => updateDeliverable(i, e.target.value)} />
                  <button onClick={() => removeDeliverable(i)} className="border px-2 rounded">
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addDeliverable} className="mt-2 text-sm border px-2 py-1 rounded">
                + Add deliverable
              </button>
            </div>

            <div className="mt-3">
              <label className={labelClass}>Terms & Conditions</label>
              <textarea className={inputClass} rows={4} value={terms} onChange={(e) => setTerms(e.target.value)} />
            </div>
          </div>
        </div>

        {/* ---------------- Preview + QR ---------------- */}
        <div className="md:col-span-1">
          <div className={cardClass}>
            <div className="text-sm font-medium mb-2">Totals</div>
            <div className="text-sm flex justify-between"><span>Subtotal</span><span>₹ {subtotal.toFixed(2)}</span></div>
            <div className="text-sm flex justify-between"><span>Tax</span><span>₹ {taxAmount.toFixed(2)}</span></div>
            <div className="text-sm flex justify-between"><span>Discount</span><span>₹ {discount.toFixed(2)}</span></div>
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total</span><span>₹ {total.toFixed(2)}</span>
            </div>

            {/* QR SETTINGS */}
            <div className="mt-4 border-t pt-3">
              <label className={`${labelClass} flex items-center gap-2`}>
                <input
                  type="checkbox"
                  checked={includeQR}
                  onChange={(e) => {
                    setIncludeQR(e.target.checked);
                    if (!e.target.checked) setQrText("");
                  }}
                />
                Include QR Code on Invoice
              </label>

              {includeQR && (
                <input
                  className={`${inputClass} mt-2`}
                  placeholder="UPI / Payment link"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Invoice ---------------- */}
      <div ref={invoiceRef} className={`${cardClass} text-sm`}>
        <div className="flex justify-between mb-3">
          <div>
            <div className="font-semibold">{companyName}</div>
            <div>Bill To: {billTo}</div>
          </div>
          <div className="text-right">
            <div>Invoice #{invoiceNumber}</div>
            <div>{date}</div>
          </div>
        </div>

        <table className="w-full text-sm mb-3">
          <thead>
            <tr className="border-b">
              <th className="text-left">Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Rate</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.desc}</td>
                <td className="text-right">{it.qty}</td>
                <td className="text-right">₹ {it.rate}</td>
                <td className="text-right">₹ {(it.qty * it.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between">
          <div className="w-1/2">
            <div className="font-medium">Deliverables</div>
            <ol className="list-decimal ml-4 text-xs">
              {deliverables.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ol>

            <div className="mt-2 font-medium">Terms</div>
            <div className="text-xs whitespace-pre-wrap">{terms}</div>
          </div>

          <div className="w-56 text-sm">
            <div className="flex justify-between"><span>Total</span><span>₹ {total.toFixed(2)}</span></div>

            {includeQR && qrText && (
              <div className="mt-3 pt-3 border-t flex flex-col items-end">
                <QRCodeGenerator value={qrText} size={96} autoGenerate/>
                <div className="text-[10px] opacity-60 mt-1">Scan to pay</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t text-xs opacity-70 whitespace-pre-wrap">
          {footerText}
        </div>
      </div>
    </div>
  );
}
