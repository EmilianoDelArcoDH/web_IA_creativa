export type Language = "es" | "en" | "pt";
export const supportedLanguages: Language[] = ["es", "en", "pt"];

export type FieldType = "text" | "textarea" | "select";

export type ActivityField = {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  help?: string;
  options?: string[];
};

export type ActivitySection = {
  title: string;
  intro?: string;
  fields: ActivityField[];
  grid?: "grid-2" | "grid-3" | "grid-5";
};

export type Activity = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  lead: string;
  sideTitle: string;
  sideCopy: string[];
  sections: ActivitySection[];
};

type ActivityTranslation = Omit<Activity, "id" | "slug">;
type ActivityTranslations = Record<string, Record<Language, ActivityTranslation>>;

export const activities: Activity[] = [
  {
    id: "clase-1-tu-primer-prompt",
    slug: "laboratorio-prompts",
    eyebrow: "Clase 1",
    title: "Tu primer prompt",
    lead: "Escribi un prompt claro, genera varias opciones y explica por que una version funciona mejor.",
    sideTitle: "Como trabajar",
    sideCopy: [
      "La IA sirve para generar opciones. Tu tarea es decidir, comparar y justificar con criterio.",
      "No alcanza con llenar casillas: las respuestas tienen que ser coherentes con la consigna.",
    ],
    sections: [
      {
        title: "Idea de partida",
        intro: "Elegi algo simple y concreto para no perderte en el primer intento.",
        grid: "grid-2",
        fields: [
          { name: "topic", label: "Tema o idea", placeholder: "Ej: afiche para un recital indie" },
          { name: "context", label: "Contexto de uso", placeholder: "Ej: historia de Instagram 1080x1920" },
        ],
      },
      {
        title: "MI PRIMER PROMPT",
        intro: "Inclui que queres, para quien es, estilo visual y donde se va a usar.",
        fields: [{ name: "prompt", label: "Prompt completo", type: "textarea" }],
      },
      {
        title: "RESULTADOS DE LA IA",
        intro: "Registra entre 3 y 5 resultados. Podes describirlos o pegar enlaces/nombres de archivo.",
        fields: [
          { name: "result1", label: "Resultado 1", type: "textarea" },
          { name: "result2", label: "Resultado 2", type: "textarea" },
          { name: "result3", label: "Resultado 3", type: "textarea" },
          { name: "result4", label: "Resultado 4 opcional", type: "textarea" },
          { name: "result5", label: "Resultado 5 opcional", type: "textarea" },
        ],
      },
      {
        title: "MI ANALISIS",
        intro: "Explica que funciono, que cambiarias, cual elegiste y por que.",
        fields: [{ name: "analysis", label: "Analisis y decision final", type: "textarea" }],
      },
    ],
  },
  {
    id: "clase-2-bloque-web",
    slug: "hero-ia",
    eyebrow: "Clase 2",
    title: "Bloque web con IA",
    lead: "Genera opciones, elegi una, editala y revisa si cada parte habla del mismo proyecto.",
    sideTitle: "Proceso lineal",
    sideCopy: [
      "Primero exploras opciones. Despues elegis y editas.",
      "La coherencia final importa mas que quedarse con la primera respuesta.",
    ],
    sections: [
      {
        title: "Proyecto del bloque",
        fields: [{ name: "project", label: "Nombre o tema", placeholder: "Ej: curso de fotografia con celular" }],
      },
      {
        title: "01 - Titulo",
        intro: "Genera 5 opciones con IA y despues escribi la version final.",
        grid: "grid-5",
        fields: [
          { name: "title1", label: "Titulo 1", type: "textarea" },
          { name: "title2", label: "Titulo 2", type: "textarea" },
          { name: "title3", label: "Titulo 3", type: "textarea" },
          { name: "title4", label: "Titulo 4", type: "textarea" },
          { name: "title5", label: "Titulo 5", type: "textarea" },
          { name: "titleFinal", label: "Titulo final con edicion" },
        ],
      },
      {
        title: "02 - Subtitulo",
        grid: "grid-3",
        fields: [
          { name: "subtitle1", label: "Subtitulo 1", type: "textarea" },
          { name: "subtitle2", label: "Subtitulo 2", type: "textarea" },
          { name: "subtitle3", label: "Subtitulo 3", type: "textarea" },
          { name: "subtitleFinal", label: "Subtitulo final con edicion", type: "textarea" },
        ],
      },
      {
        title: "03 - Beneficios con semaforo",
        intro: "Verde: queda. Amarillo: se edita. Rojo: se descarta y se genera otro.",
        grid: "grid-3",
        fields: [
          { name: "benefit1", label: "Beneficio 1", type: "textarea" },
          { name: "benefit1Light", label: "Semaforo 1", type: "select", options: ["Verde", "Amarillo", "Rojo"] },
          { name: "benefit2", label: "Beneficio 2", type: "textarea" },
          { name: "benefit2Light", label: "Semaforo 2", type: "select", options: ["Verde", "Amarillo", "Rojo"] },
          { name: "benefit3", label: "Beneficio 3", type: "textarea" },
          { name: "benefit3Light", label: "Semaforo 3", type: "select", options: ["Verde", "Amarillo", "Rojo"] },
        ],
      },
      {
        title: "04 - CTA",
        grid: "grid-5",
        fields: [
          { name: "cta1", label: "CTA 1" },
          { name: "cta2", label: "CTA 2" },
          { name: "cta3", label: "CTA 3" },
          { name: "cta4", label: "CTA 4" },
          { name: "cta5", label: "CTA 5" },
          { name: "ctaFinal", label: "CTA final" },
          { name: "ctaAction", label: "Que pasa al hacer clic" },
        ],
      },
      {
        title: "05 - Revision final",
        fields: [{ name: "coherence", label: "Coherencia del bloque", type: "textarea" }],
      },
    ],
  },
  {
    id: "clase-3-identidad-visual",
    slug: "sistema-visual",
    eyebrow: "Clase 3",
    title: "Identidad visual documentada",
    lead: "Defini audiencia, imagen hero, paleta e iconos con criterios tecnicos, no solo desde el gusto personal.",
    sideTitle: "Criterio visual",
    sideCopy: [
      "Las decisiones visuales tienen que poder explicarse.",
      "Contraste, audiencia y coherencia forman parte de la entrega.",
    ],
    sections: [
      {
        title: "1. Definiciones",
        fields: [
          { name: "audience", label: "Audiencia", type: "textarea" },
          { name: "context", label: "Contexto", type: "textarea" },
          { name: "mood", label: "Mood", type: "textarea" },
        ],
      },
      {
        title: "2. Prompt de la hero",
        fields: [{ name: "heroPrompt", label: "Prompt completo", type: "textarea" }],
      },
      {
        title: "3. Paleta con HEX + contraste",
        grid: "grid-2",
        fields: [
          { name: "color1", label: "Color de fondo", placeholder: "#000000" },
          { name: "color2", label: "Color de texto", placeholder: "#fff7d6" },
          { name: "color3", label: "Color acento", placeholder: "#2a3fe5" },
          { name: "color4", label: "Color secundario", placeholder: "#f4b9b0" },
          { name: "contrast", label: "Verificacion de contraste", type: "textarea" },
        ],
      },
      {
        title: "4. Iconos",
        fields: [
          { name: "icons", label: "Metodo y estilo", type: "select", options: ["Libreria lineal", "IA", "Dibujo manual", "Sistema geometrico"] },
          { name: "iconsWhy", label: "Por que funciona para esta audiencia", type: "textarea" },
        ],
      },
      {
        title: "5. Coherencia general",
        fields: [{ name: "coherence", label: "Revision personal", type: "textarea" }],
      },
    ],
  },
  {
    id: "clase-5-auditoria-cambios",
    slug: "auditoria-ia",
    eyebrow: "Clase 5",
    title: "Auditoria y justificacion de cambios",
    lead: "Identifica cambios importantes, aplicalos y explica cada decision con criterio tecnico.",
    sideTitle: "Mirada critica",
    sideCopy: [
      "Podes usar IA para diagnosticar, pero la decision final tiene que quedar a tu cargo.",
      "La justificacion muestra el proceso, no solo el resultado.",
    ],
    sections: [
      {
        title: "Parte A - Justificacion guiada",
        fields: [
          { name: "removedWhat", label: "Elimine la seccion..." },
          { name: "removedWhy", label: "Porque...", type: "textarea" },
          { name: "textWhat", label: "Reemplace el texto..." },
          { name: "textWhy", label: "Para mejorar...", type: "textarea" },
          { name: "imageWhat", label: "La imagen mas importante es..." },
          { name: "imageWhy", label: "Porque...", type: "textarea" },
          { name: "impactWhat", label: "El cambio de mayor impacto fue..." },
          { name: "impactWhy", label: "Porque...", type: "textarea" },
        ],
      },
      {
        title: "Uso de IA",
        fields: [
          { name: "usedAi", label: "Usaste IA para corregir o auditar", type: "select", options: ["Si", "No"] },
          { name: "aiDetail", label: "Detalle de uso o criterio personal", type: "textarea" },
        ],
      },
    ],
  },
];

const activityTranslations: ActivityTranslations = {
  "clase-1-tu-primer-prompt": {
    es: activities[0],
    en: {
      eyebrow: "Class 1",
      title: "Your first prompt",
      lead: "Write a clear prompt, generate several options, and explain why one version works better.",
      sideTitle: "How to work",
      sideCopy: [
        "AI helps generate options. Your task is to decide, compare, and justify with criteria.",
        "It is not enough to fill fields: the answers need to match the assignment coherently.",
      ],
      sections: [
        { title: "Starting idea", intro: "Choose something simple and concrete so you do not get lost on your first try.", grid: "grid-2", fields: [
          { name: "topic", label: "Topic or idea", placeholder: "Ex: poster for an indie concert" },
          { name: "context", label: "Usage context", placeholder: "Ex: Instagram story 1080x1920" },
        ]},
        { title: "MY FIRST PROMPT", intro: "Include what you want, who it is for, the visual style, and where it will be used.", fields: [{ name: "prompt", label: "Full prompt", type: "textarea" }] },
        { title: "AI RESULTS", intro: "Record 3 to 5 results. You can describe them or paste links/file names.", fields: [
          { name: "result1", label: "Result 1", type: "textarea" }, { name: "result2", label: "Result 2", type: "textarea" }, { name: "result3", label: "Result 3", type: "textarea" }, { name: "result4", label: "Optional result 4", type: "textarea" }, { name: "result5", label: "Optional result 5", type: "textarea" },
        ]},
        { title: "MY ANALYSIS", intro: "Explain what worked, what you would change, which version stays final, and why.", fields: [{ name: "analysis", label: "Analysis and final decision", type: "textarea" }] },
      ],
    },
    pt: {
      eyebrow: "Aula 1",
      title: "Seu primeiro prompt",
      lead: "Escreva um prompt claro, gere varias opcoes e explique por que uma versao funciona melhor.",
      sideTitle: "Como trabalhar",
      sideCopy: [
        "A IA ajuda a gerar opcoes. Sua tarefa e decidir, comparar e justificar com criterio.",
        "Nao basta preencher campos: as respostas precisam ser coerentes com a proposta.",
      ],
      sections: [
        { title: "Ideia inicial", intro: "Escolha algo simples e concreto para nao se perder na primeira tentativa.", grid: "grid-2", fields: [
          { name: "topic", label: "Tema ou ideia", placeholder: "Ex: cartaz para um show indie" },
          { name: "context", label: "Contexto de uso", placeholder: "Ex: story do Instagram 1080x1920" },
        ]},
        { title: "MEU PRIMEIRO PROMPT", intro: "Inclua o que voce quer, para quem e, o estilo visual e onde sera usado.", fields: [{ name: "prompt", label: "Prompt completo", type: "textarea" }] },
        { title: "RESULTADOS DA IA", intro: "Registre de 3 a 5 resultados. Voce pode descreve-los ou colar links/nomes de arquivo.", fields: [
          { name: "result1", label: "Resultado 1", type: "textarea" }, { name: "result2", label: "Resultado 2", type: "textarea" }, { name: "result3", label: "Resultado 3", type: "textarea" }, { name: "result4", label: "Resultado 4 opcional", type: "textarea" }, { name: "result5", label: "Resultado 5 opcional", type: "textarea" },
        ]},
        { title: "MINHA ANALISE", intro: "Explique o que funcionou, o que mudaria, qual versao fica como final e por que.", fields: [{ name: "analysis", label: "Analise e decisao final", type: "textarea" }] },
      ],
    },
  },
  "clase-2-bloque-web": {
    es: activities[1],
    en: {
      eyebrow: "Class 2",
      title: "Web block with AI",
      lead: "Generate options, choose one, edit it, and review whether each part speaks about the same project.",
      sideTitle: "Linear process",
      sideCopy: ["First explore options. Then choose and edit.", "Final coherence matters more than keeping the first answer."],
      sections: [
        { title: "Block project", fields: [{ name: "project", label: "Name or topic", placeholder: "Ex: mobile photography course" }] },
        { title: "01 - Title", intro: "Generate 5 options with AI and then write the final version.", grid: "grid-5", fields: [
          { name: "title1", label: "Title 1", type: "textarea" }, { name: "title2", label: "Title 2", type: "textarea" }, { name: "title3", label: "Title 3", type: "textarea" }, { name: "title4", label: "Title 4", type: "textarea" }, { name: "title5", label: "Title 5", type: "textarea" }, { name: "titleFinal", label: "Final title with edits" },
        ]},
        { title: "02 - Subtitle", grid: "grid-3", fields: [
          { name: "subtitle1", label: "Subtitle 1", type: "textarea" }, { name: "subtitle2", label: "Subtitle 2", type: "textarea" }, { name: "subtitle3", label: "Subtitle 3", type: "textarea" }, { name: "subtitleFinal", label: "Final subtitle with edits", type: "textarea" },
        ]},
        { title: "03 - Benefits with traffic light", intro: "Green: keep it. Yellow: edit it. Red: discard it and generate another.", grid: "grid-3", fields: [
          { name: "benefit1", label: "Benefit 1", type: "textarea" }, { name: "benefit1Light", label: "Traffic light 1", type: "select", options: ["Green", "Yellow", "Red"] },
          { name: "benefit2", label: "Benefit 2", type: "textarea" }, { name: "benefit2Light", label: "Traffic light 2", type: "select", options: ["Green", "Yellow", "Red"] },
          { name: "benefit3", label: "Benefit 3", type: "textarea" }, { name: "benefit3Light", label: "Traffic light 3", type: "select", options: ["Green", "Yellow", "Red"] },
        ]},
        { title: "04 - CTA", grid: "grid-5", fields: [
          { name: "cta1", label: "CTA 1" }, { name: "cta2", label: "CTA 2" }, { name: "cta3", label: "CTA 3" }, { name: "cta4", label: "CTA 4" }, { name: "cta5", label: "CTA 5" }, { name: "ctaFinal", label: "Final CTA" }, { name: "ctaAction", label: "What happens on click" },
        ]},
        { title: "05 - Final review", fields: [{ name: "coherence", label: "Block coherence", type: "textarea" }] },
      ],
    },
    pt: {
      eyebrow: "Aula 2",
      title: "Bloco web com IA",
      lead: "Gere opcoes, escolha uma, edite e revise se cada parte fala do mesmo projeto.",
      sideTitle: "Processo linear",
      sideCopy: ["Primeiro voce explora opcoes. Depois escolhe e edita.", "A coerencia final importa mais do que ficar com a primeira resposta."],
      sections: [
        { title: "Projeto do bloco", fields: [{ name: "project", label: "Nome ou tema", placeholder: "Ex: curso de fotografia com celular" }] },
        { title: "01 - Titulo", intro: "Gere 5 opcoes com IA e depois escreva a versao final.", grid: "grid-5", fields: [
          { name: "title1", label: "Titulo 1", type: "textarea" }, { name: "title2", label: "Titulo 2", type: "textarea" }, { name: "title3", label: "Titulo 3", type: "textarea" }, { name: "title4", label: "Titulo 4", type: "textarea" }, { name: "title5", label: "Titulo 5", type: "textarea" }, { name: "titleFinal", label: "Titulo final com edicao" },
        ]},
        { title: "02 - Subtitulo", grid: "grid-3", fields: [
          { name: "subtitle1", label: "Subtitulo 1", type: "textarea" }, { name: "subtitle2", label: "Subtitulo 2", type: "textarea" }, { name: "subtitle3", label: "Subtitulo 3", type: "textarea" }, { name: "subtitleFinal", label: "Subtitulo final com edicao", type: "textarea" },
        ]},
        { title: "03 - Beneficios com semaforo", intro: "Verde: fica. Amarelo: edita. Vermelho: descarta e gera outro.", grid: "grid-3", fields: [
          { name: "benefit1", label: "Beneficio 1", type: "textarea" }, { name: "benefit1Light", label: "Semaforo 1", type: "select", options: ["Verde", "Amarelo", "Vermelho"] },
          { name: "benefit2", label: "Beneficio 2", type: "textarea" }, { name: "benefit2Light", label: "Semaforo 2", type: "select", options: ["Verde", "Amarelo", "Vermelho"] },
          { name: "benefit3", label: "Beneficio 3", type: "textarea" }, { name: "benefit3Light", label: "Semaforo 3", type: "select", options: ["Verde", "Amarelo", "Vermelho"] },
        ]},
        { title: "04 - CTA", grid: "grid-5", fields: [
          { name: "cta1", label: "CTA 1" }, { name: "cta2", label: "CTA 2" }, { name: "cta3", label: "CTA 3" }, { name: "cta4", label: "CTA 4" }, { name: "cta5", label: "CTA 5" }, { name: "ctaFinal", label: "CTA final" }, { name: "ctaAction", label: "O que acontece ao clicar" },
        ]},
        { title: "05 - Revisao final", fields: [{ name: "coherence", label: "Coerencia do bloco", type: "textarea" }] },
      ],
    },
  },
  "clase-3-identidad-visual": {
    es: activities[2],
    en: {
      eyebrow: "Class 3", title: "Documented visual identity", lead: "Define audience, hero image, palette, and icons using technical criteria, not only personal taste.", sideTitle: "Visual criteria", sideCopy: ["Visual decisions need to be explainable.", "Contrast, audience, and coherence are part of the submission."],
      sections: [
        { title: "1. Definitions", fields: [{ name: "audience", label: "Audience", type: "textarea" }, { name: "context", label: "Context", type: "textarea" }, { name: "mood", label: "Mood", type: "textarea" }] },
        { title: "2. Hero prompt", fields: [{ name: "heroPrompt", label: "Full prompt", type: "textarea" }] },
        { title: "3. Palette with HEX + contrast", grid: "grid-2", fields: [
          { name: "color1", label: "Background color", placeholder: "#000000" }, { name: "color2", label: "Text color", placeholder: "#fff7d6" }, { name: "color3", label: "Accent color", placeholder: "#2a3fe5" }, { name: "color4", label: "Secondary color", placeholder: "#f4b9b0" }, { name: "contrast", label: "Contrast check", type: "textarea" },
        ]},
        { title: "4. Icons", fields: [
          { name: "icons", label: "Method and style", type: "select", options: ["Linear library", "AI", "Manual drawing", "Geometric system"] }, { name: "iconsWhy", label: "Why it works for this audience", type: "textarea" },
        ]},
        { title: "5. Overall coherence", fields: [{ name: "coherence", label: "Personal review", type: "textarea" }] },
      ],
    },
    pt: {
      eyebrow: "Aula 3", title: "Identidade visual documentada", lead: "Defina publico, imagem hero, paleta e icones com criterios tecnicos, nao apenas a partir do gosto pessoal.", sideTitle: "Criterio visual", sideCopy: ["As decisoes visuais precisam poder ser explicadas.", "Contraste, publico e coerencia fazem parte da entrega."],
      sections: [
        { title: "1. Definicoes", fields: [{ name: "audience", label: "Publico", type: "textarea" }, { name: "context", label: "Contexto", type: "textarea" }, { name: "mood", label: "Mood", type: "textarea" }] },
        { title: "2. Prompt da hero", fields: [{ name: "heroPrompt", label: "Prompt completo", type: "textarea" }] },
        { title: "3. Paleta com HEX + contraste", grid: "grid-2", fields: [
          { name: "color1", label: "Cor de fundo", placeholder: "#000000" }, { name: "color2", label: "Cor do texto", placeholder: "#fff7d6" }, { name: "color3", label: "Cor de destaque", placeholder: "#2a3fe5" }, { name: "color4", label: "Cor secundaria", placeholder: "#f4b9b0" }, { name: "contrast", label: "Verificacao de contraste", type: "textarea" },
        ]},
        { title: "4. Icones", fields: [
          { name: "icons", label: "Metodo e estilo", type: "select", options: ["Biblioteca linear", "IA", "Desenho manual", "Sistema geometrico"] }, { name: "iconsWhy", label: "Por que funciona para este publico", type: "textarea" },
        ]},
        { title: "5. Coerencia geral", fields: [{ name: "coherence", label: "Revisao pessoal", type: "textarea" }] },
      ],
    },
  },
  "clase-5-auditoria-cambios": {
    es: activities[3],
    en: {
      eyebrow: "Class 5", title: "Audit and justification of changes", lead: "Identify important changes, apply them, and explain each decision using technical criteria.", sideTitle: "Critical eye", sideCopy: ["You can use AI to diagnose, but the final decision should stay under your control.", "The justification shows the process, not only the result."],
      sections: [
        { title: "Part A - Guided justification", fields: [
          { name: "removedWhat", label: "I removed the section..." }, { name: "removedWhy", label: "Because...", type: "textarea" }, { name: "textWhat", label: "I replaced the text..." }, { name: "textWhy", label: "To improve...", type: "textarea" }, { name: "imageWhat", label: "The most important image is..." }, { name: "imageWhy", label: "Because...", type: "textarea" }, { name: "impactWhat", label: "The highest-impact change was..." }, { name: "impactWhy", label: "Because...", type: "textarea" },
        ]},
        { title: "AI use", fields: [
          { name: "usedAi", label: "Did you use AI to correct or audit", type: "select", options: ["Yes", "No"] }, { name: "aiDetail", label: "Usage detail or personal criterion", type: "textarea" },
        ]},
      ],
    },
    pt: {
      eyebrow: "Aula 5", title: "Auditoria e justificativa de mudancas", lead: "Identifique mudancas importantes, aplique-as e explique cada decisao com criterio tecnico.", sideTitle: "Olhar critico", sideCopy: ["Voce pode usar IA para diagnosticar, mas a decisao final precisa ficar a seu cargo.", "A justificativa mostra o processo, nao apenas o resultado."],
      sections: [
        { title: "Parte A - Justificativa guiada", fields: [
          { name: "removedWhat", label: "Removi a secao..." }, { name: "removedWhy", label: "Porque...", type: "textarea" }, { name: "textWhat", label: "Substitui o texto..." }, { name: "textWhy", label: "Para melhorar...", type: "textarea" }, { name: "imageWhat", label: "A imagem mais importante e..." }, { name: "imageWhy", label: "Porque...", type: "textarea" }, { name: "impactWhat", label: "A mudanca de maior impacto foi..." }, { name: "impactWhy", label: "Porque...", type: "textarea" },
        ]},
        { title: "Uso de IA", fields: [
          { name: "usedAi", label: "Voce usou IA para corrigir ou auditar", type: "select", options: ["Sim", "Nao"] }, { name: "aiDetail", label: "Detalhe de uso ou criterio pessoal", type: "textarea" },
        ]},
      ],
    },
  },
};

export function normalizeLanguage(value?: string | null): Language {
  return supportedLanguages.includes(value as Language) ? (value as Language) : "es";
}

export function getActivity(slug: string, language: Language = "es") {
  const activity = activities.find((item) => item.slug === slug);
  if (!activity) return undefined;
  const translated = activityTranslations[activity.id]?.[language] || activity;
  return { ...activity, ...translated };
}
