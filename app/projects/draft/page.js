import { notFound } from "next/navigation";
import WorkExhibition from "@/components/work/WorkExhibition";
import { showDraftWork } from "@/lib/data/work-visibility";

export const metadata = {
  title: "Draft work",
  robots: { index: false, follow: false },
};

/** Unpublished catalog. 404 on production so it never ships live. */
export default function DraftWorkPage() {
  if (!showDraftWork()) notFound();
  return <WorkExhibition draftOnly />;
}
