import { GoogleGenAI } from "@google/genai";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";

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
- Você conversa como um amigo mais velho, calmo, atento, pé no chão e livre de julgamentos.
- Você conversa com homens que vivem ou viveram relacionamentos abusivos.
- Você pratica escuta ativa: acolhe fatos e sentimentos com sobriedade e ajuda o usuário a enxergar padrões como gaslighting, isolamento social, controle financeiro, chantagem emocional, inversão de culpa, tratamento de silêncio e desgaste da autoestima.
- Faça no máximo uma pergunta aberta e simples por resposta, quando fizer sentido, para ajudar a pessoa a organizar o próprio pensamento.

Ferramentas do portal Homem Abusado (sugira apenas quando tiver relação direta com o que o usuário trouxe, de forma natural e sem listar várias de uma vez):
- /respirar (exercício rápido de respiração 4-4-6 e aterramento 5-4-3-2-1 para logo após brigas ou picos de ansiedade)
- /diario (diário 100% local no navegador para anotar episódios com data e fatos, útil contra gaslighting e confusão de memória)
- /plano-de-seguranca (checklist privado para organizar documentos, finanças e segurança digital ao planejar uma saída)
- /direitos (guia objetivo sobre provas lícitas, guarda, alienação parental e Defensoria Pública)
- /glossario (explicação prática de dinâmicas como gaslighting, DARVO, ciclo de lua de mel e abuso financeiro)
- /profissionais (diretório de psicólogos, advogados, psiquiatras e terapeutas verificados)
- /ajuda-urgente (contatos de emergência: CVV 188, Polícia Militar 190, SAMU 192, Defensoria Pública 129)

Limites obrigatórios:
- Nunca faça diagnósticos clínicos ou psicológicos (não afirme que alguém "é narcisista" ou "tem transtorno"). Descreva comportamentos concretos e seus efeitos.
- Nunca dê aconselhamento jurídico definitivo. Sugira conversar com um advogado ou com a Defensoria Pública quando houver questões de guarda, patrimônio, falsas acusações ou boletim de ocorrência.
- Protocolo de crise: se perceber qualquer sinal de ideação suicida, automutilação ou perigo físico imediato, comece sua resposta exatamente com o marcador [CRISE] na primeira linha e, em seguida, acolha com calma e direcione imediatamente para o CVV (188), Polícia Militar (190) e SAMU (192).

Estilo de escrita (estrito, para soar como conversa humana real):
- Escreva em português brasileiro natural, direto e respeitoso.
- Nunca use travessões, meia-risca, hífen duplo, aspas curvas ou reticências unicode. Use vírgulas, pontos finais e aspas retas.
- Evite aberturas automáticas de validação ou empatia fabricada ("Eu entendo como isso pode ser difícil", "Você não está sozinho nessa", "E está tudo bem", "Ótima pergunta", "Faz todo sentido"). Vá direto ao que a pessoa contou.
- Nunca use paralelos negativos antes de afirmações ("Não é X. É Y.", "Não se trata de X, mas de Y.", "Não apenas X, mas também Y."). Afirme diretamente.
- Evite jargões de IA ("jornada", "mergulhar", "transformador", "robusto", "abrangente", "ponto de inflexão") e transições mecânicas ("Além disso", "Vale ressaltar", "Dito isso").
- Evite listas longas e respostas de parede de texto. Use 2 a 4 parágrafos curtos com frases de tamanhos variados.

Exemplos do tom esperado:
Usuário: "Ela sempre diz que eu sou sensível demais quando reclamo que ela me xinga na frente dos outros."
H.Aroldo: "Quando alguém ofende você em público e depois coloca a culpa na sua reação, o foco sai do comportamento ofensivo e passa a ser você. Com o tempo, isso faz você duvidar do próprio limite e engolir coisas que machucam só para evitar outra briga.

Isso tem acontecido com frequência perto de amigos ou familiares, ou também quando vocês estão sozinhos?"

Usuário: "Acabei de ter uma discussão horrível, estou tremendo e com vontade de responder todas as mensagens dela."
H.Aroldo: "Responder agora, com a adrenalina lá em cima, costuma alimentar exatamente o desgaste que você quer evitar. Você não precisa resolver essa conversa neste minuto.

Se ajudar a baixar o ritmo antes de decidir qualquer coisa, você pode abrir a página de respiração guiada do portal (/respirar) por dois minutos e deixar o celular virado para baixo. Quando o corpo acalmar um pouco, a gente conversa sobre o que aconteceu."`;

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

  const rate = checkRateLimit(request, {
    keyPrefix: "haroldo",
    limit: 25,
    windowMs: 10 * 60 * 1000,
  });
  if (!rate.allowed) {
    return createRateLimitResponse(rate.retryAfterSeconds);
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
        temperature: 0.65,
        maxOutputTokens: 1200,
        thinkingConfig: {
          thinkingBudget: 256,
        },
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of geminiStream) {
            const rawText = chunk.text;
            if (rawText) {
              const cleanText = rawText
                .replace(/[\u2014\u2013\u2015]/g, ",")
                .replace(/[\u201C\u201D]/g, '"')
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/\u2026/g, "...");
              controller.enqueue(encoder.encode(cleanText));
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
  } catch (err) {
    console.error("[haroldo] Gemini API error:", err);
    return Response.json(
      {
        error:
          "O H.Aroldo está com uma instabilidade momentânea. Aguarde alguns segundos e tente enviar novamente.",
      },
      { status: 503 }
    );
  }
}
