"use client";

import { useEffect, useMemo, useState } from "react";
import type { Activity, ActivityField, Language } from "@/lib/activities";
import { PGEvent } from "@/lib/pg-event";

type ValidationResponse = {
  event: "SUCCESS" | "FAILURE";
  reasons: string[];
  message: string;
  state: string;
  suggestions?: string[];
};

function emptyAnswers(activity: Activity) {
  return Object.fromEntries(
    activity.sections.flatMap((section) => section.fields.map((field) => [field.name, ""])),
  ) as Record<string, string>;
}

function uiText(language: Language) {
  return {
    es: {
      select: "Seleccionar",
      submit: "Enviar actividad",
      reviewing: "Revisando...",
      reset: "Reiniciar",
      delivery: "Entrega",
      ordered: "Tus respuestas se ordenan aca mientras trabajas.",
      complete: "Actividad completa.",
      fallbackReason: "No se pudo revisar la actividad en este momento.",
      fallbackMessage: "Hubo un problema al validar la actividad.",
    },
    en: {
      select: "Select",
      submit: "Submit activity",
      reviewing: "Reviewing...",
      reset: "Reset",
      delivery: "Submission",
      ordered: "Your answers will be organized here while you work.",
      complete: "Activity complete.",
      fallbackReason: "The activity could not be reviewed right now.",
      fallbackMessage: "There was a problem validating the activity.",
    },
    pt: {
      select: "Selecionar",
      submit: "Enviar atividade",
      reviewing: "Revisando...",
      reset: "Reiniciar",
      delivery: "Entrega",
      ordered: "Suas respostas vao sendo organizadas aqui enquanto voce trabalha.",
      complete: "Atividade completa.",
      fallbackReason: "Nao foi possivel revisar a atividade neste momento.",
      fallbackMessage: "Houve um problema ao validar a atividade.",
    },
  }[language];
}

function FieldControl({
  field,
  value,
  language,
  onChange,
}: {
  field: ActivityField;
  value: string;
  language: Language;
  onChange: (value: string) => void;
}) {
  const id = `field-${field.name}`;

  return (
    <div className="field">
      <label htmlFor={id}>{field.label}</label>
      {field.help ? <small>{field.help}</small> : null}
      {field.type === "select" ? (
        <select className="select" id={id} value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">{uiText(language).select}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          className="textarea"
          id={id}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="control"
          id={id}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}

export function ActivityClient({ activity, language }: { activity: Activity; language: Language }) {
  const storageKey = `webIaCreativa.next.${activity.id}.${language}`;
  const [answers, setAnswers] = useState<Record<string, string>>(() => emptyAnswers(activity));
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const pgEvent = useMemo(() => new PGEvent(), []);
  const text = uiText(language);

  useEffect(() => {
    pgEvent.getValues();
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setAnswers({ ...emptyAnswers(activity), ...JSON.parse(saved) });
    } else {
      setAnswers(emptyAnswers(activity));
    }
  }, [activity, pgEvent, storageKey]);

  function updateAnswer(name: string, value: string) {
    setAnswers((current) => {
      const next = { ...current, [name]: value };
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
    setResult(null);
  }

  async function submitActivity() {
    setIsSending(true);
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: activity.id, answers, language }),
      });
      const payload = (await response.json()) as ValidationResponse;
      setResult(payload);
      pgEvent.postToPg({
        event: payload.event,
        reasons: payload.reasons,
        message: payload.message,
        state: payload.state,
        feedbackLanguage: language,
        submissionLanguage: language,
        submission: answers,
      });
    } catch {
      const fallback: ValidationResponse = {
        event: "FAILURE",
        reasons: [text.fallbackReason],
        message: text.fallbackMessage,
        state: JSON.stringify({ activity: activity.id, completed: false, language }),
      };
      setResult(fallback);
      pgEvent.postToPg({
        ...fallback,
        feedbackLanguage: language,
        submissionLanguage: language,
        submission: answers,
      });
    } finally {
      setIsSending(false);
    }
  }

  function resetActivity() {
    const next = emptyAnswers(activity);
    setAnswers(next);
    setResult(null);
    window.localStorage.removeItem(storageKey);
  }

  const preview = Object.entries(answers)
    .filter(([, value]) => value.trim())
    .slice(0, 8)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n\n");

  return (
    <main className="shell">
      <span className="eyebrow">{activity.eyebrow}</span>
      <h1 className="hero-title">{activity.title}</h1>
      <p className="lead">{activity.lead}</p>

      <section className="activity-layout">
        <form className="panel" onSubmit={(event) => event.preventDefault()}>
          {activity.sections.map((section) => (
            <article className="field-card" key={section.title}>
              <h2>{section.title}</h2>
              {section.intro ? <p>{section.intro}</p> : null}
              <div className={section.grid || undefined}>
                {section.fields.map((field) => (
                  <FieldControl
                    field={field}
                    key={field.name}
                    language={language}
                    value={answers[field.name] || ""}
                    onChange={(value) => updateAnswer(field.name, value)}
                  />
                ))}
              </div>
            </article>
          ))}
        </form>

        <aside className="side-panel">
          <span className="chip">{text.delivery}</span>
          <h2>{activity.sideTitle}</h2>
          {activity.sideCopy.map((copy) => (
            <p key={copy}>{copy}</p>
          ))}

          <div className="preview-box">{preview || text.ordered}</div>

          <div className="actions">
            <button className="button" type="button" onClick={submitActivity} disabled={isSending}>
              {isSending ? text.reviewing : text.submit}
            </button>
            <button className="button secondary" type="button" onClick={resetActivity}>
              {text.reset}
            </button>
          </div>

          {result ? (
            <>
              <div className={`status ${result.event === "SUCCESS" ? "ok" : "bad"}`}>{result.message}</div>
              <div className="feedback">
                {(result.reasons.length ? result.reasons : [text.complete]).map((reason) => (
                  <div className={`feedback-item ${result.event === "SUCCESS" ? "ok" : "bad"}`} key={reason}>
                    {reason}
                  </div>
                ))}
                {result.suggestions?.map((suggestion) => (
                  <div className="feedback-item" key={suggestion}>
                    {suggestion}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
