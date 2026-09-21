export default function StackBackdrop() {
  return (
    <div className="wd-stack-worm-wrap" aria-hidden>
      <svg className="wd-stack-worm" viewBox="0 0 1200 900" preserveAspectRatio="none">
        <path
          className="wd-stack-worm__path"
          d="M 72 20 C 40 160, 110 280, 72 420 S 20 580, 72 720 S 120 840, 72 880"
          fill="none"
        />
        <path
          className="wd-stack-worm__path"
          d="M 1128 20 C 1160 160, 1090 280, 1128 420 S 1180 580, 1128 720 S 1080 840, 1128 880"
          fill="none"
        />
        <circle className="wd-stack-worm__dot" r="5" cx="72" cy="20" />
        <circle className="wd-stack-worm__dot" r="4" cx="72" cy="420" />
        <circle className="wd-stack-worm__dot" r="5" cx="72" cy="880" />
        <circle className="wd-stack-worm__dot" r="5" cx="1128" cy="20" />
        <circle className="wd-stack-worm__dot" r="4" cx="1128" cy="420" />
        <circle className="wd-stack-worm__dot" r="5" cx="1128" cy="880" />
      </svg>
    </div>
  );
}
