export default function SignalRail() {
  return (
    <div className="scroll-trigger-ready__worm-wrap wd-signal" aria-hidden>
      <svg className="wd-signal__svg" viewBox="0 0 80 1000" preserveAspectRatio="xMidYMin meet">
        <path
          className="wd-signal__path"
          d="M 40 36
             C 40 90, 40 120, 40 168
             C 12 198, 68 238, 40 278
             C 12 318, 68 358, 40 398
             C 64 438, 16 478, 40 528
             C 22 588, 58 648, 40 708
             C 40 768, 40 838, 40 964"
          fill="none"
        />
        <circle className="wd-signal__station" cx="40" cy="36" r="5" />
        <circle className="wd-signal__station" cx="40" cy="278" r="5" />
        <circle className="wd-signal__station" cx="40" cy="528" r="5" />
        <circle className="wd-signal__station" cx="40" cy="708" r="5" />
        <circle className="wd-signal__station" cx="40" cy="964" r="5" />
        <circle className="wd-signal__ball" r="9" cx="40" cy="36" />
      </svg>
    </div>
  );
}
