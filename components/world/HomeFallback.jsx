import Link from "next/link";

const NAV = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "WORK" },
  { href: "/#world-ai", label: "AI LAB" },
  { href: "/credentials", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

/** Instant first paint while the homepage client bundle loads. */
export default function HomeFallback() {
  return (
    <div className="wd-root is-ready" data-theme="night">
      <header className="wd-bar">
        <Link href="/" className="wd-brand">
          Mansi
        </Link>
        <nav className="wd-nav" aria-label="System">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`wd-nav__item${item.href === "/" ? " is-active" : ""}`}
            >
              <span className="wd-nav__label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>
      <div className="wd-stage" aria-hidden />
      <main className="wd-scroll-story">
        <section className="wd-scroll-section wd-scroll-section--hero">
          <div className="wd-scroll-copy wd-scroll-copy--hero">
            <p className="wd-scroll-kicker">DATA SYSTEMS, MADE LEGIBLE.</p>
            <h1>MANSI</h1>
            <p className="wd-scroll-role">DATA ENGINEER</p>
            <p>I build reliable data platforms—from raw inputs to decisions teams can trust.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
