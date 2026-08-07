import BillGeneratorClientWrapper from "../../../components/tools/BillGeneratorClientWrapper";
import ToolLayout from "../../../components/tools/ToolLayout";

export const metadata = {
  title: "Bill generator · Toolkit",
  description: "Create, preview, and export invoices.",
};

export default function Page() {
  return (
    <ToolLayout
      title="Bill / invoice generator"
      description="Build an invoice in the browser, then export PDF or share when your backend endpoints are configured."
      breadcrumbMap={{ bill: "Bill generator" }}
      wide
    >
      <BillGeneratorClientWrapper />
    </ToolLayout>
  );
}
