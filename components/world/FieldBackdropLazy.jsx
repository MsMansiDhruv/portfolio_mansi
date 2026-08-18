"use client";

import dynamic from "next/dynamic";

const WorldFieldBackdrop = dynamic(() => import("./WorldFieldBackdrop"), {
  ssr: false,
  loading: () => <div className="wd-field-backdrop" aria-hidden />,
});

export default WorldFieldBackdrop;
