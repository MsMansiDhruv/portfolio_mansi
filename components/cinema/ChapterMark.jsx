export default function ChapterMark({ number, title, subtitle, accent = "cyan" }) {
  const accentColor =
    accent === "gold"
      ? "var(--kairo-gold)"
      : accent === "crimson"
        ? "var(--kairo-crimson)"
        : accent === "violet"
          ? "var(--kairo-violet)"
          : "var(--kairo-cyan)";

  return (
    <header className="mb-10 sm:mb-14">
      <p className="kairo-mono text-[var(--kairo-muted)]">
        Chapter {String(number).padStart(2, "0")}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="kairo-display text-[clamp(1.75rem,4.5vw,3rem)] font-bold uppercase tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="kairo-editorial max-w-md text-lg italic text-[var(--kairo-muted)] sm:text-xl">{subtitle}</p>
        ) : null}
      </div>
      <div className="kairo-chapter-line mt-6 max-w-xl" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent 85%)` }} />
    </header>
  );
}
