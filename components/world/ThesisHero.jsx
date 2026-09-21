import { IDENTITY } from "@/lib/data/identity";

export default function ThesisHero() {
  return (
    <div className="wd-thesis">
      <p className="wd-thesis__kicker">{IDENTITY.name}</p>
      <h1>
        {IDENTITY.role}
        <span>{IDENTITY.domains}</span>
      </h1>
      <p className="wd-thesis__lead">{IDENTITY.statement}</p>
    </div>
  );
}
