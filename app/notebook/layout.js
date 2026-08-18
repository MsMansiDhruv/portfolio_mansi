import LegacyShell from "@/components/LegacyShell";

export const metadata = {
  title: "Notebook | Mansi Dhruv",
};

export default function NotebookLayout({ children }) {
  return <LegacyShell>{children}</LegacyShell>;
}
