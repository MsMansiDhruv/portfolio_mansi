import Link from "next/link";

const NAV = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "WORK" },
  { href: "/#ask", label: "ASK" },
  { href: "/#world-about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

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
      <main className="wd-scroll-story">
        <section className="wd-scroll-section wd-scroll-section--hero">
          <div className="wd-compute">
            <div className="wd-compute__copy">
              <p className="wd-scroll-kicker">Compute weather</p>
              <h1>
                The AI power map
                <span>
                  Where intelligence is physically
                  <br />
                  consuming power.
                </span>
              </h1>
            </div>
            <div className="wd-compute__stage wd-compute--loading" aria-hidden />
          </div>
        </section>
      </main>
    </div>
  );
}
