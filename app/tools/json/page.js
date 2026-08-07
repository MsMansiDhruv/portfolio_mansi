import JsonFormatter from "../../../components/tools/JsonFormatter";
import ToolLayout from "../../../components/tools/ToolLayout";

export const metadata = {
  title: "JSON analyser · Toolkit",
  description: "Format, validate, and inspect JSON in the browser.",
};

export default function Page() {
  return (
    <ToolLayout
      title="JSON analyser"
      description="Paste JSON to format, highlight errors, explore a tree view, and infer a simple schema — all client-side."
      breadcrumbMap={{ json: "JSON analyser" }}
      wide
    >
      <JsonFormatter />
    </ToolLayout>
  );
}
