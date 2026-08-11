/**
 * Legacy adapter for marquee component.
 */
import { RECOMMENDATIONS, LINKEDIN_PROFILE_URL, getRecommendationText } from "@/lib/data/recommendations";

export { LINKEDIN_PROFILE_URL };

export const TESTIMONIALS = RECOMMENDATIONS.map((rec) => ({
  id: rec.id,
  name: rec.name,
  title: rec.relationship || rec.designation || "",
  text: getRecommendationText(rec),
  sourceUrl: rec.linkedinUrl,
}));
