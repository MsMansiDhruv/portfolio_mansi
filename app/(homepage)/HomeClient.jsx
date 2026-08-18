"use client";

import dynamic from "next/dynamic";
import HomeFallback from "@/components/world/HomeFallback";

const WorldApp = dynamic(() => import("@/components/world/WorldApp"), {
  ssr: false,
  loading: () => <HomeFallback />,
});

export default function HomeClient() {
  return <WorldApp />;
}
