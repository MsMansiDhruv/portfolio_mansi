"use client";

export default function ToolLayout({ title, description, children }) {
  return (
    <div className="min-h-screen w-full px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        {/* Tool Card */}
        <div
          className="
            rounded-xl border
            bg-white/70 dark:bg-[#050505]/70
            backdrop-blur-sm
            border-primary/40 dark:border-primary/30
            shadow-sm
            p-6
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
