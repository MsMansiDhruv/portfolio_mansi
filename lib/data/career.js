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
    year: 2023,
    link: "https://cp.certmetrics.com/amazon/en/public/verify/credential/",
    verified: true,
  },
  {
    id: "sql-data",
    title: "SQL for Data Analysis and Data Science",
    org: "Udemy",
    year: 2024,
    link: "https://www.udemy.com/certificate/UC-a6a6cbcf-d2b6-4b93-925e-0bcf1e777205/",
  },
  {
    id: "etl",
    title: "Building Your First ETL Pipeline Using Azure Databricks",
    org: "Pluralsight",
    year: 2022,
  },
  {
    id: "spark-bigdata",
    title: "Big Data Analytics using Spark",
    org: "edX",
    year: 2021,
  },
  {
    id: "ml-python",
    title: "Machine Learning using Python",
    org: "Udemy",
    year: 2020,
    link: "https://www.udemy.com/certificate/UC-98742817-dfc1-415d-be88-c70c692ff871/",
  },
  {
    id: "docker-ess",
    title: "Docker Essentials",
    org: "Udemy",
    year: 2019,
    link: "https://www.udemy.com/certificate/UC-XNDH2JI1/",
  },
  {
    id: "big-data",
    title: "Big Data Training",
    org: "Udemy",
    year: 2018,
    link: "https://www.udemy.com/certificate/UC-X0AU2IFK/",
  },
];

export const AWARDS = [
  {
    id: "value-able-2024",
    title: "Value-able Award",
    org: "SG Analytics",
    year: "Jul 2024",
    summary:
      "Recognized for technical leadership and delivery quality on a confidential client engagement.",
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
  {
    id: "gem-2023",
    title: "GEM Award",
    org: "SG Analytics",
    year: "Mar 2023",
    summary:
      "Received GEM Award for delivering exceptional business value while going extra mile for customer satisfaction.",
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
  {
    id: "merit-2019",
    title: "Merit Based Scholarship",
    org: "AESICS",
    year: "Sep 2019",
    summary:
      "Received a full-year Merit-Based Scholarship in recognition of outstanding academic performance for 2019–2020.",
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
  {
    id: "innovative-project-2018",
    title: 'Special mention - "Innovative Project"',
    org: "ACM-W Third National Level Hackathon",
    year: "Oct 2018",
    summary:
      'Awarded Special mention for “Innovative Project” in ACM-W Third National Level Hackathon.',
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
  {
    id: "ghci-2018",
    title: "Student Scholarship - Grace Hopper Celebrations India",
    org: "Grace Hopper Celebrations India",
    year: "Oct 2018",
    summary:
      "Awarded Student Scholarship from Grace Hopper Celebrations India (GHCI – 18).",
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
];

export const FEATURED_RECOGNITION = AWARDS.find((a) => a.id === "gem-2023");

/** @deprecated Use getAboutHeroLine() for dynamic experience years */
export const ABOUT_INTRO = getAboutHeroLine();
