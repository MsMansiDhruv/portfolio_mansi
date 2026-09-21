"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import dynamic from "next/dynamic";
import WelcomeGate from "@/components/world/WelcomeGate";

const ENTERED_KEY = "mansi-world-entered";

const WorldApp = dynamic(() => import("@/components/world/WorldApp"), {
  ssr: false,
  loading: () => null,
});

function prefetchWorld() {
  return import("@/components/world/WorldApp");
}

function alreadyInside() {
  if (typeof window === "undefined") return false;
  if (window.location.hash) return true;
  return false;
}

function markEntered() {
  try {
    sessionStorage.setItem(ENTERED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function HomeClient() {
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (alreadyInside()) {
      markEntered();
      setEntered(true);
    }
    setReady(true);
  }, []);

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
    markEntered();
    const load = prefetchWorld();
    window.setTimeout(() => {
      load.then(() => setEntered(true));
    }, 900);
  }, [entered, loading]);

  if (!ready) return null;
  if (!entered) {
    return <WelcomeGate open loading={loading} onEnter={onEnter} />;
  }

  return <WorldApp skipWelcome />;
}
