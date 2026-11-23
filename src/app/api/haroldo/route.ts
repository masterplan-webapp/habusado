import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface HaroldoRequestBody {
  messages?: ChatMessage[];
  context?: string;
}

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
  /vai me matar/i,
  /me agredindo agora/i,
  /agressao fisica agora/i,
  /ameaca de morte/i,
  /esta com uma faca/i,
  /esta com arma/i,
  /bateu em mim agora/i,
  /correndo perigo agora/i,
  /risco imediato/i,
];

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function detectCrisis(text: string): boolean {
  const normalized = normalizeText(text);
  return CRISIS_PATTERNS.some((pattern) => pattern.test(normalized));
}

const CRISIS_REPLY = `O que você acabou de descrever envolve risco imediato e merece atenção humana agora. Você não precisa carregar esse peso sozinho.

Se você estiver com pensamentos de tirar a própria vida ou em sofrimento emocional intenso, ligue agora para o CVV (Centro de Valorização da Vida) no número 188. O atendimento funciona 24 horas por dia, é gratuito e totalmente sigiloso. Também há chat em cvv.org.br.

Se houver ameaça ou agressão física neste momento, saia para um lugar seguro e acione a Polícia Militar pelo 190. Para emergências médicas, ligue para o SAMU pelo 192.

Se puder, fale com alguém de confiança perto de você agora e procure um desses canais antes de qualquer outra coisa.`;

const SYSTEM_PROMPT = `Você é o H.Aroldo, um assistente de escuta do portal Homem Abusado.

Sua persona:
- Você fala como um amigo mais velho, calmo, empático, ponderado e livre de julgamentos.
- Você conversa com homens que vivem ou viveram relacionamentos abusivos.
- Você pratica escuta ativa: acolhe o que foi dito, valida o sentimento sem dramatizar e ajuda a pessoa a enxergar com mais clareza padrões como gaslighting, isolamento social, controle financeiro, chantagem emocional, inversão de culpa e desgaste da autoestima.
- Faça perguntas abertas e gentis, uma de cada vez, para ajudar a pessoa a organizar o próprio pensamento.

Limites obrigatórios:
- Nunca faça diagnósticos clínicos ou psicológicos (não diga que alguém "é narcisista" ou "tem transtorno"). Descreva comportamentos e impactos.
- Nunca dê aconselhamento jurídico definitivo. Sugira conversar com um advogado ou com a Defensoria Pública quando houver questões de guarda, patrimônio ou boletim de ocorrência.
- Protocolo de crise: se perceber qualquer sinal de ideação suicida, automutilação ou perigo físico imediato, comece sua resposta exatamente com o marcador [CRISE] na primeira linha e, em seguida, acolha com calma e direcione imediatamente para o CVV (188), Polícia Militar (190) e SAMU (192).

Estilo de escrita (estrito):
- Escreva em português brasileiro natural, humano, direto e acolhedor.
- Nunca use travessões, meia-risca ou hífen duplo. Use vírgulas e pontos finais.
- Evite listas longas e mecânicas. Prefira parágrafos curtos, como em uma conversa real.
- Evite clichês motivacionais vazios.`;

function buildDemoReply(lastUserMessage: string, context?: string): string {
  const normalized = normalizeText(lastUserMessage);

  if (normalized.includes("culpa")) {
    return `Carregar culpa constante dentro de um relacionamento desgasta muito a clareza. Quando quase toda conversa termina fazendo você se sentir errado por ter expressado um incômodo, vale observar se essa culpa nasce de algo que você realmente fez ou de uma dinâmica repetida de inversão de responsabilidade.

Se quiser me contar uma situação recente em que essa culpa apareceu, podemos olhar juntos para o que aconteceu passo a passo.

(Modo demonstração ativo: configure a variável GEMINI_API_KEY no servidor para habilitar respostas completas com Gemini 2.5 Flash.)`;
  }

  if (normalized.includes("abuso") || normalized.includes("sinais")) {
    return `Ter dúvida se o que você vive é abuso é muito comum, principalmente quando não existe agressão física explícita. Muitos homens passam anos achando que precisam apenas aguentar mais um pouco, mesmo sentindo medo das reações da parceira ou perdendo o contato com amigos e família.

O que mais tem pesado no seu dia a dia ultimamente? Pode começar pelo exemplo mais recente que vier à mente.

(Modo demonstração ativo: configure a variável GEMINI_API_KEY no servidor para habilitar respostas completas com Gemini 2.5 Flash.)`;
  }

  if (normalized.includes("proteger") || normalized.includes("limites")) {
    return `Pensar em como se proteger emocionalmente já é um passo importante. Em relações desgastantes, começar pequeno costuma ajudar: registrar por escrito o que aconteceu logo após discussões confusas, retomar contato com pelo menos uma pessoa de confiança fora da relação e evitar entrar em debates longos quando o objetivo da outra parte é apenas provocar exaustão.

Hoje você tem alguém com quem consiga falar abertamente sobre o que está passando, ou tem lidado com isso sozinho?

(Modo demonstração ativo: configure a variável GEMINI_API_KEY no servidor para habilitar respostas completas com Gemini 2.5 Flash.)`;
  }

  const contextNote = context
    ? "Li o resumo que você trouxe do Termômetro. "
    : "";

  return `${contextNote}Obrigado por dividir isso aqui. Leva tempo até conseguir colocar em palavras o que está acontecendo dentro de casa, ainda mais quando o desgaste já vem se acumulando há meses.

Sem pressa nenhuma: o que você sente que mais tem tirado a sua paz nas últimas semanas?

(Modo demonstração ativo: configure a variável GEMINI_API_KEY no servidor para habilitar respostas completas com Gemini 2.5 Flash.)`;
}

function streamText(text: string, isCrisis: boolean): Response {
  const encoder = new TextEncoder();
  const words = text.split(/(\s+)/);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        await new Promise((resolve) => setTimeout(resolve, 14));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Haroldo-Crisis": isCrisis ? "true" : "false",
    },
  });
}

export async function POST(request: Request) {
  let body: HaroldoRequestBody;
  try {
    body = (await request.json()) as HaroldoRequestBody;
  } catch {
    return Response.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const context =
    typeof body.context === "string" ? body.context.trim().slice(0, 1200) : "";

  const sanitizedMessages = messages
    .filter(
      (m): m is ChatMessage =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-20);

  if (sanitizedMessages.length === 0) {
    return Response.json(
      { error: "Envie pelo menos uma mensagem para conversar com o H.Aroldo." },
      { status: 400 }
    );
  }

  const latestUserMessage =
    [...sanitizedMessages].reverse().find((m) => m.role === "user")?.content ??
    "";

  if (detectCrisis(latestUserMessage)) {
    return streamText(CRISIS_REPLY, true);
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return streamText(buildDemoReply(latestUserMessage, context), false);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = context
      ? `${SYSTEM_PROMPT}\n\nContexto adicional enviado pelo usuário a partir do Termômetro de Sinais:\n${context}`
      : SYSTEM_PROMPT;

    const contents = sanitizedMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const geminiStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 900,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of geminiStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Haroldo-Crisis": "false",
      },
    });
  } catch {
    return streamText(buildDemoReply(latestUserMessage, context), false);
  }
}
