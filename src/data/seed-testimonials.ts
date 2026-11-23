import type { Testimonial } from "@/lib/types";

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "seed-testimonial-1",
    pseudonym: "Lucas M.",
    title: "Demorei três anos para admitir o que vivia dentro de casa",
    content:
      "Sempre achei que violência doméstica só acontecia quando havia agressão física. No meu casamento, tudo começou com críticas diárias sobre o meu jeito de falar, meu trabalho e minha família. Aos poucos, deixei de ver meus amigos para evitar brigas no fim de semana. Quando finalmente conversei com um psicólogo e ouvi que aquilo tinha nome, chorei pela primeira vez em anos. Hoje moro sozinho, durmo em paz e voltei a me reconhecer.",
    status: "approved",
    support_count: 23,
    created_at: "2026-03-14T11:20:00.000Z",
    replies: [
      {
        id: "seed-reply-1-1",
        testimonial_id: "seed-testimonial-1",
        pseudonym: "Daniel F.",
        content:
          "Ler isso me deu clareza. Eu também achava que sem agressão física não era abuso, e fui me afastando de todo mundo em silêncio. Obrigado por compartilhar.",
        status: "approved",
        created_at: "2026-03-16T09:10:00.000Z",
      },
      {
        id: "seed-reply-1-2",
        testimonial_id: "seed-testimonial-1",
        pseudonym: "Bruno T.",
        content:
          "Dormir em paz parece coisa pequena até o dia em que a gente recupera isso. Que bom saber que você está reencontrando o seu chão.",
        status: "approved",
        created_at: "2026-03-19T20:40:00.000Z",
      },
    ],
  },
  {
    id: "seed-testimonial-2",
    pseudonym: "Rafael S.",
    title: "Fiquei pelo meu filho, mas percebi que ele precisava de um pai inteiro",
    content:
      "Aguentei humilhações constantes por medo de perder a guarda do meu filho. Eu chegava do trabalho com o estômago embrulhado, tentando adivinhar qual seria o humor da casa naquela noite. Um dia meu filho de oito anos perguntou por que eu sempre pedia desculpas quando não tinha feito nada. Aquela frase virou uma chave. Procurei orientação jurídica, organizei minha saída com calma e hoje tenho convivência compartilhada e um lar sereno para ele.",
    status: "approved",
    support_count: 31,
    created_at: "2026-03-22T18:45:00.000Z",
    replies: [
      {
        id: "seed-reply-2-1",
        testimonial_id: "seed-testimonial-2",
        pseudonym: "Marcos A.",
        content:
          "A pergunta do seu filho me atingiu fundo. Estou passando por algo parecido e morro de medo de me afastar das minhas filhas. Ver que você conseguiu organizar tudo com calma me deu ânimo para procurar um advogado.",
        status: "approved",
        created_at: "2026-03-25T13:15:00.000Z",
      },
    ],
  },
  {
    id: "seed-testimonial-3",
    pseudonym: "André C.",
    title: "O controle financeiro era silencioso e quase invisível",
    content:
      "Eu trabalhava dez horas por dia, mas precisava prestar contas de cada café que tomava na rua. Meu salário caía numa conta que eu não podia movimentar livremente, e qualquer gasto pessoal virava motivo de semanas de silêncio punitivo. Tinha vergonha de contar isso para outros homens, com medo de virar piada. Ler relatos parecidos aqui me ajudou a entender que eu precisava recuperar minha autonomia.",
    status: "approved",
    support_count: 19,
    created_at: "2026-04-02T09:15:00.000Z",
    replies: [
      {
        id: "seed-reply-3-1",
        testimonial_id: "seed-testimonial-3",
        pseudonym: "Fábio L.",
        content:
          "Passei exatamente por essa vergonha de falar com amigos. Quando abri uma conta separada e voltei a ter controle do próprio salário, senti que estava respirando de novo.",
        status: "approved",
        created_at: "2026-04-05T17:30:00.000Z",
      },
    ],
  },
  {
    id: "seed-testimonial-4",
    pseudonym: "Thiago P.",
    title: "Passei a duvidar da minha própria memória",
    content:
      "Depois de discussões pesadas, ela dizia com total tranquilidade que nunca tinha falado aquelas ofensas e que eu estava inventando coisas. Cheguei a pensar que estava perdendo a lucidez. Comecei a anotar as datas e as falas num caderno escondido no trabalho. Reler aquelas anotações me devolveu o chão. Ainda estou em terapia, mas já consigo confiar no que eu vejo e sinto.",
    status: "approved",
    support_count: 27,
    created_at: "2026-04-11T21:10:00.000Z",
    replies: [
      {
        id: "seed-reply-4-1",
        testimonial_id: "seed-testimonial-4",
        pseudonym: "Gustavo R.",
        content:
          "Anotar os fatos foi o que salvou minha lucidez também. Quando a outra pessoa nega com tanta firmeza, a gente quase acredita que enlouqueceu. Força na sua terapia.",
        status: "approved",
        created_at: "2026-04-13T10:22:00.000Z",
      },
      {
        id: "seed-reply-4-2",
        testimonial_id: "seed-testimonial-4",
        pseudonym: "Henrique B.",
        content:
          "Obrigado por escrever isso. Comecei a usar o diário privado hoje depois de ler o seu relato.",
        status: "approved",
        created_at: "2026-04-16T22:05:00.000Z",
      },
    ],
  },
  {
    id: "seed-testimonial-5",
    pseudonym: "Eduardo R.",
    title: "Quando pedi ajuda pela primeira vez, descobri que existia escuta séria",
    content:
      "Eu carregava a ideia de que homem resolve tudo calado. Quando as crises de ansiedade começaram no meio da madrugada, liguei para o 188 sem saber direito o que dizer. Fui ouvido com respeito, sem julgamento e sem pressa. Na semana seguinte marquei minha primeira consulta com um terapeuta. Falar em voz alta tirou um peso que eu achava impossível de carregar.",
    status: "approved",
    support_count: 14,
    created_at: "2026-04-19T14:30:00.000Z",
    replies: [
      {
        id: "seed-reply-5-1",
        testimonial_id: "seed-testimonial-5",
        pseudonym: "Paulo N.",
        content:
          "Que bom saber que você foi bem recebido no 188. Muita gente trava na hora de ligar por achar que não vai ser levada a sério.",
        status: "approved",
        created_at: "2026-04-21T08:50:00.000Z",
      },
    ],
  },
  {
    id: "seed-testimonial-6",
    pseudonym: "Marcelo V.",
    title: "Voltar a fazer coisas simples sem medo mudou minha rotina",
    content:
      "Nos últimos meses do relacionamento, eu pedia permissão até para visitar minha mãe aos domingos. Se demorasse quinze minutos a mais no trânsito, meu celular enchia de mensagens acusatórias. Faz oito meses que encerrei essa relação. Ainda há dias difíceis, mas tomar café da manhã em silêncio, sem medo de uma explosão, tem um valor que eu só entendi depois de sair.",
    status: "approved",
    support_count: 11,
    created_at: "2026-04-28T16:05:00.000Z",
    replies: [
      {
        id: "seed-reply-6-1",
        testimonial_id: "seed-testimonial-6",
        pseudonym: "Rodrigo S.",
        content:
          "Me identifiquei demais com a parte do trânsito e das mensagens. Saber que existe tranquilidade do outro lado ajuda a manter a calma hoje.",
        status: "approved",
        created_at: "2026-04-30T19:12:00.000Z",
      },
    ],
  },
];
