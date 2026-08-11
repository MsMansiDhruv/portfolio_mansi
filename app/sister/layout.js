export const metadata = {
  title: "Sister",
  robots: { index: false, follow: false },
};

/** Isolated layout — no extra chrome; full viewport for the spoof page. */
export default function SisterLayout({ children }) {
  return children;
}
