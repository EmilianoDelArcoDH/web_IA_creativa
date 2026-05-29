import { NextRequest, NextResponse } from "next/server";
import { activities, normalizeLanguage, supportedLanguages, type Language } from "@/lib/activities";

type Answers = Record<string, string>;

type ValidationResult = {
  event: "SUCCESS" | "FAILURE";
  reasons: string[];
  message: string;
  state: string;
  suggestions?: string[];
};

type ContextValidation = {
  contexto_valido: boolean;
  feedback_alumno: string;
};

type GroqValidation = {
  reasons: string[];
  suggestions: string[];
  usedGroq: boolean;
  contextReview?: ContextValidation;
};

const commonStopWords = new Set([
  "para", "con", "que", "una", "uno", "por", "del", "las", "los", "como", "este", "esta", "porque", "mejorar",
  "for", "the", "and", "with", "that", "this", "from", "into", "your", "their", "about", "because",
  "com", "uma", "por", "para", "isso", "essa", "esse", "porque", "melhorar",
]);

const languageText = {
  es: {
    complete: "Actividad completa.",
    needsReview: "La actividad necesita revision.",
    unknown: "Actividad desconocida.",
    cannotReview: "No se pudo revisar la actividad.",
    groqFallback: "No se pudo usar Groq; se aplico la revision local.",
    contextMissing: "Falta completar tema, contexto o prompt para poder revisar si el contexto de uso esta bien integrado.",
    contextPrompt: "El prompt no retoma con claridad el contexto de uso indicado. Necesita mencionar mejor donde se va a usar o bajo que formato.",
    contextOk: "El prompt, los resultados y el analisis mantienen una relacion coherente con el contexto de uso planteado.",
    contextFormat: (label: string) => `El contexto pide un formato tipo ${label}, pero eso no aparece con claridad tanto en el prompt como en los resultados.`,
    contextAudience: (label: string) => `El contexto sugiere una audiencia ${label}, pero el prompt o el analisis no muestran suficiente adaptacion de tono o audiencia.`,
    incomplete: (label: string) => `${label}: la respuesta parece incompleta o no tiene sentido suficiente.`,
    missingSelect: (label: string) => `${label}: falta seleccionar una opcion.`,
    invalidHex: (label: string) => `${label}: debe ser un color HEX valido.`,
    class1Prompt: "Prompt completo: falta explicitar audiencia, estilo visual, contexto o formato.",
    class1Results: "Resultados de la IA: registra al menos 3 resultados reales.",
    class1Decision: "Analisis: falta una eleccion final justificada.",
  },
  en: {
    complete: "Activity complete.",
    needsReview: "The activity needs review.",
    unknown: "Unknown activity.",
    cannotReview: "The activity could not be reviewed.",
    groqFallback: "Groq could not be used; local review was applied.",
    contextMissing: "Topic, context, or prompt is still missing, so the usage context cannot be reviewed well.",
    contextPrompt: "The prompt does not clearly reflect the stated usage context. It should mention more clearly where or in what format it will be used.",
    contextOk: "The prompt, results, and analysis remain coherent with the proposed usage context.",
    contextFormat: (label: string) => `The context asks for a ${label}-style format, but that is not clear in both the prompt and the results.`,
    contextAudience: (label: string) => `The context suggests a ${label} audience, but the prompt or analysis does not show enough tone or audience adaptation.`,
    incomplete: (label: string) => `${label}: the response seems incomplete or does not have enough meaningful content.`,
    missingSelect: (label: string) => `${label}: an option still needs to be selected.`,
    invalidHex: (label: string) => `${label}: it must be a valid HEX color.`,
    class1Prompt: "Full prompt: it still needs to specify audience, visual style, context, or format.",
    class1Results: "AI results: record at least 3 real results.",
    class1Decision: "Analysis: a justified final choice is still missing.",
  },
  pt: {
    complete: "Atividade completa.",
    needsReview: "A atividade precisa de revisao.",
    unknown: "Atividade desconhecida.",
    cannotReview: "Nao foi possivel revisar a atividade.",
    groqFallback: "Nao foi possivel usar Groq; a revisao local foi aplicada.",
    contextMissing: "Falta completar tema, contexto ou prompt para revisar se o contexto de uso foi bem integrado.",
    contextPrompt: "O prompt nao retoma com clareza o contexto de uso indicado. Precisa mencionar melhor onde ou em que formato sera usado.",
    contextOk: "O prompt, os resultados e a analise mantem uma relacao coerente com o contexto de uso proposto.",
    contextFormat: (label: string) => `O contexto pede um formato do tipo ${label}, mas isso nao aparece com clareza tanto no prompt quanto nos resultados.`,
    contextAudience: (label: string) => `O contexto sugere um publico ${label}, mas o prompt ou a analise nao mostram adaptacao suficiente de tom ou publico.`,
    incomplete: (label: string) => `${label}: a resposta parece incompleta ou sem conteudo suficiente.`,
    missingSelect: (label: string) => `${label}: falta selecionar uma opcao.`,
    invalidHex: (label: string) => `${label}: deve ser uma cor HEX valida.`,
    class1Prompt: "Prompt completo: falta explicitar publico, estilo visual, contexto ou formato.",
    class1Results: "Resultados da IA: registre pelo menos 3 resultados reais.",
    class1Decision: "Analise: falta uma escolha final justificada.",
  },
};

const contextFormatRules = [
  { pattern: /\b(blog|articulo|artigo|post)\b/i, label: { es: "blog", en: "blog", pt: "blog" }, cues: ["blog", "articulo", "artigo", "post", "title", "titulo", "subtitulo", "subtitle"] },
  { pattern: /\b(tweet|x post|post de x|hilo|thread)\b/i, label: { es: "tweet", en: "tweet", pt: "tweet" }, cues: ["tweet", "x", "hilo", "thread", "280", "short", "corto"] },
  { pattern: /\b(mail|email|correo|newsletter)\b/i, label: { es: "mail", en: "email", pt: "email" }, cues: ["mail", "email", "asunto", "subject", "correio", "correo", "saludo"] },
  { pattern: /\b(guion|roteiro|script|video)\b/i, label: { es: "guion", en: "script", pt: "roteiro" }, cues: ["guion", "roteiro", "script", "scene", "escena", "video", "voice", "voz"] },
  { pattern: /\b(instagram|historia|story|reel)\b/i, label: { es: "instagram", en: "instagram", pt: "instagram" }, cues: ["instagram", "story", "historia", "reel", "1080x1920"] },
  { pattern: /\b(linkedin)\b/i, label: { es: "linkedin", en: "linkedin", pt: "linkedin" }, cues: ["linkedin", "professional", "profesional", "post"] },
  { pattern: /\b(landing|web|pagina|pagina|hero|site)\b/i, label: { es: "web", en: "web", pt: "web" }, cues: ["web", "landing", "hero", "pagina", "page", "site", "sitio"] },
];

const audienceRules = [
  { pattern: /\b(ninos|niños|infantil|chicos|chicas|children|kids|criancas|criancas)\b/i, label: { es: "infantil", en: "children", pt: "infantil" }, cues: ["ninos", "niños", "children", "kids", "criancas", "simple", "friendly", "amigable", "didactic", "didactico"] },
  { pattern: /\b(adolescentes|teen|jovenes|young)\b/i, label: { es: "juvenil", en: "young", pt: "jovem" }, cues: ["joven", "young", "teen", "dinamico", "dynamic", "actual", "cercano"] },
  { pattern: /\b(profesionales|executives|executivos|empresa|b2b|corporativo|professional)\b/i, label: { es: "profesional", en: "professional", pt: "profissional" }, cues: ["professional", "profesional", "corporate", "corporativo", "formal", "empresa", "business"] },
  { pattern: /\b(clientes|compradores|emprendedores|customers|buyers)\b/i, label: { es: "comercial", en: "commercial", pt: "comercial" }, cues: ["cliente", "customer", "buyer", "benefit", "beneficio", "convincing", "convincente", "clear"] },
  { pattern: /\b(estudiantes|alumnos|docentes|students|teachers)\b/i, label: { es: "educativo", en: "educational", pt: "educacional" }, cues: ["student", "estudiante", "alumno", "teacher", "docente", "explanatory", "explicativo", "clear"] },
];

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function words(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .match(/[a-z0-9#]+/g) || []
  );
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
  if (/(asdf|qwer|zxcv|hjkl|fgh|jkl){2,}/i.test(compact)) return true;
  return false;
}

function hasMeaningfulText(text: string, minWords = 4) {
  const list = words(text).filter((word) => word.length > 2 && !commonStopWords.has(word));
  const unique = new Set(list);
  return text.length >= 12 && list.length >= minWords && unique.size >= Math.min(minWords, 3) && !looksLikeKeyboardTrash(text);
}

function requireField(reasons: string[], answers: Answers, name: string, label: string, language: Language, minWords = 4) {
  if (!hasMeaningfulText(normalize(answers[name]), minWords)) reasons.push(languageText[language].incomplete(label));
}

function requireSelect(reasons: string[], answers: Answers, name: string, label: string, language: Language) {
  if (!normalize(answers[name])) reasons.push(languageText[language].missingSelect(label));
}

function requireHex(reasons: string[], value: string, label: string, language: Language) {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) reasons.push(languageText[language].invalidHex(label));
}

function includesAny(text: string, cues: string[]) {
  return cues.some((cue) => text.includes(cue));
}

function inferFormat(context: string) {
  return contextFormatRules.find((rule) => rule.pattern.test(context));
}

function inferAudience(context: string) {
  return audienceRules.find((rule) => rule.pattern.test(context));
}

function validateContextCoherence(answers: Answers, language: Language): ContextValidation {
  const text = languageText[language];
  const context = normalize(answers.context);
  const prompt = normalize(answers.prompt);
  const results = ["result1", "result2", "result3", "result4", "result5"].map((key) => normalize(answers[key])).filter(Boolean).join("\n");
  const analysis = normalize(answers.analysis);

  if (!normalize(answers.topic) || !context || !prompt) return { contexto_valido: false, feedback_alumno: text.contextMissing };

  const promptText = words(prompt).join(" ");
  const resultText = words(results).join(" ");
  const analysisText = words(analysis).join(" ");
  const contextWords = words(context).filter((word) => word.length > 3);
  const formatRule = inferFormat(context);
  if (formatRule) {
    const promptHasFormat = includesAny(promptText, formatRule.cues);
    const resultsHaveFormat = includesAny(resultText, formatRule.cues);
    if (!promptHasFormat || !resultsHaveFormat) {
      return { contexto_valido: false, feedback_alumno: text.contextFormat(formatRule.label[language]) };
    }
  }

  const audienceRule = inferAudience(context);
  if (audienceRule) {
    const promptMatchesAudience = includesAny(promptText, audienceRule.cues);
    const analysisMatchesAudience = includesAny(analysisText, audienceRule.cues);
    if (!promptMatchesAudience || !analysisMatchesAudience) {
      return { contexto_valido: false, feedback_alumno: text.contextAudience(audienceRule.label[language]) };
    }
  }

  if (contextWords.length > 0 && !contextWords.some((word) => promptText.includes(word))) {
    return { contexto_valido: false, feedback_alumno: text.contextPrompt };
  }

  return { contexto_valido: true, feedback_alumno: text.contextOk };
}

function localValidate(activityId: string, answers: Answers, language: Language) {
  const reasons: string[] = [];
  const text = languageText[language];
  const promptPartsPattern = /(audience|publico|público|para|for|dirigido|style|estilo|visual|context|contexto|format|formato|use|uso)/i;
  const decisionPattern = /(elijo|elegi|escolho|escolhi|i choose|chosen|final|because|porque|por que|por qué|worked|funciono|funcionou|cambiaria|mudaria|would change)/i;
  const coherencePattern = /(same|mismo|mesmo|project|proyecto|projeto|audience|audiencia|publico|público|coheren|coer|adjust|ajust)/i;
  const criteriaPattern = /(contrast|contraste|hierarch|jerarqu|clarity|claridad|clareza|coheren|coer|accessib|accesib|acessib|audience|audiencia|publico|público|conversion|convers|legib|readab|criteri|criterion|criteria)/i;

  if (activityId === "clase-1-tu-primer-prompt") {
    requireField(reasons, answers, "topic", "Topic", language, 2);
    requireField(reasons, answers, "context", "Context", language, 3);
    requireField(reasons, answers, "prompt", "Prompt", language, 18);
    if (!promptPartsPattern.test(normalize(answers.prompt).toLowerCase())) reasons.push(text.class1Prompt);
    const resultCount = ["result1", "result2", "result3", "result4", "result5"].filter((key) => hasMeaningfulText(normalize(answers[key]), 3)).length;
    if (resultCount < 3) reasons.push(text.class1Results);
    requireField(reasons, answers, "analysis", "Analysis", language, 18);
    if (!decisionPattern.test(words(normalize(answers.analysis)).join(" "))) reasons.push(text.class1Decision);
    if (reasons.length === 0) {
      const contextValidation = validateContextCoherence(answers, language);
      if (!contextValidation.contexto_valido) reasons.push(contextValidation.feedback_alumno);
    }
  }

  if (activityId === "clase-2-bloque-web") {
    requireField(reasons, answers, "project", "Project", language, 2);
    for (let index = 1; index <= 5; index += 1) requireField(reasons, answers, `title${index}`, `Title ${index}`, language, 2);
    requireField(reasons, answers, "titleFinal", "Final title", language, 3);
    for (let index = 1; index <= 3; index += 1) requireField(reasons, answers, `subtitle${index}`, `Subtitle ${index}`, language, 5);
    requireField(reasons, answers, "subtitleFinal", "Final subtitle", language, 8);
    for (let index = 1; index <= 3; index += 1) {
      requireField(reasons, answers, `benefit${index}`, `Benefit ${index}`, language, 4);
      requireSelect(reasons, answers, `benefit${index}Light`, `Traffic light ${index}`, language);
    }
    for (let index = 1; index <= 5; index += 1) requireField(reasons, answers, `cta${index}`, `CTA ${index}`, language, 1);
    requireField(reasons, answers, "ctaFinal", "Final CTA", language, 1);
    requireField(reasons, answers, "ctaAction", "Click action", language, 5);
    requireField(reasons, answers, "coherence", "Final review", language, 12);
    if (normalize(answers.coherence) && !coherencePattern.test(normalize(answers.coherence).toLowerCase())) reasons.push(languageText[language].incomplete("Final review"));
  }

  if (activityId === "clase-3-identidad-visual") {
    requireField(reasons, answers, "audience", "Audience", language, 6);
    requireField(reasons, answers, "context", "Context", language, 6);
    requireField(reasons, answers, "mood", "Mood", language, 5);
    requireField(reasons, answers, "heroPrompt", "Hero prompt", language, 18);
    requireHex(reasons, normalize(answers.color1), "Background color", language);
    requireHex(reasons, normalize(answers.color2), "Text color", language);
    requireHex(reasons, normalize(answers.color3), "Accent color", language);
    requireField(reasons, answers, "contrast", "Contrast check", language, 10);
    requireSelect(reasons, answers, "icons", "Icon method", language);
    requireField(reasons, answers, "iconsWhy", "Icon justification", language, 10);
    requireField(reasons, answers, "coherence", "Overall coherence", language, 14);
  }

  if (activityId === "clase-5-auditoria-cambios") {
    requireField(reasons, answers, "removedWhat", "Removed section", language, 2);
    requireField(reasons, answers, "removedWhy", "Removal criterion", language, 8);
    requireField(reasons, answers, "textWhat", "Replaced text", language, 2);
    requireField(reasons, answers, "textWhy", "Text criterion", language, 8);
    requireField(reasons, answers, "imageWhat", "Important image", language, 2);
    requireField(reasons, answers, "imageWhy", "Image criterion", language, 8);
    requireField(reasons, answers, "impactWhat", "Highest impact change", language, 2);
    requireField(reasons, answers, "impactWhy", "Impact criterion", language, 8);
    requireSelect(reasons, answers, "usedAi", "AI usage", language);
    requireField(reasons, answers, "aiDetail", "AI usage detail", language, 8);
    const allCriteria = [answers.removedWhy, answers.textWhy, answers.imageWhy, answers.impactWhy].every((value) => criteriaPattern.test(normalize(value).toLowerCase()));
    if (!allCriteria) reasons.push(text.incomplete("Technical criteria"));
  }

  return reasons;
}

async function groqValidate(activityId: string, answers: Answers, localReasons: string[], language: Language): Promise<GroqValidation> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || localReasons.length > 0) return { reasons: localReasons, suggestions: [], usedGroq: false };

  const isContextActivity = activityId === "clase-1-tu-primer-prompt";
  const baseUrl = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: isContextActivity
            ? `You are an automated evaluator for a creative web + AI learning platform.
Review whether the learner integrated the stated usage context correctly.
The learner's inputs may be in Spanish, English, or Portuguese.
You must return feedback in ${language}.
Respond only as strict JSON:
{"contexto_valido": true, "feedback_alumno": "short feedback in ${language}" }`
            : `You are a teacher reviewing creative web + AI activities.
Inputs may be in Spanish, English, or Portuguese.
Return all feedback in ${language}.
Do not complete the work for the learner.
Detect nonsense text, incoherence, contradictions, or weak criteria.
Respond as strict JSON with reasons:string[] and suggestions:string[]. If everything is correct, reasons must be [].`,
        },
        {
          role: "user",
          content: isContextActivity
            ? JSON.stringify({
                tema: normalize(answers.topic),
                contexto: normalize(answers.context),
                prompt_alumno: normalize(answers.prompt),
                resultados_ia: ["result1", "result2", "result3", "result4", "result5"].map((key) => normalize(answers[key])).filter(Boolean),
                analisis_alumno: normalize(answers.analysis),
                requested_feedback_language: language,
                supported_languages: supportedLanguages,
              })
            : JSON.stringify({ activityId, answers, requested_feedback_language: language, supported_languages: supportedLanguages }),
        },
      ],
    }),
  });

  if (!response.ok) {
    return { reasons: localReasons, suggestions: [languageText[language].groqFallback], usedGroq: false };
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content) as ContextValidation | { reasons?: string[]; suggestions?: string[] };

  if (isContextActivity && "contexto_valido" in parsed) {
    return { reasons: parsed.contexto_valido ? [] : [parsed.feedback_alumno], suggestions: [], usedGroq: true, contextReview: parsed };
  }

  return {
    reasons: "reasons" in parsed && Array.isArray(parsed.reasons) ? parsed.reasons : localReasons,
    suggestions: "suggestions" in parsed && Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
    usedGroq: true,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const activityId = normalize(body.activityId);
  const activity = activities.find((item) => item.id === activityId);
  const answers = (body.answers || {}) as Answers;
  const language = normalizeLanguage(normalize(body.language));

  if (!activity) {
    return NextResponse.json(
      {
        event: "FAILURE",
        reasons: [languageText[language].unknown],
        message: languageText[language].cannotReview,
        state: JSON.stringify({ completed: false, language }),
      },
      { status: 400 },
    );
  }

  const localReasons = localValidate(activityId, answers, language);
  const groq = await groqValidate(activityId, answers, localReasons, language);
  const completed = groq.reasons.length === 0;
  const contextReview = groq.contextReview || (activityId === "clase-1-tu-primer-prompt" && localReasons.length === 0 ? validateContextCoherence(answers, language) : undefined);

  const result: ValidationResult = {
    event: completed ? "SUCCESS" : "FAILURE",
    reasons: groq.reasons,
    message: completed ? languageText[language].complete : languageText[language].needsReview,
    suggestions: groq.suggestions,
    state: JSON.stringify({
      activity: activityId,
      completed,
      usedGroq: groq.usedGroq,
      contextReview,
      language,
      feedbackLanguage: language,
      checkedAt: new Date().toISOString(),
    }),
  };

  return NextResponse.json(result);
}
