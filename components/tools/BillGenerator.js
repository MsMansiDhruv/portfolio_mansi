"use client";

import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCodeGenerator from "./QRCodeGenerator";
import Breadcrumbs from "../common/Breadcrumbs";

/* ---------------- Main Component ---------------- */

export default function BillGenerator() {
  /* ---------- QR ---------- */
  const [includeQR, setIncludeQR] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [qrText, setQrText] = useState("");

  /* ---------- Invoice State ---------- */
  const [companyName, setCompanyName] = useState("My Company Pvt Ltd");
  const [billTo, setBillTo] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`
  );
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [items, setItems] = useState([
    { id: 1, desc: "Sample item", qty: 1, rate: 100 },
  ]);

  const taxPercent = 18;
  const discount = 0;

  const [deliverables, setDeliverables] = useState(["Deliverable 1"]);
  const [terms, setTerms] = useState("Payment due in 15 days. Late fees apply.");
  const footerText =
    "GSTIN: XXXXXXXXXXX\nThis is a computer-generated invoice.";

  const invoiceRef = useRef(null);

  /* ---------- Calculations ---------- */
  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount - discount;

  /* ---------- Auto-generate QR text ---------- */
  useEffect(() => {
    if (!includeQR || !upiId || total <= 0) {
      setQrText("");
      return;
    }

    const note = encodeURIComponent(`Invoice ${invoiceNumber}`);

    setQrText(
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
        companyName
      )}&am=${total.toFixed(2)}&tn=${note}`
    );
  }, [includeQR, upiId, total, invoiceNumber, companyName]);

  /* ---------- Helpers ---------- */
  const addItem = () =>
    setItems((s) => [...s, { id: Date.now(), desc: "", qty: 1, rate: 0 }]);

  const updateItem = (id, key, value) =>
    setItems((s) =>
      s.map((it) => (it.id === id ? { ...it, [key]: value } : it))
    );

  const removeItem = (id) =>
    setItems((s) => s.filter((it) => it.id !== id));

  const addDeliverable = () =>
    setDeliverables((s) => [...s, `Deliverable ${s.length + 1}`]);

  const updateDeliverable = (i, v) =>
    setDeliverables((s) => s.map((d, idx) => (idx === i ? v : d)));

  const removeDeliverable = (i) =>
    setDeliverables((s) => s.filter((_, idx) => idx !== i));

  const inputClass =
    "w-full p-2 mt-1 text-sm rounded-md bg-transparent border border-gray-200 dark:border-gray-700";
  const labelClass = "block text-sm text-slate-600 dark:text-slate-400";
  const cardClass =
    "p-4 rounded-lg border bg-white dark:bg-[#1e293b80] border-gray-200 dark:border-gray-700";

  /* ---------- Export to PDF ---------- */
  const exportToPDF = async () => {
    if (!invoiceRef.current) return;

    const invoice = invoiceRef.current;
    const originalBg = invoice.style.background;
    invoice.style.background = "#ffffff";

    const canvas = await html2canvas(invoice, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoiceNumber}.pdf`);

    invoice.style.background = originalBg;
  };

  /* ---------- Render ---------- */
  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <Breadcrumbs labelMap={{ tools: "Community Tools", bill: "Bill Generator" }} />

      <h1
        className="text-4xl font-bold mb-6"
        style={{ color: "var(--color-accent)" }}
      >
        Bill Generator
      </h1>

      {/* ================= FORM + SIDEBAR ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-6 mb-8 no-print">
        {/* -------- Left Form -------- */}
        <div className="space-y-4">
          <div className={cardClass}>
            <label className={labelClass}>Company Name</label>
            <input
              className={inputClass}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <div>
                <label className={labelClass}>Bill To</label>
                <input
                  className={inputClass}
                  value={billTo}
                  onChange={(e) => setBillTo(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Invoice #</label>
                <input
                  className={inputClass}
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className={cardClass}>
            <div className="flex justify-between mb-2">
              <h3 className="font-medium text-sm">Items</h3>
              <button
                onClick={addItem}
                className="text-sm border px-2 py-1 rounded"
              >
                + Add
              </button>
            </div>

            {items.map((it) => (
              <div
                key={it.id}
                className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-2 mb-2 items-center"
              >
                <input
                  className={inputClass}
                  value={it.desc}
                  onChange={(e) =>
                    updateItem(it.id, "desc", e.target.value)
                  }
                />
                <input
                  type="number"
                  className={inputClass}
                  value={it.qty}
                  onChange={(e) =>
                    updateItem(it.id, "qty", Number(e.target.value))
                  }
                />
                <input
                  type="number"
                  className={inputClass}
                  value={it.rate}
                  onChange={(e) =>
                    updateItem(it.id, "rate", Number(e.target.value))
                  }
                />
                <div className="text-sm text-right whitespace-nowrap">
                  ₹ {(it.qty * it.rate).toFixed(2)}
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="border rounded px-2 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Deliverables & Terms */}
          <div className={cardClass}>
            <label className={labelClass}>Deliverables</label>
            {deliverables.map((d, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <input
                  className={inputClass}
                  value={d}
                  onChange={(e) =>
                    updateDeliverable(i, e.target.value)
                  }
                />
                <button
                  onClick={() => removeDeliverable(i)}
                  className="border px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addDeliverable}
              className="mt-2 text-sm border px-2 py-1 rounded"
            >
              + Add deliverable
            </button>

            <div className="mt-3">
              <label className={labelClass}>Terms & Conditions</label>
              <textarea
                className={inputClass}
                rows={3}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* -------- Totals / QR -------- */}
        <div className={cardClass}>
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Tax</span>
            <span>₹ {taxAmount.toFixed(2)}</span>
          </div>

          <div className="border rounded-md px-4 py-2 flex justify-between font-medium">
            <span>Total</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>

          <div className="mt-4 border-t pt-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeQR}
                onChange={(e) => setIncludeQR(e.target.checked)}
              />
              Include QR Code (auto amount)
            </label>

            {includeQR && (
              <input
                className={`${inputClass} mt-2`}
                placeholder="UPI ID (e.g. name@bank)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ================= DOWNLOAD ================= */}
      <div className="invoice-print no-print flex justify-end mb-3">
        <button
          onClick={exportToPDF}
          className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--color-accent)] text-black shadow hover:brightness-110"
        >
          Download Invoice (PDF)
        </button>
      </div>

      {/* ================= INVOICE ================= */}
      <div ref={invoiceRef} className="invoice-print bg-white rounded-lg border px-8 py-8 text-[14px] leading-[1.6] text-slate-900">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">{companyName}</div>
            <div className="text-sm">Bill To: {billTo}</div>
          </div>
          <div className="text-right text-sm">
            <div>Invoice #{invoiceNumber}</div>
            <div>{date}</div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full table-fixed border-collapse mb-6">
          <colgroup>
            <col style={{ width: "50%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="border-b">
              <th className="text-left pb-2">Item</th>
              <th className="text-center pb-2">Qty</th>
              <th className="text-right pb-2">Rate</th>
              <th className="text-right pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b last:border-b-0">
                <td className="py-2">{it.desc}</td>
                <td className="py-2 text-center">{it.qty}</td>
                <td className="py-2 text-right">₹ {it.rate}</td>
                <td className="py-2 text-right">
                  ₹ {(it.qty * it.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div>
            <div className="font-medium">Deliverables</div>
            <div className="text-xs space-y-1 mb-3">
              {deliverables.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <span className="w-4 text-right">{i + 1}.</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <div className="font-medium">Terms</div>
            <div className="text-xs whitespace-pre-wrap">{terms}</div>
          </div>

          <div className="flex flex-col items-end">
            <div className="border rounded-md px-5 py-3 mb-4 w-56">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>
            </div>

            {includeQR && qrText && (
              <div className="text-center">
                <QRCodeGenerator value={qrText} size={96} autoGenerate />
                <div className="text-[10px] opacity-60">Scan to pay</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-3 border-t text-xs opacity-70 whitespace-pre-wrap">
          {footerText}
        </div>
      </div>
    </div>
  );
}
