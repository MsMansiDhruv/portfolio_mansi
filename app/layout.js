import "./globals.css";
import "@/components/design-system-v2/styles/index.css";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Mansi Dhruv",
  description: "Portfolio of Mansi Dhruv",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ WebkitFontSmoothing: "antialiased" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
