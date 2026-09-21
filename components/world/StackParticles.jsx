export default function StackParticles({ kind = "work" }) {
  if (kind === "about") {
    return (
      <svg className="wd-stack-fx" viewBox="0 0 420 180" aria-hidden>
        <path
          className="wd-stack-fx__morph"
          data-morph="M 40 110 C 90 30, 170 30, 220 100 S 330 190, 390 70"
          d="M 40 90 C 110 20, 180 50, 230 90 S 320 160, 390 90"
          fill="none"
        />
        <path
          className="wd-stack-fx__draw"
          d="M 24 140 C 90 60, 160 50, 230 110 S 340 180, 400 80"
          fill="none"
        />
        <circle className="wd-stack-fx__dot" r="4.5" cx="40" cy="90" />
        <circle className="wd-stack-fx__dot" r="3.2" cx="230" cy="90" />
        <circle className="wd-stack-fx__dot" r="4" cx="390" cy="90" />
      </svg>
    );
  }

  if (kind === "contact") {
    return (
      <svg className="wd-stack-fx wd-stack-fx--contact" viewBox="0 0 360 120" aria-hidden>
        <path
          className="wd-stack-fx__draw"
          d="M 16 70 C 80 20, 140 110, 210 50 S 300 10, 344 72"
          fill="none"
        />
        <circle className="wd-stack-fx__dot" r="4" cx="16" cy="70" />
        <circle className="wd-stack-fx__dot" r="3.5" cx="210" cy="50" />
        <circle className="wd-stack-fx__dot" r="4.5" cx="344" cy="72" />
      </svg>
    );
  }

  return (
    <svg className="wd-stack-fx wd-stack-fx--work" viewBox="0 0 520 140" aria-hidden>
      <path
        className="wd-stack-fx__draw"
        d="M 12 88 C 80 20, 150 20, 220 88 S 360 156, 508 52"
        fill="none"
      />
      <circle className="wd-stack-fx__dot" r="4" cx="12" cy="88" />
      <circle className="wd-stack-fx__dot" r="3.4" cx="220" cy="88" />
      <circle className="wd-stack-fx__dot" r="4.2" cx="508" cy="52" />
    </svg>
  );
}
