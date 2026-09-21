"use client";

import {
  MdAccountTree,
  MdCloud,
  MdCode,
  MdHub,
  MdIntegrationInstructions,
  MdStorage,
  MdViewQuilt,
} from "react-icons/md";

const TECH = [
  { label: "Python", Icon: MdCode },
  { label: "SQL", Icon: MdStorage },
  { label: "PySpark", Icon: MdIntegrationInstructions },
  { label: "AWS", Icon: MdCloud },
  { label: "Databricks", Icon: MdHub },
  { label: "Redshift", Icon: MdViewQuilt },
  { label: "Terraform", Icon: MdAccountTree },
];

function TechRow({ hidden }) {
  return (
    <ul aria-hidden={hidden ? "true" : undefined}>
      {TECH.map(({ label, Icon }) => (
        <li key={label}>
          <Icon aria-hidden />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

export function TechRail() {
  return (
    <div className="wd-tech-rail">
      <div className="wd-tech-rail__mask">
        <div className="wd-tech-rail__track">
          <TechRow />
          <TechRow hidden />
        </div>
      </div>
    </div>
  );
}

export function ProofStrip() {
  return null;
}

export function ImpactBand() {
  return null;
}
