"use client";

export default function PanelCard({ children }) {
  return (
    <div className="wd-panel__stage">
      <div className="wd-panel__card">{children}</div>
    </div>
  );
}
