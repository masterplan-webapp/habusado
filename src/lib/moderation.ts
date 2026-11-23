import { GoogleGenAI } from "@google/genai";
import type { ModerationResult } from "./types";

const CRISIS_PATTERNS = [
  /suicid/i,
  /me matar/i,
  /tirar a propria vida/i,
  /acabar com tudo/i,
  /nao quero mais viver/i,
  /quero morrer/i,
  /vontade de morrer/i,
  /me machucar/i,
  /automutil/i,
  /cortar os pulsos/i,
  /overdose/i,
];

const VIOLENCE_PATTERNS = [
  /vou matar/i,
  /quero matar/i,
  /matar ela/i,
  /matar ele/i,
  /dar uma surra/i,
  /acabar com a raca/i,
  /vou me vingar/i,
  /plano de vinganca/i,
  /comprar uma arma/i,
  /vou agredir/i,
  /quebrar a cara dela/i,
  /quebrar a cara dele/i,
  /atear fogo/i,
  /envenenar/i,
];

const CPF_FORMATTED_REGEX = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/;
const CPF_LABELED_REGEX = /\bcpf\s*[:=]?\s*\d{11}\b/i;
const EMAIL_REGEX = /\b[^\s@]+@[^\s@]+\.[^\s@]{2,}\b/;
const PHONE_BR_REGEX = /(?:\+55\s?)?\(?\b[1-9]\d\)?\s?9?\d{4}[-\s]?\d{4}\b/;

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function runDeterministicCheck(text: string): ModerationResult | null {
  const normalized = normalizeText(text);

  if (CRISIS_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return {
      allowed: false,
      isCrisis: true,
      flag: "crisis",
      userMessage:
        "Percebemos sinais de sofrimento intenso no seu texto. Antes de publicar, procure apoio humano imediato: ligue 188 (CVV, 24h e gratuito), 190 (Polícia Militar) ou 192 (SAMU).",
    };
  }

  if (
    CPF_FORMATTED_REGEX.test(text) ||
    CPF_LABELED_REGEX.test(normalized) ||
    EMAIL_REGEX.test(text) ||
    PHONE_BR_REGEX.test(text)
  ) {
    return {
      allowed: false,
      isCrisis: false,
      flag: "pii",
      userMessage:
        "Para proteger sua privacidade e a de terceiros, remova dados identificáveis como CPF, telefone ou e-mail antes de enviar.",
    };
  }

  if (VIOLENCE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return {
      allowed: false,
      isCrisis: false,
      flag: "violence",
      userMessage:
        "Este espaço é dedicado ao acolhimento seguro. Não publicamos textos com ameaças, violência ou planos de vingança.",
    };
  }

  return null;
}

interface GeminiModerationPayload {
  allowed?: boolean;
  isCrisis?: boolean;
  flag?: string;
  userMessage?: string;
}

const MODERATION_PROMPT = `Você é o classificador de segurança do mural comunitário do portal Homem Abusado (Brasil).
Analise o texto enviado pelo usuário e retorne APENAS um objeto JSON válido com as chaves:
- "allowed": boolean (true se o texto pode ir para a fila de moderação humana, false se deve ser bloqueado agora)
- "isCrisis": boolean (true se houver sinal de ideação suicida, automutilação ou perigo físico imediato)
- "flag": string ("ok" | "crisis" | "violence" | "hate_speech" | "pii")
- "userMessage": string (mensagem breve, calma e respeitosa em português brasileiro caso allowed seja false; vazia se allowed for true)

Regras de bloqueio (allowed: false):
1. "crisis": ideação suicida, automutilação ou risco de morte imediato (defina isCrisis: true e cite CVV 188, PM 190 e SAMU 192 na userMessage).
2. "violence": ameaças, premeditação de crime, violência física ou planos de vingança contra alguém.
3. "hate_speech": discurso de ódio, misoginia generalizada ou incitação contra grupos.
4. "pii": exposição de dados pessoais de terceiros ou do próprio autor (nome completo identificável com sobrenome incomum, endereço residencial, local de trabalho específico, CPF, telefone, e-mail, redes sociais).

O que DEVE ser permitido (allowed: true):
- Desabafos sinceros e emotivos sobre viver abuso psicológico, financeiro, moral ou físico, desde que anônimos e sem ameaças ou ódio.
- Mensagens de apoio empático a outros homens no mural.

Responda somente com o JSON, sem blocos de markdown.`;

export async function moderateCommunityText(
  text: string
): Promise<ModerationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      allowed: false,
      isCrisis: false,
      flag: "empty",
      userMessage: "Escreva uma mensagem antes de enviar.",
    };
  }

  const fastResult = runDeterministicCheck(trimmed);
  if (fastResult) {
    return fastResult;
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { allowed: true, isCrisis: false, flag: "ok" };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: trimmed,
      config: {
        systemInstruction: MODERATION_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 250,
      },
    });

    const raw = response.text?.trim();
    if (!raw) {
      return { allowed: true, isCrisis: false, flag: "ok" };
    }

    const parsed = JSON.parse(raw) as GeminiModerationPayload;
    const isCrisis = Boolean(parsed.isCrisis);
    const allowed = isCrisis ? false : Boolean(parsed.allowed ?? true);

    if (!allowed) {
      return {
        allowed: false,
        isCrisis,
        flag: typeof parsed.flag === "string" ? parsed.flag : "blocked",
        userMessage:
          typeof parsed.userMessage === "string" && parsed.userMessage.trim()
            ? parsed.userMessage.trim()
            : isCrisis
              ? "Se você estiver em crise ou risco imediato, ligue para o CVV (188), Polícia Militar (190) ou SAMU (192)."
              : "Seu texto não pôde ser enviado pelas regras de privacidade e segurança da comunidade. Revise e remova dados identificáveis ou termos ofensivos.",
      };
    }

    return { allowed: true, isCrisis: false, flag: "ok" };
  } catch {
    return { allowed: true, isCrisis: false, flag: "ok" };
  }
}
