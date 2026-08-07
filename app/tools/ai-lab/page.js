import dynamic from "next/dynamic";

const AiLabClient = dynamic(() => import("./AiLabClient"), {
  loading: () => (
    <div
      className="flex min-h-[min(640px,70dvh)] items-center justify-center bg-slate-50 px-5 dark:bg-slate-950"
      aria-busy="true"
      aria-label="Loading AI Engineering Lab"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800/80" />
        <div className="mt-2 h-4 w-[80%] animate-pulse rounded bg-slate-100 dark:bg-slate-800/80" />
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">Loading AI Lab…</p>
      </div>
    </div>
  ),
});

export default function AiLabPage() {
  return <AiLabClient />;
}
