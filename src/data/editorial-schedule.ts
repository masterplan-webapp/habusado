import type { ArticleCategory } from "@/lib/types";

export interface ScheduledTopic {
  weekOffset: number;
  title: string;
  category: ArticleCategory;
  prompt: string;
  coverImage: string;
}

export const EDITORIAL_TOPIC_QUEUE: ScheduledTopic[] = [
  {
    weekOffset: 13,
    title: "Quando o ciúme vira vigilância constante no celular",
    category: "Sinais de Abuso",
    prompt:
      "Escreva sobre como o ciúme disfarçado de cuidado evolui para fiscalização de celular, senhas, horários e mensagens no trabalho, e como recuperar limites básicos de privacidade com calma.",
    coverImage: "/images/article-gaslighting.png",
  },
  {
    weekOffset: 14,
    title: "A culpa que fica mesmo depois de você sair da relação",
    category: "Reconstrução",
    prompt:
      "Aborde a culpa residual após encerrar um relacionamento abusivo, especialmente quando o homem se sente responsável pelo sofrimento da ex-parceira ou por ter desfeito a casa, diferenciando responsabilidade adulta de culpa manipulada.",
    coverImage: "/images/article-reconstrucao.png",
  },
  {
    weekOffset: 15,
    title: "Como manter a calma quando as provocações acontecem na frente dos filhos",
    category: "Paternidade e Família",
    prompt:
      "Explique estratégias práticas para um pai não cair em provocações verbais diante das crianças, protegendo o ambiente emocional dos filhos e evitando reações que depois sejam usadas contra ele.",
    coverImage: "/images/article-paternidade.png",
  },
  {
    weekOffset: 16,
    title: "O corpo cobra a conta: insônia, gastrite e alerta constante",
    category: "Saúde Mental",
    prompt:
      "Fale sobre os sinais físicos do estresse crônico em relacionamentos hostis (sono quebrado, aperto no peito, dores musculares, queda de memória) e por que tantos homens tratam os sintomas sem ligar os pontos com o clima em casa.",
    coverImage: "/images/pillar-info.png",
  },
  {
    weekOffset: 17,
    title: "Triangulação: quando terceiros entram na briga para te desequilibrar",
    category: "Sinais de Abuso",
    prompt:
      "Explique o mecanismo da triangulação com parentes, amigos ou ex-parceiros, mostrando exemplos cotidianos e como sair desse jogo sem gastar energia tentando convencer todo mundo da sua versão.",
    coverImage: "/images/article-gaslighting.png",
  },
  {
    weekOffset: 18,
    title: "Como montar uma reserva de autonomia sem gerar guerra dentro de casa",
    category: "Reconstrução",
    prompt:
      "Traga orientações práticas e éticas para homens que perderam controle do próprio salário começarem a organizar documentos, extratos e uma conta individual com segurança e serenidade.",
    coverImage: "/images/article-reconstrucao.png",
  },
  {
    weekOffset: 19,
    title: "Por que a guarda compartilhada começa na rotina que você constrói hoje",
    category: "Paternidade e Família",
    prompt:
      "Mostre como a participação concreta do pai em escola, consultas médicas, alimentação e combinados escritos fortalece o vínculo com os filhos e sustenta o direito de convivência em caso de separação.",
    coverImage: "/images/article-paternidade.png",
  },
  {
    weekOffset: 20,
    title: "O medo de começar de novo depois dos 35 ou 40 anos",
    category: "Reconstrução",
    prompt:
      "Converse de forma direta sobre o receio de recomeçar a vida afetiva, financeira e doméstica mais velho após anos de desgaste, mostrando que paz cotidiana vale mais do que a aparência de estabilidade.",
    coverImage: "/images/about-horizon.png",
  },
  {
    weekOffset: 21,
    title: "Quando o humor da casa decide se você pode descansar ou trabalhar",
    category: "Sinais de Abuso",
    prompt:
      "Descreva a rotina de pisar em ovos e a sabotagem do descanso antes de dias importantes de trabalho, ajudando o leitor a reconhecer quando o cansaço crônico é provocado pelo ambiente relacional.",
    coverImage: "/images/pillar-info.png",
  },
  {
    weekOffset: 22,
    title: "Como voltar a confiar na própria percepção depois de anos de dúvida",
    category: "Saúde Mental",
    prompt:
      "Apresente hábitos simples para reconstruir a autoconfiança cognitiva após episódios repetidos de gaslighting e invalidação emocional, do diário de fatos às decisões pequenas do cotidiano.",
    coverImage: "/images/pillar-relatos.png",
  },
];
