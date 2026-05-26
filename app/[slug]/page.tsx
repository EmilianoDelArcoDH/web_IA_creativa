import { notFound } from "next/navigation";
import { ActivityClient } from "@/components/activity-client";
import { getActivity, normalizeLanguage } from "@/lib/activities";

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const language = normalizeLanguage(lang);
  const activity = getActivity(slug, language);

  if (!activity) {
    notFound();
  }

  return <ActivityClient activity={activity} language={language} />;
}
