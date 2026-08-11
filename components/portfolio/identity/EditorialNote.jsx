import { cn } from "@/lib/cn";
import MansiMark from "./MansiMark";

/** Personal engineering annotation — editorial note styling */
export default function EditorialNote({ label = "Mansi's note", children, className }) {
  if (!children) return null;

  return (
    <aside
      className={cn(
        "relative min-w-0 border-l-2 border-amber-600/35 py-1 pl-4 dark:border-amber-500/30",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <MansiMark size="sm" className="opacity-50" />
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800/75 dark:text-amber-500/85">
          {label}
        </p>
      </div>
      <p className="mt-2 text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">{children}</p>
    </aside>
  );
}
