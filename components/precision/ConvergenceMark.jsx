export default function ConvergenceMark({ size = 22, className = "" }) {
  return (
    <svg
      className={`mp-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path className="mp-mark__in" d="M2 6 L11 12" />
      <path className="mp-mark__in" d="M2 18 L11 12" />
      <circle className="mp-mark__node" cx="12" cy="12" r="1.35" />
      <path className="mp-mark__out" d="M13.2 12 L22 12" />
    </svg>
  );
}
