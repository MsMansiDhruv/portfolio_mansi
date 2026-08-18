"use client";

const RESUME_HREF = "/resume.pdf";

export default function ResumeDock() {
  return (
    <a
      href={RESUME_HREF}
      className="wd-resume-dock"
      target="_blank"
      rel="noreferrer"
      aria-label="Open resume PDF"
    >
      <span className="wd-resume__lock" aria-hidden />
      Resume
    </a>
  );
}
