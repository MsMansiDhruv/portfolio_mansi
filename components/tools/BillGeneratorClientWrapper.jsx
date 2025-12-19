"use client";
import dynamic from "next/dynamic";

// Dynamically import the real client component only on the client
const BillGenerator = dynamic(
  () => import("./BillGenerator"), // path relative to this wrapper
  { ssr: false }
);

export default function BillGeneratorClientWrapper(props) {
  return <BillGenerator {...props} />;
}
