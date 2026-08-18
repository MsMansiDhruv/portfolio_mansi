"use client";

import { useEffect } from "react";

/** Keep html.wd-coarse / html.wd-narrow in sync without a root client shell. */
export function useWorldViewport() {
  useEffect(() => {
    document.getElementById("gpu-sparks-canvas")?.remove();
    const coarse = window.matchMedia("(pointer: coarse)");
    const narrow = window.matchMedia("(max-width: 1024px)");
    const apply = () => {
      document.documentElement.classList.toggle("wd-coarse", coarse.matches);
      document.documentElement.classList.toggle("wd-narrow", narrow.matches);
    };
    apply();
    coarse.addEventListener("change", apply);
    narrow.addEventListener("change", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      coarse.removeEventListener("change", apply);
      narrow.removeEventListener("change", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);
}
