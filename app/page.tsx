import Link from "next/link";
import { activities } from "@/lib/activities";

export default function HomePage() {
  return (
    <main className="shell">
      <span className="eyebrow">Web e IA Creativa</span>
      <h1 className="hero-title">Actividades con criterio, no respuestas automaticas.</h1>
      <p className="lead">
        Cada clase guia el proceso paso a paso. Al enviar, el Playground recibe si la actividad esta completa o que falta revisar.
      </p>

      <section className="home-grid" aria-label="Actividades">
        {activities.map((activity) => (
          <Link className="home-card" href={`/${activity.slug}`} key={activity.id}>
            <span>{activity.eyebrow}</span>
            <h2>{activity.title}</h2>
          </Link>
        ))}
      </section>
    </main>
  );
}
