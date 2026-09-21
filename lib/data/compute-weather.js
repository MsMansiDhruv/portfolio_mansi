/**
 * AI Power Map - IEA Energy and AI (April 2025), OMDIA cluster map via IEA.
 *
 * Named clusters only (IEA Figs 1.13, 2.29, Box 2.8, exec summary).
 * `power` / `ai` / `growth` are relative visual ranks, not measured MW,
 * except where `facts` quotes IEA/Magnum Economics numbers.
 */

export const COMPUTE_WEATHER = {
  kicker: "Compute weather",
  title: "The AI power\u00A0map",
  question: "Where intelligence is physically\nconsuming power.",
  chain: "Data centres → electricity → AI compute",
  lead:
    "This is not a decorative globe. It is the physical ledger of AI: real buildings, the electricity they draw, and the grids that have to keep up. Switch a layer. The map should change what you believe.",
  stamp: "DATA · 2024-26",
  note:
    "Base map: Natural Earth land. Small dots: 6,131 facilities with GPS in the ATLAS open inventory (not a live census of every hall on Earth). Large nodes: IEA-named clusters. Size, brightness and pulse are relative ranks, not live megawatts.",
  source: {
    label: "IEA Energy and AI",
    href: "https://www.iea.org/reports/energy-and-ai/executive-summary",
  },
  atlas: {
    label: "ATLAS data-centre map",
    href: "https://github.com/ringmast4r/Global-Data-Center-Map",
  },
  stats: [
    { value: "415 TWh", label: "global data-centre electricity · 2024 · industry" },
    { value: "45%", label: "U.S. share of that electricity · industry" },
    { value: "50%", label: "US pipeline still in existing 1 GW+ hubs" },
  ],
  layers: [
    {
      id: "centres",
      label: "Data centres",
      headline: "AI does not live in the cloud. It lives in these halls.",
      body: "Every small dot is a GPS-located facility. This is the inventory of the physical internet - rooms that must stay cold, powered, and connected. Hover a large node for an IEA-named cluster.",
      seeing: "6,131 mapped buildings lighting up at once.",
    },
    {
      id: "power",
      label: "Power",
      headline: "Intelligence is an energy story.",
      body: "Pulses scale with relative electricity and IT load. Northern Virginia is already a multi-gigawatt market. The wow is the bill: 415 TWh globally in 2024, with the US taking nearly half.",
      seeing: "Heavier markets throb harder. Dim dots are still real - they just draw less.",
    },
    {
      id: "ai",
      label: "AI",
      headline: "Not every data centre is an AI factory.",
      body: "Bright nodes are the hyperscale and AI-heavy clusters the IEA flags. Dim ones are still compute, not the frontier. A few metros decide where models actually train and serve.",
      seeing: "A constellation between the sites that matter for AI - the rest recedes.",
    },
    {
      id: "grid",
      label: "Grid",
      headline: "A cluster is only as real as its interconnection.",
      body: "Watch current travel from regional grid context into each hub. If the feeder is strained, the model does not ship. This is the physics between the plant and the GPU.",
      seeing: "Electricity in motion - not a static pin map.",
    },
    {
      id: "growth",
      label: "Growth",
      headline: "The map is still filling in.",
      body: "Expanding rings mark pipeline pressure: halls under development, 1 GW+ hubs still adding. Half of the US pipeline is still landing in existing giant markets. The present is already being outgrown.",
      seeing: "Rings expand where the next gigawatts are queued.",
    },
  ],
};

export function project(lat, lng) {
  return [(lng + 180) * (1000 / 360), (90 - lat) * (500 / 180)];
}

export const WORLD_VIEW = { x: 0, y: 0, w: 1000, h: 500 };
/** US + China + Europe - where IEA says load actually sits. */
export const CONCENTRATION_VIEW = { x: 118, y: 72, w: 720, h: 268 };

export function clusterView(site, span = 210) {
  const [x, y] = project(site.lat, site.lng);
  return { x: x - span / 2, y: y - span / 2.6, w: span, h: span / 1.85 };
}

/**
 * power: relative IT-load rank for sizing (NoVA is the only GW quote).
 * ai: brightness - markets IEA links to AI / hyperscale concentration.
 * growth: pulse / rings - pipeline language from IEA (under development / 1 GW+ hubs).
 */
export const COMPUTE_SITES = [
  {
    id: "nva",
    name: "Northern Virginia",
    region: "United States",
    lat: 39.02,
    lng: -77.48,
    power: 1,
    ai: 0.98,
    growth: 1,
    facts: {
      role: "Data-centre cluster · Data Centre Alley",
      capacity: ">5 GW installed",
      pipeline: ">3 GW under development",
      grid: "Mid-Atlantic interconnection (PJM region)",
      ai: "World’s largest market; IEA’s primary US concentration case",
    },
    grid: { name: "PJM / Mid-Atlantic", lat: 39.6, lng: -80.35 },
  },
  {
    id: "dallas",
    name: "Dallas",
    region: "United States",
    lat: 32.78,
    lng: -96.8,
    power: 0.78,
    ai: 0.82,
    growth: 0.84,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named among the ten largest US hubs",
      pipeline: "Existing 1 GW+ market; half of US pipeline stays in such hubs",
      grid: "ERCOT / Texas interconnection",
      ai: "Named US hub on IEA’s 2024 cluster map",
    },
    grid: { name: "ERCOT", lat: 31.4, lng: -99.1 },
  },
  {
    id: "chicago",
    name: "Chicago",
    region: "United States",
    lat: 41.88,
    lng: -87.63,
    power: 0.7,
    ai: 0.7,
    growth: 0.72,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named global cluster (Fig. 1.13)",
      pipeline: "Established Midwest hub",
      grid: "MISO / PJM seam",
      ai: "Named on IEA’s global cluster map",
    },
    grid: { name: "MISO / PJM", lat: 41.2, lng: -89.4 },
  },
  {
    id: "phoenix",
    name: "Phoenix",
    region: "United States",
    lat: 33.45,
    lng: -112.07,
    power: 0.58,
    ai: 0.62,
    growth: 0.76,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named among the ten largest US hubs",
      pipeline: "Named on IEA US pipeline map (Fig. 2.29)",
      grid: "Southwest / desert interconnection",
      ai: "Documented US hub, not a live AI-share reading",
    },
    grid: { name: "Southwest grid", lat: 34.6, lng: -113.4 },
  },
  {
    id: "sanjose",
    name: "San Jose",
    region: "United States",
    lat: 37.34,
    lng: -121.89,
    power: 0.55,
    ai: 0.74,
    growth: 0.5,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named US hub",
      pipeline: "IEA notes Santa Clara-area constraints / moratoriums",
      grid: "CAISO",
      ai: "Bay Area hub; grid-constrained rather than greenfield",
    },
    grid: { name: "CAISO", lat: 36.7, lng: -119.8 },
  },
  {
    id: "atlanta",
    name: "Atlanta",
    region: "United States",
    lat: 33.75,
    lng: -84.39,
    power: 0.56,
    ai: 0.58,
    growth: 0.7,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named among the ten largest US hubs",
      pipeline: "Named on IEA US pipeline map",
      grid: "Southeastern interconnection",
      ai: "Documented US hub",
    },
    grid: { name: "Southeast grid", lat: 33.9, lng: -82.4 },
  },
  {
    id: "columbus",
    name: "Columbus",
    region: "United States",
    lat: 39.96,
    lng: -82.99,
    power: 0.52,
    ai: 0.68,
    growth: 0.78,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named US hub",
      pipeline: "Named on IEA US pipeline map (Fig. 2.29)",
      grid: "PJM Midwest",
      ai: "Documented inland US hub",
    },
    grid: { name: "PJM Midwest", lat: 40.4, lng: -81.2 },
  },
  {
    id: "omaha",
    name: "Omaha",
    region: "United States",
    lat: 41.26,
    lng: -95.93,
    power: 0.44,
    ai: 0.48,
    growth: 0.55,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named on both global and US cluster maps",
      pipeline: "Named US hub",
      grid: "Southwest Power Pool",
      ai: "Named cluster; no IEA AI-share split",
    },
    grid: { name: "SPP", lat: 40.6, lng: -97.4 },
  },
  {
    id: "desmoines",
    name: "Des Moines",
    region: "United States",
    lat: 41.59,
    lng: -93.62,
    power: 0.42,
    ai: 0.5,
    growth: 0.58,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named US hub (Fig. 2.29)",
      pipeline: "Named US hub",
      grid: "MISO",
      ai: "Named cluster",
    },
    grid: { name: "MISO", lat: 41.9, lng: -91.7 },
  },
  {
    id: "slc",
    name: "Salt Lake City",
    region: "United States",
    lat: 40.76,
    lng: -111.89,
    power: 0.4,
    ai: 0.42,
    growth: 0.52,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named US hub (Fig. 2.29)",
      pipeline: "Named US hub",
      grid: "Western interconnection",
      ai: "Named cluster",
    },
    grid: { name: "West grid", lat: 40.4, lng: -110.2 },
  },
  {
    id: "dublin",
    name: "Dublin",
    region: "Ireland",
    lat: 53.35,
    lng: -6.26,
    power: 0.6,
    ai: 0.72,
    growth: 0.35,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named global cluster",
      pipeline: "IEA: Dublin connections paused until 2030",
      grid: "EirGrid · ~20% of Ireland’s metered electricity to data centres",
      ai: "Extreme local grid share, not a live AI meter",
    },
    grid: { name: "EirGrid", lat: 53.2, lng: -8.2 },
  },
  {
    id: "london",
    name: "London",
    region: "United Kingdom",
    lat: 51.51,
    lng: -0.13,
    power: 0.58,
    ai: 0.55,
    growth: 0.48,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named global cluster (Fig. 1.13)",
      pipeline: "UK queues 5-7 years (IEA table 2.4)",
      grid: "Great Britain transmission",
      ai: "Named European hub",
    },
    grid: { name: "GB grid", lat: 52.4, lng: -1.5 },
  },
  {
    id: "beijing",
    name: "Beijing",
    region: "China",
    lat: 39.9,
    lng: 116.4,
    power: 0.8,
    ai: 0.88,
    growth: 0.86,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named among the ten largest global clusters",
      pipeline: "China is 25% of 2024 DC electricity; ~170% growth to 2030 (IEA)",
      grid: "North China grid",
      ai: "IEA names China as the second-largest DC electricity market",
    },
    grid: { name: "North China grid", lat: 40.6, lng: 114.2 },
  },
  {
    id: "shanghai",
    name: "Shanghai",
    region: "China",
    lat: 31.23,
    lng: 121.47,
    power: 0.76,
    ai: 0.86,
    growth: 0.82,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named global cluster (Fig. 1.13)",
      pipeline: "East-China coastal hub",
      grid: "East China grid",
      ai: "Named Chinese hub on IEA global map",
    },
    grid: { name: "East China grid", lat: 32.1, lng: 119.4 },
  },
  {
    id: "prd",
    name: "Pearl River Delta",
    region: "China",
    lat: 22.55,
    lng: 113.9,
    power: 0.74,
    ai: 0.8,
    growth: 0.8,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA: combined Guangzhou, Shenzhen and Hong Kong",
      pipeline: "Named among the ten largest global clusters",
      grid: "China Southern grid",
      ai: "Named Chinese hub",
    },
    grid: { name: "China Southern grid", lat: 23.4, lng: 112.4 },
  },
  {
    id: "singapore",
    name: "Singapore",
    region: "Southeast Asia",
    lat: 1.35,
    lng: 103.82,
    power: 0.62,
    ai: 0.78,
    growth: 0.64,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA-named global cluster",
      pipeline: "IEA notes moratorium history; SEA demand more than doubles by 2030",
      grid: "Singapore / Johor regional hub",
      ai: "IEA’s named Southeast Asian hub",
    },
    grid: { name: "Singapore grid", lat: 1.9, lng: 103.4 },
  },
  {
    id: "johor",
    name: "Johor",
    region: "Malaysia",
    lat: 1.48,
    lng: 103.76,
    power: 0.48,
    ai: 0.7,
    growth: 0.8,
    facts: {
      role: "Data-centre cluster",
      capacity: "IEA: southern Malaysia hub with Singapore",
      pipeline: "Malaysia queues <3 years (IEA table 2.4); SEA doubles by 2030",
      grid: "Peninsular Malaysia",
      ai: "Named with Singapore as the regional hub",
    },
    grid: { name: "Peninsular grid", lat: 2.4, lng: 102.9 },
  },
];

export const AI_FOCUS_IDS = new Set([
  "nva",
  "dallas",
  "columbus",
  "sanjose",
  "beijing",
  "shanghai",
  "prd",
  "singapore",
  "johor",
  "dublin",
]);

export function lerpView(a, b, t) {
  const e = t * t * (3 - 2 * t);
  return {
    x: a.x + (b.x - a.x) * e,
    y: a.y + (b.y - a.y) * e,
    w: a.w + (b.w - a.w) * e,
    h: a.h + (b.h - a.h) * e,
  };
}
