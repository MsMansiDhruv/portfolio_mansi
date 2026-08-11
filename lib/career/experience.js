/**
 * Single source of truth for professional experience duration.
 * Career began as Software Engineer in 2019 (2018 internship excluded).
 */

export const PROFESSIONAL_CAREER_START = {
  year: 2019,
  month: 1,
  day: 1,
};

/** Full years elapsed since professional career start (partial years floored). */
export function getProfessionalExperienceYears(asOf = new Date()) {
  const start = new Date(
    PROFESSIONAL_CAREER_START.year,
    PROFESSIONAL_CAREER_START.month - 1,
    PROFESSIONAL_CAREER_START.day
  );

  let years = asOf.getFullYear() - start.getFullYear();
  const monthDiff = asOf.getMonth() - start.getMonth();
  const dayDiff = asOf.getDate() - start.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years -= 1;
  }

  return Math.max(0, years);
}

/** e.g. "7+" */
export function getExperienceYearsLabel(asOf = new Date()) {
  return `${getProfessionalExperienceYears(asOf)}+`;
}

/** e.g. "7+ years" */
export function getExperienceYearsText(asOf = new Date()) {
  return `${getExperienceYearsLabel(asOf)} years`;
}

/** e.g. "7+ years experience" */
export function getExperienceYearsExperienceText(asOf = new Date()) {
  return `${getExperienceYearsLabel(asOf)} years experience`;
}

/** e.g. "7+ YEARS" — profile badge label */
export function getExperienceYearsBadge(asOf = new Date()) {
  return `${getProfessionalExperienceYears(asOf)}+ YEARS`;
}
