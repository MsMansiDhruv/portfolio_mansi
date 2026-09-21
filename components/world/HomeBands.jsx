"use client";

import { useEffect, useRef } from "react";
import {
  MdAccountTree,
  MdAir,
  MdAnalytics,
  MdBolt,
  MdBugReport,
  MdCloud,
  MdCode,
  MdDataset,
  MdDeveloperBoard,
  MdDns,
  MdFilterAlt,
  MdFlashOn,
  MdFolder,
  MdFunctions,
  MdHub,
  MdIntegrationInstructions,
  MdLink,
  MdMemory,
  MdSchema,
  MdScience,
  MdShare,
  MdStorage,
  MdSyncAlt,
  MdToken,
  MdViewQuilt,
} from "react-icons/md";
import { getExperienceYearsLabel } from "@/lib/career/experience";
import { HOME_FEATURED_SLUGS } from "@/lib/data/exhibition-order";
import { useGsapRise } from "./useGsapRise";

const TECH = [
  { label: "AWS", Icon: MdCloud },
  { label: "S3", Icon: MdFolder },
  { label: "Databricks", Icon: MdHub },
  { label: "Spark", Icon: MdFlashOn },
  { label: "PySpark", Icon: MdIntegrationInstructions },
  { label: "Glue", Icon: MdLink },
  { label: "Redshift", Icon: MdViewQuilt },
  { label: "Lambda", Icon: MdBolt },
  { label: "Terraform", Icon: MdAccountTree },
  { label: "Python", Icon: MdCode },
  { label: "Scala", Icon: MdFunctions },
  { label: "SQL", Icon: MdStorage },
  { label: "Docker", Icon: MdDeveloperBoard },
  { label: "Airflow", Icon: MdAir },
  { label: "Kafka", Icon: MdSyncAlt },
  { label: "Delta", Icon: MdToken },
  { label: "MLflow", Icon: MdScience },
  { label: "DynamoDB", Icon: MdDataset },
  { label: "Aurora", Icon: MdSchema },
  { label: "EC2", Icon: MdMemory },
  { label: "Power BI", Icon: MdAnalytics },
  { label: "GraphQL", Icon: MdShare },
  { label: "DMS", Icon: MdDns },
  { label: "Selenium", Icon: MdBugReport },
  { label: "Spectrum", Icon: MdFilterAlt },
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

const PROOF = [
  {
    id: "years",
    value: Number.parseInt(getExperienceYearsLabel(), 10) || 6,
    suffix: "+",
    lines: ["Years", "in engineering"],
  },
  {
    id: "tools",
    value: 10,
    suffix: "+",
    lines: ["Data platforms", "& tools"],
  },
  {
    id: "systems",
    value: HOME_FEATURED_SLUGS.length,
    suffix: "",
    lines: ["Major systems", "shipped"],
  },
  {
    id: "pipeline",
    value: 40,
    suffix: "%",
    lines: ["Fastest pipeline", "(optimization)"],
  },
];

export function ProofStrip() {
  return <ImpactBand />;
}

export function ImpactBand() {
  const rootRef = useRef(null);
  useGsapRise(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let ctx;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const numbers = [...root.querySelectorAll("[data-count]")];

    const run = async () => {
      if (reduced) {
        numbers.forEach((el) => {
          el.textContent = `${el.dataset.count}${el.dataset.suffix || ""}`;
        });
        root.classList.add("is-in");
        return;
      }

      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        root.classList.add("is-in");
        numbers.forEach((el) => {
          const end = Number(el.dataset.count) || 0;
          const suffix = el.dataset.suffix || "";
          const state = { n: 0 };
          gsap.to(state, {
            n: end,
            duration: 1.4,
            delay: 0.12,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(state.n)}${suffix}`;
            },
          });
        });
      }, root);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        run();
      },
      { threshold: 0.28 }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      ctx?.kill();
    };
  }, []);

  return (
    <div className="wd-impact" ref={rootRef}>
      <header>
        <p data-rise-text>Production systems</p>
        <h2 data-rise-text>Shipped work, measured.</h2>
        <p className="wd-impact__lede" data-rise-text>
          Production lakehouses, allocation engines, intelligence pipelines, and
          workload-specific serving — with the outcomes I can document.
        </p>
      </header>
      <dl className="wd-proof wd-proof--impact">
        {PROOF.map((item) => (
          <div key={item.id}>
            <dd data-count={item.value} data-suffix={item.suffix} data-rise-text>
              0{item.suffix}
            </dd>
            <dt data-rise-text>
              {item.lines[0]}
              <br />
              {item.lines[1]}
            </dt>
          </div>
        ))}
        <div>
          <dd data-count="30" data-suffix="%" data-rise-text>
            0%
          </dd>
          <dt data-rise-text>
            Infra cost
            <br />
            reduction
          </dt>
        </div>
      </dl>
    </div>
  );
}
