"use client";

import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="
          min-h-screen flex flex-col
          bg-[#f3f4f6] text-slate-800
          dark:bg-[#0c0c0c] dark:text-slate-100
        "
        style={{ WebkitFontSmoothing: "antialiased" }}
      >
        {/* SINGLE HEADER — OWNED BY NAV */}
        <Nav />

        {/* MAIN CONTENT */}
        <main className="w-full flex-grow mt-4">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
