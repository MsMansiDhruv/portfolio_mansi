import {
  getExperienceYearsBadge,
  getExperienceYearsText,
  PROFESSIONAL_CAREER_START,
} from "@/lib/career/experience";

export { PROFESSIONAL_CAREER_START };

export const CURRENT_ROLE = "Lead Data Engineer";

export function getAboutHeroLine(asOf = new Date()) {
  return `${getExperienceYearsText(asOf)} building data platforms, production pipelines, and cloud systems across data engineering and applied ML.`;
}

export function getAboutBadges(asOf = new Date()) {
  return [
    getExperienceYearsBadge(asOf),
    CURRENT_ROLE.toUpperCase(),
    "AWS CERTIFIED",
    "DATA ENGINEERING",
    "CLOUD",
    "ML SYSTEMS",
  ];
}

/** Dot-separated metadata line — excludes years (shown in hero + at a glance only) */
export function getAboutMetadataLine() {
  return [
    CURRENT_ROLE.toUpperCase(),
    "AWS CERTIFIED",
    "DATA ENGINEERING",
    "CLOUD",
    "ML SYSTEMS",
  ].join(" · ");
}

export function getAtAGlance(asOf = new Date()) {
  return {
    experience: getExperienceYearsText(asOf),
    role: CURRENT_ROLE,
    cloud: "AWS",
    languages: "Python · Scala · SQL · Spark",
    domains: "Data Platforms · Cloud · MLOps",
  };
}

/** Narrative "about me" paragraphs — beyond the dynamic hero line */
export const ABOUT_ME = [
  "Lead Data Engineer focused on reliable data platforms—from ingestion and transformation through governed analytics and BI.",
  "I enjoy platforms where architecture, incremental delivery, and operability meet—lakehouse patterns, governed pipelines, and analytics surfaces teams can trust.",
];

/** Career timeline — newest first; employment dates unchanged */
export const CAREER_TIMELINE = [
  {
    id: "t1",
    year: "2025",
    title: "Lead Data Engineer",
    desc: "Led a cross-functional data team, owning architecture decisions and mentoring engineers across delivery and design.",
    focus: "Architecture · Team leadership · Data platforms",
  },
  {
    id: "t2",
    year: "2023",
    title: "Senior Data Engineer",
    desc: "Drove end-to-end data initiatives, collaborating with product and analytics while guiding junior engineers.",
    focus: "End-to-end delivery · Product collaboration · Mentoring",
  },
  {
    id: "t3",
    year: "2021",
    title: "Data Engineer",
    desc: "Transitioned into data engineering, building scalable pipelines using Databricks, PySpark, and cloud data platforms.",
    focus: "Scalable pipelines · Databricks · PySpark",
  },
  {
    id: "t4",
    year: "2019",
    title: "Software Engineer",
    desc: "Developed web and backend systems with a focus on high-reliability payment gateway integrations.",
    focus: "Web and backend systems · Payment integrations",
  },
  {
    id: "t5",
    year: "2018",
    title: "Intern",
    desc: "Built iOS and web applications for Bemrr and Gujarat Police, gaining hands-on experience in production systems.",
    focus: "iOS and web applications · Production systems",
  },
];

/** Compact progression for homepage — dates, roles, and engineering focus (newest first) */
export const EXPERIENCE_SNAPSHOT = [
  {
    year: "2025+",
    title: "Lead Data Engineer",
    focus: "Architecture and platform leadership",
  },
  {
    year: "2023",
    title: "Senior Data Engineer",
    focus: "End-to-end data delivery and mentoring",
  },
  {
    year: "2021",
    title: "Data Engineer",
    focus: "Scalable pipelines and cloud data platforms",
  },
  {
    year: "2019",
    title: "Software Engineer",
    focus: "Application and backend systems",
  },
];

export const CERTIFICATIONS = [
  {
    id: "aws-clf",
    title: "AWS Certified Cloud Practitioner",
    org: "AWS",
    issued: "2023",
    tier: "primary",
    category: "Cloud",
    link: "https://cp.certmetrics.com/amazon/en/public/verify/credential/",
    verified: true,
  },
  // REVIEW: present in portfolio with verification URL; not in indexed LinkedIn cert list (Aug 2026).
  {
    id: "sql-data",
    title: "SQL for Data Analysis and Data Science",
    org: "Udemy",
    issued: "2024",
    tier: "learning",
    category: "Data engineering",
    link: "https://www.udemy.com/certificate/UC-a6a6cbcf-d2b6-4b93-925e-0bcf1e777205/",
  },
  {
    id: "etl-databricks",
    title: "Building Your First ETL Pipeline Using Azure Databricks",
    org: "Pluralsight",
    issued: "Feb 2022",
    tier: "professional",
    category: "Data engineering",
  },
  {
    id: "pyspark-analysis",
    title: "Set up PySpark for Data Analysis",
    org: "Pluralsight",
    issued: "Feb 2022",
    tier: "professional",
    category: "Data engineering",
  },
  {
    id: "spark-bigdata",
    title: "Big Data Analytics using Spark",
    org: "edX",
    issued: "Dec 2021",
    tier: "professional",
    category: "Distributed systems",
  },
  {
    id: "ds-python",
    title: "Data Structures with Python",
    org: "Udemy",
    issued: "Mar 2021",
    tier: "learning",
    category: "Programming & ML",
  },
  {
    id: "django",
    title: "Django 2.2 Web Development with Python 3.6",
    org: "Udemy",
    issued: "Oct 2020",
    tier: "learning",
    category: "Programming & ML",
  },
  {
    id: "ml-python",
    title: "Machine Learning Using Python",
    org: "Udemy",
    issued: "Sep 2020",
    tier: "learning",
    category: "Programming & ML",
    link: "https://www.udemy.com/certificate/UC-98742817-dfc1-415d-be88-c70c692ff871/",
  },
  {
    id: "docker-ess",
    title: "Docker Essentials",
    org: "Udemy",
    issued: "Dec 2019",
    tier: "learning",
    category: "Cloud",
    link: "https://www.udemy.com/certificate/UC-XNDH2JI1/",
  },
  {
    id: "node-js",
    title: "Node JS",
    org: "Udemy",
    issued: "Jul 2018",
    tier: "learning",
    category: "Programming & ML",
  },
  {
    id: "ai-website",
    title: "Artificial Intelligence Website Creation 2018 (No Coding)",
    org: "Udemy",
    issued: "Jun 2018",
    tier: "learning",
    category: "Programming & ML",
  },
  {
    id: "big-data",
    title: "Big Data Training",
    org: "Udemy",
    issued: "Jun 2018",
    tier: "learning",
    category: "Data engineering",
    link: "https://www.udemy.com/certificate/UC-X0AU2IFK/",
  },
];

/** Group all certifications by category for credentials UI */
export function groupCertificationsByCategory(certs = CERTIFICATIONS) {
  const groups = new Map();

  for (const cert of certs) {
    const key = cert.category || "Learning";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(cert);
  }

  return groups;
}

/** @deprecated Use groupCertificationsByCategory */
export function groupLearningCertifications(certs = CERTIFICATIONS) {
  return groupCertificationsByCategory(certs.filter((c) => c.tier !== "primary"));
}

export const LINKEDIN_AWARDS_URL = "https://www.linkedin.com/in/mansidhruv/details/honors-awards/";

export const AWARDS = [
  {
    id: "value-able-2024",
    title: "Value-able Award",
    org: "SG Analytics",
    year: "Jul 2024",
    summary:
      "Played pivotal role in establishing the foundation for a client. This instilled confidence in client leading them to bring new business.",
    sourceUrl: LINKEDIN_AWARDS_URL,
  },
  {
    id: "gem-2023",
    title: "GEM Award",
    org: "SG Analytics",
    year: "Mar 2023",
    summary:
      "Received GEM Award for delivering exceptional business value while going extra mile for customer satisfaction.",
    sourceUrl: LINKEDIN_AWARDS_URL,
  },
  {
    id: "merit-2019",
    title: "Merit Based Scholarship",
    org: "AESICS",
    year: "Sep 2019",
    summary: "Awarded Full Year Merit Based Scholarship",
    sourceUrl: LINKEDIN_AWARDS_URL,
  },
  {
    id: "innovative-project-2018",
    title: 'Special mention for "Innovating Project"',
    org: "AESICS",
    year: "Oct 2018",
    summary:
      'Awarded Special mention for “Innovative Project” in ACM-W Third National Level Hackathon.',
    sourceUrl: LINKEDIN_AWARDS_URL,
    // REVIEW: LinkedIn lists org as AESICS; hackathon name appears in description only.
  },
  {
    id: "ghci-2018",
    title: "Student Scholarship from Grace Hopper Celebrations India",
    org: "Grace Hopper Celebrations India",
    year: "Oct 2018",
    summary:
      "Awarded Student Scholarship from Grace Hopper Celebrations India (GHCI – 18), India’s largest technical conference for women in computing and technology.",
    sourceUrl: LINKEDIN_AWARDS_URL,
  },
];

export const FEATURED_RECOGNITION = AWARDS.find((a) => a.id === "gem-2023");

/** @deprecated Use getAboutHeroLine() for dynamic experience years */
export const ABOUT_INTRO = getAboutHeroLine();
