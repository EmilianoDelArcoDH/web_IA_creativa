import { notFound } from "next/navigation";
import { ActivityClient } from "@/components/activity-client";
import { getActivity } from "@/lib/activities";

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = getActivity(slug);

  if (!activity) {
    notFound();
  }

  return <ActivityClient activity={activity} />;
}
