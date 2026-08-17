import "./globals.css";
import "@/components/design-system-v2/styles/index.css";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Mansi — Data Engineer",
  description:
    "Interactive world of data — Lead Data Engineer building reliable platforms, pipelines, and cloud systems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("mansi-world-theme");if(t==="day"||t==="night"){document.documentElement.setAttribute("data-world-theme",t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body style={{ WebkitFontSmoothing: "antialiased" }} suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
