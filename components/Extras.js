import React from "react";

const ACCENT = "var(--color-accent)";

/* ----------------------------- Skills Radar ----------------------------- */

// Simple SVG radar chart (no external deps). Accepts an object: { label: value }
function SkillsRadar({ data = {}, size = 320, levels = 4 }) {
  const keys = Object.keys(data);
  const values = keys.map((k) => Number(data[k] || 0));
  const max = Math.max(...values, 1);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - 36; // padding
  const angleStep = (Math.PI * 2) / keys.length;

  const polygonPoints = values
    .map((v, i) => {
      const ratio = v / max;
      const angle = -Math.PI / 2 + i * angleStep; // start at top
      const x = cx + Math.cos(angle) * r * ratio;
      const y = cy + Math.sin(angle) * r * ratio;
      return `${x},${y}`;
    })
    .join(" ");

  // grid polygons for levels
  const levelPolygons = Array.from({ length: levels }, (_, li) => {
    const levelR = r * ((li + 1) / levels);
    const pts = keys
      .map((_, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = cx + Math.cos(angle) * levelR;
        const y = cy + Math.sin(angle) * levelR;
        return `${x},${y}`;
      })
      .join(" ");
    return pts;
  });

  return (
    <div className="rounded-lg p-4 bg-white dark:bg-slate-800/60 shadow-sm border" style={{ borderColor: 'rgba(46,196,182,0.06)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Skills radar</h3>
          <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">My core technical strengths (relative).</div>
        </div>
      </div>

      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="radarAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.9" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* grid levels */}
          {levelPolygons.map((pts, i) => (
            <polygon key={i} points={pts} fill="none" stroke="rgba(15,23,42,0.04)" />
          ))}

          {/* axes lines */}
          {keys.map((k, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(15,23,42,0.04)" />;
          })}

          {/* data polygon */}
          <polygon points={polygonPoints} fill="url(#radarAccent)" fillOpacity="0.14" stroke={ACCENT} strokeWidth={2} />

          {/* labels */}
          {keys.map((k, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            const lx = cx + Math.cos(angle) * (r + 18);
            const ly = cy + Math.sin(angle) * (r + 18);
            const anchor = Math.cos(angle) > 0.2 ? 'start' : Math.cos(angle) < -0.2 ? 'end' : 'middle';
            return (
              <text key={k} x={lx} y={ly} fontSize={12} fill="#475569" textAnchor={anchor} alignmentBaseline="middle">
                {k}
              </text>
            );
          })}

          {/* center label (max) */}
          <text x={cx} y={cy + 3} fontSize={10} fill="#94a3b8" textAnchor="middle">max {max}</text>
        </svg>
      </div>
    </div>
  );
}

/* ----------------------------- Projects Grid ---------------------------- */

function ProjectsGrid({ projects = [] }) {
  return (
    <div className="rounded-lg p-4 bg-white dark:bg-slate-800/60 shadow-sm border" style={{ borderColor: 'rgba(46,196,182,0.06)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Key projects</h3>
          <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">Selected case studies — impact first.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {projects.map((p) => (
          <article key={p.id} className="p-3 rounded-lg border bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/20" style={{ borderColor: 'rgba(46,196,182,0.06)' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{p.title}</h4>
                <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">{p.role}</div>
              </div>
              <div className="text-xs text-slate-400">{p.year}</div>
            </div>

            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{p.summary}</p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{s}</span>
                ))}
              </div>
              <a href={p.link || '#'} className="ml-auto text-xs font-medium" style={{ color: ACCENT }}>Read case →</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Leadership Timeline ----------------------- */

function TimelineItem({ node }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-sm font-semibold border" style={{ borderColor: 'rgba(46,196,182,0.08)' }}>{node.year}</div>
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">{node.title}</div>
        <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">{node.desc}</div>
      </div>
    </div>
  );
}

function LeadershipTimeline({ events = [] }) {
  return (
    <div className="rounded-lg p-4 bg-white dark:bg-slate-800/60 shadow-sm border" style={{ borderColor: 'rgba(46,196,182,0.06)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Leadership timeline</h3>
          <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">Selected highlights & progression.</div>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((e) => (
          <TimelineItem key={e.id} node={e} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Tech Stack Badges ------------------------- */

function TechStackBadgeRow({ items = [] }) {
  return (
    <div className="rounded-lg p-4 bg-white dark:bg-slate-800/60 shadow-sm border" style={{ borderColor: 'rgba(46,196,182,0.06)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tech stack</h3>
          <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">Tools & technologies I use frequently.</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {items.map((t) => (
          <span key={t} className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-gradient-to-r" style={{ background: 'linear-gradient(90deg, rgba(46,196,182,0.08), rgba(46,196,182,0.02))', color: '#064E3B' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Wrapper -------------------------------- */

export default function Extras({
  skills = {
    Python: 9,
    SQL: 8,
    Spark: 7,
    AWS: 8,
    Terraform: 6,
    Docker: 7,
    "System Design": 7,
  },
  projects = [
    {
      id: 'p-cust360',
      title: 'Customer360 Datamart',
      role: 'Lead Data Engineer',
      year: '2024',
      summary: 'Designed and implemented a Customer360 datamart that improved query performance by 6x and saved ₹1.2L monthly on infra costs.',
      stack: ['Python', 'Spark', 'Delta', 'AWS'],
      link: '#',
    },
    {
      id: 'p-streamline',
      title: 'ETL Modernization',
      role: 'SRE & Data Engineer',
      year: '2023',
      summary: 'Migrated legacy ETL to event-driven pipelines; reduced batch runtimes from 12h to 2h and improved SLA.',
      stack: ['Airflow', 'Kafka', 'Docker'],
      link: '#',
    },
  ],
  timeline = [
    { id: 't1', year: '2023', title: 'Promoted to Lead', desc: 'Took ownership of a cross-functional team and mentored 4 engineers.' },
    { id: 't2', year: '2021', title: 'Senior Data Engineer', desc: 'Designed scalable pipelines and improved delivery cadence.' },
    { id: 't3', year: '2019', title: 'Joined SG Analytics', desc: 'Started as full-stack engineer — transitioned to data engineering.' },
  ],
  tech = ['Python', 'SQL', 'Spark', 'AWS', 'Terraform', 'Docker', 'Airflow', 'Kafka'],
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsRadar data={skills} />
        <ProjectsGrid projects={projects} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeadershipTimeline events={timeline} />
        <div className="lg:col-span-2">
          <TechStackBadgeRow items={tech} />
        </div>
      </div>
    </div>
  );
}
