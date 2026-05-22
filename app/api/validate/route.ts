import { NextRequest, NextResponse } from "next/server";
import { activities } from "@/lib/activities";

type Answers = Record<string, string>;

type ValidationResult = {
  event: "SUCCESS" | "FAILURE";
  reasons: string[];
  message: string;
  state: string;
  suggestions?: string[];
};

const commonStopWords = new Set([
  "para",
  "con",
  "que",
  "una",
  "uno",
  "por",
  "del",
  "las",
  "los",
  "como",
  "este",
  "esta",
  "porque",
  "mejorar",
]);

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function words(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[a-z0-9#]+/g) || [];
}

function looksLikeKeyboardTrash(text: string) {
  const compact = text.toLowerCase().replace(/\s+/g, "");
  if (!compact) return true;
  const letters = compact.replace(/[^a-z]/g, "");
  if (letters.length >= 12) {
    const vowels = (letters.match(/[aeiou]/g) || []).length;
    const vowelRatio = vowels / letters.length;
    if (vowelRatio < 0.18 || vowelRatio > 0.82) return true;
  }
  if (/(.)\1{5,}/.test(compact)) return true;
  if (/(asdf|qwer|zxcv|hjkl|ñlk|kkn|dsf|fgh|jkl){2,}/i.test(compact)) return true;
  return false;
}

function hasMeaningfulText(text: string, minWords = 4) {
  const list = words(text).filter((word) => word.length > 2 && !commonStopWords.has(word));
  const unique = new Set(list);
  return text.length >= 12 && list.length >= minWords && unique.size >= Math.min(minWords, 3) && !looksLikeKeyboardTrash(text);
}

function requireField(reasons: string[], answers: Answers, name: string, label: string, minWords = 4) {
  if (!hasMeaningfulText(normalize(answers[name]), minWords)) {
    reasons.push(`${label}: la respuesta parece incompleta o no tiene sentido suficiente.`);
  }
}

function requireSelect(reasons: string[], answers: Answers, name: string, label: string) {
  if (!normalize(answers[name])) {
    reasons.push(`${label}: falta seleccionar una opcion.`);
  }
}

function requireHex(reasons: string[], value: string, label: string) {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
    reasons.push(`${label}: debe ser un color HEX valido.`);
  }
}

function localValidate(activityId: string, answers: Answers) {
  const reasons: string[] = [];

  if (activityId === "clase-1-tu-primer-prompt") {
    requireField(reasons, answers, "topic", "Tema", 2);
    requireField(reasons, answers, "context", "Contexto de uso", 3);
    requireField(reasons, answers, "prompt", "Prompt completo", 18);
    const prompt = normalize(answers.prompt).toLowerCase();
    if (!/(audiencia|para|dirigido|estilo|visual|contexto|formato|uso)/i.test(prompt)) {
      reasons.push("Prompt completo: falta explicitar destinatario, estilo visual, contexto o formato.");
    }
    const resultCount = ["result1", "result2", "result3", "result4", "result5"].filter((key) =>
      hasMeaningfulText(normalize(answers[key]), 3),
    ).length;
    if (resultCount < 3) reasons.push("Resultados de la IA: registra al menos 3 resultados reales.");
    requireField(reasons, answers, "analysis", "Analisis", 18);
    if (!/(elijo|elegi|elegí|final|porque|funciono|funcionó|cambiaria|cambiaría)/i.test(normalize(answers.analysis))) {
      reasons.push("Analisis: falta una eleccion final justificada.");
    }
  }

  if (activityId === "clase-2-bloque-web") {
    requireField(reasons, answers, "project", "Proyecto", 2);
    for (let index = 1; index <= 5; index++) requireField(reasons, answers, `title${index}`, `Titulo ${index}`, 2);
    requireField(reasons, answers, "titleFinal", "Titulo elegido", 3);
    for (let index = 1; index <= 3; index++) requireField(reasons, answers, `subtitle${index}`, `Subtitulo ${index}`, 5);
    requireField(reasons, answers, "subtitleFinal", "Subtitulo final", 8);
    for (let index = 1; index <= 3; index++) {
      requireField(reasons, answers, `benefit${index}`, `Beneficio ${index}`, 4);
      requireSelect(reasons, answers, `benefit${index}Light`, `Semaforo ${index}`);
    }
    for (let index = 1; index <= 5; index++) requireField(reasons, answers, `cta${index}`, `CTA ${index}`, 1);
    requireField(reasons, answers, "ctaFinal", "CTA elegido", 1);
    requireField(reasons, answers, "ctaAction", "Accion del clic", 5);
    requireField(reasons, answers, "coherence", "Revision final", 12);
  }

  if (activityId === "clase-3-identidad-visual") {
    requireField(reasons, answers, "audience", "Audiencia", 6);
    requireField(reasons, answers, "context", "Contexto", 6);
    requireField(reasons, answers, "mood", "Mood", 5);
    requireField(reasons, answers, "heroPrompt", "Prompt de hero", 18);
    requireHex(reasons, normalize(answers.color1), "Color de fondo");
    requireHex(reasons, normalize(answers.color2), "Color de texto");
    requireHex(reasons, normalize(answers.color3), "Color acento");
    requireField(reasons, answers, "contrast", "Verificacion de contraste", 10);
    requireSelect(reasons, answers, "icons", "Metodo de iconos");
    requireField(reasons, answers, "iconsWhy", "Justificacion de iconos", 10);
    requireField(reasons, answers, "coherence", "Coherencia general", 14);
  }

  if (activityId === "clase-5-auditoria-cambios") {
    requireField(reasons, answers, "removedWhat", "Seccion eliminada", 2);
    requireField(reasons, answers, "removedWhy", "Criterio de eliminacion", 8);
    requireField(reasons, answers, "textWhat", "Texto reemplazado", 2);
    requireField(reasons, answers, "textWhy", "Criterio de texto", 8);
    requireField(reasons, answers, "imageWhat", "Imagen importante", 2);
    requireField(reasons, answers, "imageWhy", "Criterio de imagen", 8);
    requireField(reasons, answers, "impactWhat", "Cambio de mayor impacto", 2);
    requireField(reasons, answers, "impactWhy", "Criterio de impacto", 8);
    requireSelect(reasons, answers, "usedAi", "Uso de IA");
    requireField(reasons, answers, "aiDetail", "Detalle de uso de IA o criterio propio", 8);
    if (!/antes\.(png|jpg|jpeg)$/i.test(normalize(answers.beforeFile))) reasons.push("Evidencia antes: usa un nombre como antes.png o antes.jpg.");
    if (!/despues\.(png|jpg|jpeg)$/i.test(normalize(answers.afterFile))) reasons.push("Evidencia despues: usa un nombre como despues.png o despues.jpg.");
  }

  return reasons;
}

async function groqValidate(activityId: string, answers: Answers, localReasons: string[]) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || localReasons.length > 0) {
    return { reasons: localReasons, suggestions: [] as string[], usedGroq: false };
  }

  const baseUrl = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sos un revisor docente de actividades de Web e IA creativa. No completes la tarea por el alumno. Detecta texto basura, respuestas incoherentes, contradicciones o falta de criterio. Responde JSON estricto con reasons:string[] y suggestions:string[]. Si esta bien, reasons debe ser [].",
        },
        {
          role: "user",
          content: JSON.stringify({ activityId, answers }),
        },
      ],
    }),
  });

  if (!response.ok) {
    return {
      reasons: localReasons,
      suggestions: ["No se pudo usar Groq; se aplico la revision local."],
      usedGroq: false,
    };
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content) as { reasons?: string[]; suggestions?: string[] };
  return {
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons : localReasons,
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
    usedGroq: true,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const activityId = normalize(body.activityId);
  const activity = activities.find((item) => item.id === activityId);
  const answers = (body.answers || {}) as Answers;

  if (!activity) {
    return NextResponse.json(
      {
        event: "FAILURE",
        reasons: ["Actividad desconocida."],
        message: "No se pudo revisar la actividad.",
        state: JSON.stringify({ completed: false }),
      },
      { status: 400 },
    );
  }

  const localReasons = localValidate(activityId, answers);
  const groq = await groqValidate(activityId, answers, localReasons);
  const completed = groq.reasons.length === 0;

  const result: ValidationResult = {
    event: completed ? "SUCCESS" : "FAILURE",
    reasons: groq.reasons,
    message: completed ? "Actividad completa." : "La actividad necesita revision.",
    suggestions: groq.suggestions,
    state: JSON.stringify({
      activity: activityId,
      completed,
      usedGroq: groq.usedGroq,
      checkedAt: new Date().toISOString(),
    }),
  };

  return NextResponse.json(result);
}
