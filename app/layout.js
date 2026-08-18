import { IBM_Plex_Mono, IBM_Plex_Sans, Syne } from "next/font/google";
import "./base.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
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
      className={`${syne.variable} ${plexSans.variable} ${plexMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.documentElement;var t=localStorage.getItem("mansi-world-theme");if(t==="day"||t==="night"){r.setAttribute("data-world-theme",t);}r.classList.toggle("wd-coarse",window.matchMedia("(pointer: coarse)").matches);r.classList.toggle("wd-narrow",window.matchMedia("(max-width: 1024px)").matches);}catch(e){}})();`,
          }}
        />
      </head>
      <body style={{ WebkitFontSmoothing: "antialiased" }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
