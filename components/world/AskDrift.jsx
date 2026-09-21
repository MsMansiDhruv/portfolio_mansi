export default function AskDrift() {
  return (
    <div className="wd-ask-drift" aria-hidden>
      <div className="wd-ask-drift__layer" data-speed="0.55">
        <span className="wd-ask-drift__ring" />
      </div>
      <div className="wd-ask-drift__layer" data-speed="1.2">
        <span className="wd-ask-drift__ring wd-ask-drift__ring--mid" />
      </div>
      <div className="wd-ask-drift__layer" data-speed="2.0">
        <span className="wd-ask-drift__ring wd-ask-drift__ring--fast" />
        <span className="wd-ask-drift__orb" />
      </div>
    </div>
  );
}
