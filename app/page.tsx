import Link from "next/link";
import { activities, normalizeLanguage } from "@/lib/activities";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const language = normalizeLanguage(lang);
  return (
    <main className="shell">
      <span className="eyebrow">Web e IA Creativa</span>
      <h1 className="hero-title">Actividades con criterio, no respuestas automaticas.</h1>
      <p className="lead">
        Cada clase guia el proceso paso a paso. Al enviar, el Playground recibe si la actividad esta completa o que falta revisar.
      </p>

      <section className="home-grid" aria-label="Actividades">
        {activities.map((activity) => (
          <Link className="home-card" href={`/${activity.slug}?lang=${language}`} key={activity.id}>
            <span>{activity.eyebrow}</span>
            <h2>{activity.title}</h2>
          </Link>
        ))}
      </section>
    </main>
  );
}
