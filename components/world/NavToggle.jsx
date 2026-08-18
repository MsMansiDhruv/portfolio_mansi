"use client";

export default function NavToggle({ open, onClick }) {
  return (
    <button
      type="button"
      className={`wd-nav-toggle${open ? " is-open" : ""}`}
      aria-expanded={open}
      aria-label={open ? "Close navigation" : "Open navigation"}
      onClick={onClick}
    >
      <span className="wd-nav-toggle__icon" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span className="wd-nav-toggle__text">{open ? "Close" : "Menu"}</span>
    </button>
  );
}
