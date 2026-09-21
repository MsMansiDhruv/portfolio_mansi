"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import WelcomeGate from "@/components/world/WelcomeGate";

const WorldApp = dynamic(() => import("@/components/world/WorldApp"), {
  ssr: false,
  loading: () => null,
});

function prefetchWorld() {
  return import("@/components/world/WorldApp");
}

export default function HomeClient() {
  const [entered, setEntered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 250));
    const id = idle(() => {
      prefetchWorld();
    });
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  const onEnter = useCallback(() => {
    if (loading || entered) return;
    setLoading(true);
    const load = prefetchWorld();
    window.setTimeout(() => {
      load.then(() => setEntered(true));
    }, 900);
  }, [entered, loading]);

  if (!entered) {
    return <WelcomeGate open loading={loading} onEnter={onEnter} />;
  }

  return <WorldApp skipWelcome />;
}
