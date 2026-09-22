import Link from "next/link";
import { LANDING_HERO } from "@/lib/data/identity";

const NAV = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "WORK" },
  { href: "/#ask", label: "ASK" },
  { href: "/about", label: "ABOUT" },
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
              <p className="wd-compute__kicker">{LANDING_HERO.kicker}</p>
              <h1>
                {LANDING_HERO.titleBefore}
                <em>{LANDING_HERO.titleMark}</em>
              </h1>
              <p className="wd-compute__lead">{LANDING_HERO.support}</p>
              <div className="wd-compute__actions">
                <Link href={LANDING_HERO.primaryCta.href} className="wd-compute__cta wd-compute__cta--solid">
                  {LANDING_HERO.primaryCta.label}
                </Link>
                <Link href={LANDING_HERO.secondaryCta.href} className="wd-compute__cta">
                  {LANDING_HERO.secondaryCta.label}
                </Link>
              </div>
            </div>
            <div className="wd-compute__stage wd-compute--loading" aria-hidden />
          </div>
        </section>
      </main>
    </div>
  );
}
