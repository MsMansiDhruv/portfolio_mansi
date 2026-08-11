/**
 * LinkedIn recommendations — editable source of truth for /credentials.
 *
 * Recommendations are manually synced from LinkedIn to preserve the complete
 * original wording. This is NOT a live LinkedIn API integration.
 *
 * Attribution fields (name, designation, company) are kept for source records
 * but hidden from the public UI unless showIdentity is true.
 */

export const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/mansidhruv/";

/** @type {Array<{id:string,name:string,designation?:string,company?:string,relationship?:string,date?:string,text:string,linkedinUrl?:string,source?:string,showIdentity?:boolean,featured?:boolean}>} */
export const RECOMMENDATIONS = [
  {
    id: "rec-ajinkya-patil",
    name: "Ajinkya Patil",
    designation: "Head of Data & Insights | Leading Analytics & ML Transformation | BFSI",
    relationship: "Client",
    date: "July 13, 2026",
    text:
      "Had worked with Mansi for almost a year on a project- During the initial phases of the project, Mansi\u2019s inputs in designing the AWS architecture and setting up the foundational framework helped establish the right direction for the program. As the project progressed, she also took on the role of project manager and ensured effective coordination across the team and stakeholders.\nYour ability to balance both technical and project management responsibilities played an important role in keeping the project on track.\nThank you for your support and commitment throughout the project.",
    linkedinUrl: LINKEDIN_PROFILE_URL,
    source: "LinkedIn",
    showIdentity: false,
    featured: true,
  },
  {
    id: "rec-madhavi",
    name: "Madhavi Solanki",
    designation:
      "Engineering Leader Building Employer of Record (EOR) Systems | Cross-Border Hiring | Payroll & Compliance Infrastructure",
    company: "Cyphertree",
    relationship: "Managed Mansi directly",
    date: "March 4, 2025",
    text:
      "I had the pleasure of working with Mansi Dhruv at Cyphertree, and I can confidently say that she is one of the most hardworking and thoughtful professionals I\u2019ve come across. She is highly collaborative, always bringing a problem-solving mindset to the table, and she never loses sight of the bigger picture.\n\nWhat truly sets Mansi apart is her ability to engage in meaningful discussions\u2014whether it\u2019s about work challenges or broader strategic thinking, conversations with her are always insightful. She approaches every task with dedication and a strong sense of ownership, making her an invaluable team member.\n\nAny team would be lucky to have Mansi, and I wholeheartedly recommend her!",
    linkedinUrl: LINKEDIN_PROFILE_URL,
    source: "LinkedIn",
    showIdentity: false,
  },
  {
    id: "rec-vinit",
    name: "Vinit Kumar",
    designation: "Principal Backend Engineer | Distributed Systems | Go, Python, TypeScript | Django CMS Fellow",
    company: "Cyphertee",
    relationship: "Senior colleague; did not manage Mansi directly",
    date: "December 22, 2023",
    text:
      "I Interviewed Mansi for her first Python/Django role at Cyphertee and was impressed by her approach and maturity even when she had less experience. She is a capable Software Engineer who knows her stack well and can think creatively when required. The best thing about her is the attitude to learn anything and not giving up. She also communicates well and is a pleasant person to work with. I highly recommend her to any team looking for a gifted Python developer who can easily work on Back-end, AI/NL, or Ops.",
    linkedinUrl: LINKEDIN_PROFILE_URL,
    source: "LinkedIn",
    showIdentity: false,
  },
  {
    id: "rec-mrinmoy",
    name: "Mrinmoy Sarkar",
    designation:
      "Looking for remote/ Hybrid roles | Full Stack Engineer with specific liking towards frontend @Qure AI | React.js,Vue JS, Django, Node JS, Python, SQL, AWS checkout mrinmoysarkar.vercel.app",
    company: "Qure AI",
    relationship: "Worked on the same team",
    date: "December 22, 2023",
    text:
      "Mansi has deep understanding of core aspects of CS. Her practical no nonsense approach towards problem solving makes it a joy to work with her. We worked in same team for 2.5 years where she was meticulously handling the backend of a US based media giant while also enabling me to be better at backend technologies like Django, AWS, SQL. She is a humble team player which is rare to find these days. Given an opportunity will definitely would want to work with her again.",
    linkedinUrl: LINKEDIN_PROFILE_URL,
    source: "LinkedIn",
    showIdentity: false,
  },
  {
    id: "rec-vishal",
    name: "Vishal Chandale",
    designation: "Selenium WebDriver | Framework Design | Core Java | Rest assured | Cypress | Protractor | BDD | CICD",
    relationship: "Colleague",
    date: "November 16, 2021",
    text:
      "Mansi has very good knowledge on python,  react, backend , api, web scrapping as well as she worked on UI part as well. As a colleague she is great person and have helpful nature. She is must have in your team.",
    linkedinUrl: LINKEDIN_PROFILE_URL,
    source: "LinkedIn",
    showIdentity: false,
  },
];

/** @deprecated Use `text` — kept for legacy imports */
export const getRecommendationText = (rec) => rec.text ?? rec.quote ?? "";
