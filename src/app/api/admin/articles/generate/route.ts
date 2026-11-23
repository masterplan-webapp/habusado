import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  ANTI_AI_SYSTEM_PROMPT,
  sanitizeAntiAiTypography,
} from "@/lib/anti-ai-guide";
import type { ArticleCategory } from "@/lib/types";

export const runtime = "nodejs";

const VALID_CATEGORIES: ArticleCategory[] = [
  "Sinais de Abuso",
  "Reconstrução",
  "Paternidade e Família",
  "Saúde Mental",
];

interface GenerateArticleBody {
  prompt?: string;
  category?: ArticleCategory;
  notes?: string;
}

interface GeneratedDraft {
  title: string;
  slug: string;
  excerpt: string;
  category: ArticleCategory;
  tags: string[];
  read_time: string;
  content: string;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 200));
  return `${minutes} min de leitura`;
}

function buildPreviewDraft(
  prompt: string,
  preferredCategory?: ArticleCategory,
  notes?: string
): GeneratedDraft {
  const category: ArticleCategory =
    preferredCategory && VALID_CATEGORIES.includes(preferredCategory)
      ? preferredCategory
      : "Sinais de Abuso";

  const cleanTopic = sanitizeAntiAiTypography(prompt.trim()).replace(/\.$/, "");
  const title =
    cleanTopic.length > 12 && cleanTopic.length <= 78
      ? cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)
      : "Como reconhecer limites e preservar sua saúde emocional";

  const noteParagraph = notes?.trim()
    ? `\n\n### Observações consideradas neste rascunho\n\n${sanitizeAntiAiTypography(notes.trim())}`
    : "";

  const content = sanitizeAntiAiTypography(`## Por que esse tema merece atenção calma

Quando um homem começa a pesquisar sobre ${cleanTopic.toLowerCase()}, raramente o faz por curiosidade passageira. Na maioria das vezes, existe um acúmulo silencioso de meses ou anos tentando ajustar o próprio comportamento para evitar conflitos em casa.

Reconhecer o que está acontecendo é um passo prático. Dar nome aos padrões ajuda a sair da confusão mental e devolve referência sobre o que é saudável dentro de uma relação.

## Sinais frequentes no cotidiano

Alguns comportamentos costumam se repetir de maneira gradual e difícil de apontar em um único episódio:

- Sensação constante de precisar medir cada palavra antes de falar.
- Culpa recorrente mesmo quando você apenas expressou um desconforto legítimo.
- Afastamento progressivo de amigos, familiares e atividades que antes traziam alívio.
- Cansaço emocional que afeta o sono, o trabalho e a presença com pessoas queridas.

## Passos práticos para recuperar clareza

Antes de tomar decisões definitivas, comece pelo que está ao seu alcance hoje. Anote episódios objetivos com data e contexto em um local privado. Essa prática simples ajuda a combater a dúvida sobre a própria memória.

Converse com alguém de confiança fora da relação ou procure atendimento psicológico especializado. Falar em voz alta com quem escuta sem julgamento quebra o isolamento que sustenta o abuso.${noteParagraph}

## Um lembrete importante

Este rascunho foi gerado em modo de visualização local porque a variável GEMINI_API_KEY não está configurada neste ambiente. Você pode editar o texto livremente abaixo antes de salvar ou publicar.`);

  return {
    title,
    slug: slugify(title) || `rascunho-${Date.now()}`,
    excerpt: sanitizeAntiAiTypography(
      `Reflexões práticas e sinais objetivos sobre ${cleanTopic.toLowerCase()}, com orientações serenas para preservar sua saúde emocional.`
    ),
    category,
    tags: ["limites", "saúde emocional", "acolhimento"],
    read_time: estimateReadTime(content),
    content,
  };
}

const EDITORIAL_SYSTEM_PROMPT = `Você é redator editorial do portal Homem Abusado (Brasil), voltado a homens que vivem ou viveram relacionamentos abusivos.

Diretrizes de conteúdo:
- Tom calmo, empático, humano, direto e respeitoso. Sem sensacionalismo e sem discurso de ódio.
- Nunca faça diagnósticos clínicos individuais nem dê conselhos jurídicos definitivos.
- Estruture o artigo em Markdown limpo com títulos H2 (##) e H3 (###), parágrafos curtos e exemplos cotidianos concretos, entre 600 e 850 palavras.

${ANTI_AI_SYSTEM_PROMPT}

Retorne APENAS um objeto JSON válido com estas chaves exatas:
{
  "title": "Título claro e editorial (máx. 80 caracteres)",
  "slug": "slug-sem-acentos-em-minusculas",
  "excerpt": "Resumo de 1 a 2 frases (máx. 180 caracteres)",
  "category": "Sinais de Abuso" | "Reconstrução" | "Paternidade e Família" | "Saúde Mental",
  "tags": ["tag1", "tag2", "tag3"],
  "read_time": "X min de leitura",
  "content": "Corpo completo do artigo em Markdown"
}`;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: GenerateArticleBody;
  try {
    body = (await request.json()) as GenerateArticleBody;
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  const preferredCategory =
    body.category && VALID_CATEGORIES.includes(body.category)
      ? body.category
      : undefined;

  if (prompt.length < 10) {
    return NextResponse.json(
      { error: "Descreva o tema do artigo com pelo menos 10 caracteres." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: true,
        draft: buildPreviewDraft(prompt, preferredCategory, notes),
        preview: true,
      },
      { status: 200 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const userPrompt = [
      `Tema solicitado: ${prompt}`,
      preferredCategory ? `Categoria preferida: ${preferredCategory}` : "",
      notes ? `Notas adicionais do editor: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: EDITORIAL_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.65,
        maxOutputTokens: 2400,
      },
    });

    const raw = response.text?.trim();
    if (!raw) {
      return NextResponse.json(
        {
          ok: true,
          draft: buildPreviewDraft(prompt, preferredCategory, notes),
          preview: true,
        },
        { status: 200 }
      );
    }

    const parsed = JSON.parse(raw) as Partial<GeneratedDraft>;
    const title = sanitizeAntiAiTypography(
      parsed.title?.trim() || prompt.slice(0, 75)
    );
    const content = sanitizeAntiAiTypography(parsed.content?.trim() || "");
    const excerpt = sanitizeAntiAiTypography(parsed.excerpt?.trim() || "");

    if (!content) {
      return NextResponse.json(
        {
          ok: true,
          draft: buildPreviewDraft(prompt, preferredCategory, notes),
          preview: true,
        },
        { status: 200 }
      );
    }

    const category: ArticleCategory =
      parsed.category && VALID_CATEGORIES.includes(parsed.category)
        ? parsed.category
        : preferredCategory ?? "Sinais de Abuso";

    const tags = Array.isArray(parsed.tags)
      ? parsed.tags
          .map((t) =>
            typeof t === "string" ? sanitizeAntiAiTypography(t.trim()) : ""
          )
          .filter(Boolean)
          .slice(0, 6)
      : ["acolhimento", "saúde emocional"];

    const draft: GeneratedDraft = {
      title,
      slug: slugify(parsed.slug?.trim() || title) || `artigo-${Date.now()}`,
      excerpt: excerpt || title,
      category,
      tags,
      read_time: parsed.read_time?.trim() || estimateReadTime(content),
      content,
    };

    return NextResponse.json({ ok: true, draft }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        ok: true,
        draft: buildPreviewDraft(prompt, preferredCategory, notes),
        preview: true,
      },
      { status: 200 }
    );
  }
}
