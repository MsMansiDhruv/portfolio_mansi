import { Outfit, Manrope, JetBrains_Mono } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import "./base.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "Mansi — Data Engineer",
  description:
    "Interactive world of data — Lead Data Engineer building reliable platforms, pipelines, and cloud systems.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${manrope.variable} ${jetbrains.variable}`}
      data-world-theme="night"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.documentElement;var t=localStorage.getItem("mansi-world-theme");if(t==="day"||t==="night"){r.setAttribute("data-world-theme",t);r.style.colorScheme=t==="day"?"light":"dark";}else{r.setAttribute("data-world-theme","night");r.style.colorScheme="dark";}r.classList.toggle("wd-coarse",window.matchMedia("(pointer: coarse)").matches);r.classList.toggle("wd-narrow",window.matchMedia("(max-width: 1024px)").matches);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${manrope.variable} ${jetbrains.variable}`}
        style={{ WebkitFontSmoothing: "antialiased" }}
        suppressHydrationWarning
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
