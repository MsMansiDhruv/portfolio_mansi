import LegacyShell from "@/components/LegacyShell";

export const metadata = {
  title: "Writing | Mansi Dhruv",
  description: "Articles on data engineering and cloud platforms.",
};

export default function WritingLayout({ children }) {
  return <LegacyShell>{children}</LegacyShell>;
}
