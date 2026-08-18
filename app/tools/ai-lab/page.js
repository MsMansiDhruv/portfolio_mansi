"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@/styles/mansi-world-of-data.css";

function AiLabAlias() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const mode = params.get("mode");
    router.replace(mode ? `/?mode=${encodeURIComponent(mode)}#world-ai` : "/#world-ai");
  }, [router, params]);

  return (
    <div className="wd-root wd-page is-ready">
      <main className="wd-page-main">
        <p className="wd-scroll-kicker">AI LAB</p>
        <h1 className="wd-page-title">Ask Mansi</h1>
      </main>
    </div>
  );
}

/** AI Lab lives on the homepage — same destination on desktop and mobile. */
export default function AiLabPage() {
  return (
    <Suspense
      fallback={
        <div className="wd-root wd-page is-ready">
          <main className="wd-page-main">
            <p className="wd-scroll-kicker">AI LAB</p>
            <h1 className="wd-page-title">Ask Mansi</h1>
          </main>
        </div>
      }
    >
      <AiLabAlias />
    </Suspense>
  );
}
