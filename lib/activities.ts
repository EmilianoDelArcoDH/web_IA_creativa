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

export const activities: Activity[] = [
  {
    id: "clase-1-tu-primer-prompt",
    slug: "laboratorio-prompts",
    eyebrow: "Clase 1",
    title: "Tu primer prompt",
    lead: "Escribi un prompt claro, genera varias opciones y explica por que elegis una version final.",
    sideTitle: "Como trabajar",
    sideCopy: [
      "La IA sirve para generar opciones. Tu tarea es decidir, comparar y justificar.",
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
        fields: [
          { name: "prompt", label: "Prompt completo", type: "textarea" },
        ],
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
        fields: [
          { name: "analysis", label: "Analisis y eleccion final", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "clase-2-bloque-web",
    slug: "hero-ia",
    eyebrow: "Clase 2",
    title: "Bloque web con IA",
    lead: "Genera opciones, elegi una, editala y revisa si el bloque completo habla del mismo proyecto.",
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
        intro: "Genera 5 opciones con IA y despues escribi la version elegida.",
        grid: "grid-5",
        fields: [
          { name: "title1", label: "Titulo 1", type: "textarea" },
          { name: "title2", label: "Titulo 2", type: "textarea" },
          { name: "title3", label: "Titulo 3", type: "textarea" },
          { name: "title4", label: "Titulo 4", type: "textarea" },
          { name: "title5", label: "Titulo 5", type: "textarea" },
          { name: "titleFinal", label: "Titulo elegido y editado" },
        ],
      },
      {
        title: "02 - Subtitulo",
        grid: "grid-3",
        fields: [
          { name: "subtitle1", label: "Subtitulo 1", type: "textarea" },
          { name: "subtitle2", label: "Subtitulo 2", type: "textarea" },
          { name: "subtitle3", label: "Subtitulo 3", type: "textarea" },
          { name: "subtitleFinal", label: "Subtitulo elegido y editado", type: "textarea" },
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
          { name: "ctaFinal", label: "CTA elegido" },
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
    lead: "Defini audiencia, imagen hero, paleta e iconos con criterios tecnicos y no solo gusto personal.",
    sideTitle: "Criterio visual",
    sideCopy: [
      "Las decisiones visuales tienen que poder explicarse.",
      "Contraste, audiencia y coherencia son parte del entregable.",
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
          { name: "icons", label: "Metodo y estilo", type: "select", options: ["Libreria lineal", "IA", "Dibujo propio", "Sistema geometrico"] },
          { name: "iconsWhy", label: "Por que funciona para esta audiencia", type: "textarea" },
        ],
      },
      {
        title: "5. Coherencia general",
        fields: [{ name: "coherence", label: "Revision propia", type: "textarea" }],
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
      "Podes usar IA para diagnosticar, pero la decision final tiene que ser tuya.",
      "Las evidencias antes/despues muestran el proceso, no solo el resultado.",
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
          { name: "aiDetail", label: "Detalle de uso o criterio propio", type: "textarea" },
        ],
      },
      {
        title: "Parte B - Evidencias",
        grid: "grid-2",
        fields: [
          { name: "beforeFile", label: "Captura antes", placeholder: "antes.png" },
          { name: "afterFile", label: "Captura despues", placeholder: "despues.png" },
        ],
      },
    ],
  },
];

export function getActivity(slug: string) {
  return activities.find((activity) => activity.slug === slug);
}
