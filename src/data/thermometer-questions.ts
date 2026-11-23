import type { ThermometerOption, ThermometerQuestion } from "@/lib/types";

const STANDARD_OPTIONS: ThermometerOption[] = [
  { label: "Nunca", score: 0 },
  { label: "Raramente", score: 1 },
  { label: "Frequentemente", score: 2 },
  { label: "Quase sempre", score: 3 },
];

export const THERMOMETER_QUESTIONS: ThermometerQuestion[] = [
  {
    id: "q1",
    category: "Crítica constante",
    question:
      "Você ouve críticas frequentes sobre sua aparência, seu trabalho, seu jeito de falar ou suas decisões, a ponto de se sentir incapaz ou insuficiente?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q2",
    category: "Isolamento",
    question:
      "Você deixou de ver amigos, familiares ou colegas porque sabe que isso vai gerar discussões, ciúme excessivo ou silêncio punitivo depois?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q3",
    category: "Controle de privacidade e finanças",
    question:
      "A outra pessoa exige suas senhas, fiscaliza suas mensagens ou controla como você usa o próprio dinheiro sem acordo justo entre vocês?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q4",
    category: "Medo de reações",
    question:
      "Você sente tensão ou medo ao dar uma notícia simples, discordar de uma opinião ou voltar para casa no fim do dia?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q5",
    category: "Pisar em ovos",
    question:
      "Você mede cada palavra e ensaia o que vai dizer para evitar explosões de raiva, ironias cortantes ou brigas repentinas?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q6",
    category: "Inversão de culpa",
    question:
      "Quando você tenta conversar sobre algo que te machucou, o assunto acaba virando contra você e você termina pedindo desculpas?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q7",
    category: "Minimização de sentimentos",
    question:
      "Seus sentimentos, cansaço ou preocupações são tratados com desprezo, ironia ou frases como \"você está exagerando\" e \"isso é frescura\"?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q8",
    category: "Chantagem emocional",
    question:
      "A outra pessoa usa ameaças de término, afastamento dos filhos, culpa ou drama intenso para forçar você a ceder?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q9",
    category: "Sono e paz mental",
    question:
      "A tensão da relação tem atrapalhado seu sono, sua concentração no trabalho ou sua tranquilidade física no dia a dia?",
    options: STANDARD_OPTIONS,
  },
  {
    id: "q10",
    category: "Perda de identidade",
    question:
      "Você sente que abriu mão de gostos, hobbies, opiniões ou projetos pessoais e já tem dificuldade de reconhecer quem você era antes dessa relação?",
    options: STANDARD_OPTIONS,
  },
];

export type ThermometerTier = "low" | "moderate" | "elevated";

export interface ThermometerResult {
  tier: ThermometerTier;
  score: number;
  maxScore: number;
  title: string;
  summary: string;
  guidance: string[];
  recommendedSlugs: string[];
  haroldoPrompt: string;
}

export const THERMOMETER_MAX_SCORE = THERMOMETER_QUESTIONS.length * 3;

export function THERMOMETER_RESULTS(score: number): ThermometerResult {
  const safeScore = Math.max(0, Math.min(score, THERMOMETER_MAX_SCORE));

  if (safeScore <= 9) {
    return {
      tier: "low",
      score: safeScore,
      maxScore: THERMOMETER_MAX_SCORE,
      title: "Sinais pontuais de desgaste",
      summary:
        "Suas respostas indicam pouca frequência dos padrões de controle e desgaste emocional avaliados. Ainda assim, se alguma situação específica te incomodou o suficiente para procurar este termômetro, esse incômodo merece atenção e conversa honesta.",
      guidance: [
        "Observe quais perguntas receberam pontuação maior que zero e avalie se são episódios isolados ou algo que vem crescendo.",
        "Mantenha vivas suas amizades, hobbies e conversas fora da relação.",
        "Se quiser organizar o que está sentindo em um espaço anônimo, você pode conversar com o Haroldo.",
      ],
      recommendedSlugs: [
        "o-peso-do-silencio-na-saude-mental-masculina",
        "sinais-silenciosos-de-gaslighting",
      ],
      haroldoPrompt: `Fiz o Termômetro de Relacionamento e minha pontuação foi ${safeScore} de ${THERMOMETER_MAX_SCORE} (nível baixo). Mesmo assim, existem situações pontuais na minha relação que estão me incomodando e eu gostaria de conversar com calma para entender melhor o que estou sentindo.`,
    };
  }

  if (safeScore <= 19) {
    return {
      tier: "moderate",
      score: safeScore,
      maxScore: THERMOMETER_MAX_SCORE,
      title: "Sinais relevantes de desgaste emocional",
      summary:
        "Suas respostas mostram padrões recorrentes que costumam corroer a paz mental e a autoestima ao longo do tempo. Esse resultado não é um diagnóstico clínico, mas um alerta sereno de que você merece olhar com cuidado para os limites da sua relação.",
      guidance: [
        "Anote em local privado situações que deixam você confuso ou tenso, para enxergar o padrão com mais clareza.",
        "Retome contato com um amigo de confiança ou familiar e evite carregar tudo em silêncio.",
        "Considere uma primeira conversa com um psicólogo para avaliar seus limites com apoio profissional.",
      ],
      recommendedSlugs: [
        "sinais-silenciosos-de-gaslighting",
        "como-reconstruir-autoestima-apos-relacionamento-abusivo",
      ],
      haroldoPrompt: `Fiz o Termômetro de Relacionamento e minha pontuação foi ${safeScore} de ${THERMOMETER_MAX_SCORE} (nível moderado). Tenho vivido situações recorrentes de desgaste e confusão emocional em casa e gostaria de conversar para clarear meus próximos passos.`,
    };
  }

  return {
    tier: "elevated",
    score: safeScore,
    maxScore: THERMOMETER_MAX_SCORE,
    title: "Sinais elevados de ambiente emocionalmente hostil",
    summary:
      "Suas respostas apontam uma presença frequente de dinâmica de controle, desgaste constante e perda de tranquilidade. Você tem o direito de viver com respeito, segurança emocional e autonomia. Dar um passo de cada vez, com apoio adequado, ajuda a recuperar o controle da sua vida.",
    guidance: [
      "Procure apoio profissional em psicologia e, se houver filhos ou patrimônio envolvidos, busque orientação jurídica preventiva.",
      "Priorize sua segurança física e emocional. Em momentos de crise aguda ou risco imediato, utilize os contatos de emergência.",
      "Converse com o Haroldo agora se precisar organizar seus pensamentos antes de falar com alguém próximo.",
    ],
    recommendedSlugs: [
      "como-reconstruir-autoestima-apos-relacionamento-abusivo",
      "paternidade-e-protecao-emocional-em-relacoes-dificeis",
    ],
    haroldoPrompt: `Fiz o Termômetro de Relacionamento e minha pontuação foi ${safeScore} de ${THERMOMETER_MAX_SCORE} (nível elevado). Estou me sentindo muito desgastado emocionalmente na minha relação atual e preciso de ajuda para organizar minhas ideias com calma e segurança.`,
  };
}
