"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CertificationPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/credentials#certifications");
  }, [router]);
  return null;
}
