import dynamic from "next/dynamic"; // ok to import dynamic, but we won't call ssr:false here
import BillGeneratorClientWrapper from "../../../components/tools/BillGeneratorClientWrapper";
import GpuSparks from "../../../components/GpuSparks";
import QRCodeGenerator from "../../../components/tools/QRCodeGenerator";
export const metadata = {
  title: "Community Tools - Mansi Dhruv",
  description: "Small useful tools and scripts - Bill generator, helpers and utilities.",
};

export default function Page() {
  return (
    <main className="p-6">
      <GpuSparks />
      <BillGeneratorClientWrapper />
    </main>
  );
}
