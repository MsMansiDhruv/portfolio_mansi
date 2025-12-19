// app/tools/json/page.jsx
// (server component — no dynamic/ssr flags required)

import React from "react";
import JsonFormatter from "../../../components/tools/JsonFormatter";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import GPUSparks from "../../../components/GpuSparks";

export default function Page() {
  return (
    <main className="w-full max-w-6xl mx-auto px-6 py-8">
      <GPUSparks />
      <Breadcrumbs
        labelMap={{
          tools: "Community Tools",
          json: "JSON Analyser",
        }}
      />

      <JsonFormatter />
    </main>
  );
}
