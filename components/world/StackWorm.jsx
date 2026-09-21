export default function StackWorm({ variant = "about" }) {
  if (variant === "circle") {
    return (
      <div className="scroll-trigger-ready__worm-wrap scroll-trigger-ready__worm-wrap--circle" aria-hidden>
        <svg className="scroll-trigger-ready__worm" viewBox="0 0 200 200">
          <circle className="scroll-trigger-ready__worm-orbit" cx="100" cy="100" r="42" />
          <circle className="scroll-trigger-ready__worm-orbit" cx="100" cy="100" r="62" />
          <path
            className="scroll-trigger-ready__worm-path"
            d="M 100 22 A 78 78 0 1 1 99.95 22"
            fill="none"
          />
          <circle className="scroll-trigger-ready__worm-ball" r="11" cx="100" cy="22" />
        </svg>
      </div>
    );
  }

  return (
    <div className="scroll-trigger-ready__worm-wrap" aria-hidden>
      <svg className="scroll-trigger-ready__worm" viewBox="0 0 80 1000" preserveAspectRatio="none">
        <path
          className="scroll-trigger-ready__worm-path"
          d="M 40 28 C 12 140, 68 250, 40 360 S 10 520, 40 640 S 72 800, 40 972"
          fill="none"
        />
        <path
          className="scroll-trigger-ready__worm-morph"
          d="M 40 28 C 70 180, 8 300, 40 430 S 74 610, 28 760 S 8 900, 40 972"
          fill="none"
        />
        <circle className="scroll-trigger-ready__worm-ball" r="20" cx="40" cy="28" />
      </svg>
    </div>
  );
}
