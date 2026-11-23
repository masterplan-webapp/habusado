export interface AboutSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface AboutContent {
  title: string;
  subtitle: string;
  coverImage: string;
  opening: string;
  sections: AboutSection[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  availability: string;
  description: string;
  website?: string;
}

export const ABOUT_CONTENT: AboutContent = {
  title: "Sobre o Homem Abusado",
  subtitle: "Um espaço sereno de acolhimento, informação e reconstrução para homens em relacionamentos abusivos.",
  coverImage: "/images/about-horizon.png",
  opening:
    "Olá, bem-vindo ao Homem Abusado. Este espaço nasceu de uma experiência pessoal dolorosa e da constatação de um vazio quase total: quando um homem sofre violência psicológica, moral, patrimonial ou física dentro de um relacionamento, quase sempre encontra silêncio, descrédito ou vergonha.",
  sections: [
    {
      id: "nossa-missao",
      heading: "Nossa Missão",
      paragraphs: [
        "Existimos para oferecer um lugar seguro, respeitoso e livre de julgamento para homens que vivem ou viveram relacionamentos abusivos. Queremos dar nome a dinâmicas que muitas vezes passam despercebidas durante anos, como manipulação emocional, isolamento gradual, controle financeiro e humilhação cotidiana.",
        "Acreditamos que reconhecer a própria dor exige coragem. Nosso compromisso é produzir informação clara, incentivar a busca por ajuda qualificada de forma responsável e lembrar a cada leitor que dignidade e paz dentro de casa são direitos de qualquer pessoa.",
      ],
    },
    {
      id: "o-que-oferecemos",
      heading: "O Que Oferecemos",
      paragraphs: [
        "Reunimos conteúdos editoriais aprofundados sobre sinais de abuso, saúde mental masculina, paternidade e reconstrução da autoestima. Cada texto é escrito para trazer clareza prática, sem sensacionalismo e sem fórmulas prontas.",
        "Também disponibilizamos o Termômetro de Relacionamento, o espaço de Relatos Anônimos para que experiências reais ajudem outros homens a quebrar o isolamento, o diretório curado de profissionais de Psicologia, Direito, Psiquiatria e Terapia, e o Haroldo, nosso assistente de escuta inicial para organizar pensamentos com privacidade.",
      ],
    },
    {
      id: "para-profissionais",
      heading: "Para Profissionais",
      paragraphs: [
        "Psicólogos, advogados de família, psiquiatras e terapeutas têm papel decisivo na recuperação de quem atravessa um relacionamento abusivo. Mantemos um diretório aberto para cadastro de profissionais devidamente registrados em seus conselhos de classe que atendam esse público com ética e escuta técnica.",
        "Cada inscrição passa por conferência antes de ir ao ar. Se você atua nessa frente e deseja ser encontrado por homens que precisam de atendimento sério, presencial ou online, faça seu cadastro na página de profissionais.",
      ],
    },
    {
      id: "uma-nota-pessoal",
      heading: "Uma Nota Pessoal",
      paragraphs: [
        "Quem passou por uma relação em que precisava pisar em ovos todos os dias conhece o peso de duvidar da própria memória e de esconder o sofrimento atrás de um sorriso no trabalho. Durante muito tempo, parece que ninguém vai acreditar ou que admitir a situação significa falhar como homem.",
        "Este projeto existe para que o caminho de saída seja menos solitário do que foi para mim. Nenhum conteúdo deste site substitui acompanhamento médico, psicológico ou jurídico, mas pode ser o primeiro ponto de apoio para você respirar fundo e dar o próximo passo com lucidez.",
      ],
    },
    {
      id: "vamos-juntos",
      heading: "Vamos Juntos",
      paragraphs: [
        "Reconstruir a própria vida leva tempo, e cada pessoa tem o seu ritmo. Leia com calma, use o botão de saída rápida sempre que precisar de privacidade e procure apoio profissional quando sentir que o peso ultrapassou o que você consegue carregar sozinho.",
        "Se quiser acompanhar nossos novos textos ou contribuir com a sua história de forma anônima, as portas estão abertas. O silêncio começa a perder força no momento em que a verdade encontra um espaço seguro para existir.",
      ],
    },
  ],
};

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "cvv",
    name: "CVV (Centro de Valorização da Vida)",
    phone: "188",
    availability: "24 horas, todos os dias, ligação gratuita e sigilosa",
    description:
      "Apoio emocional e prevenção do suicídio por telefone, chat ou e-mail, com atendimento voluntário e anônimo em todo o Brasil.",
    website: "https://www.cvv.org.br",
  },
  {
    id: "pm",
    name: "Polícia Militar",
    phone: "190",
    availability: "24 horas, todos os dias",
    description:
      "Acione imediatamente em situações de agressão física em andamento, ameaça grave à integridade ou risco imediato dentro ou fora de casa.",
  },
  {
    id: "samu",
    name: "SAMU (Serviço de Atendimento Móvel de Urgência)",
    phone: "192",
    availability: "24 horas, todos os dias",
    description:
      "Atendimento médico de emergência para ferimentos, crises agudas de saúde física ou situações que exijam socorro imediato.",
  },
  {
    id: "defensoria",
    name: "Defensoria Pública",
    phone: "129",
    availability: "Horário comercial (varia conforme o estado)",
    description:
      "Orientação jurídica gratuita em Direito de Família, divórcio, guarda de filhos e medidas de proteção para quem não pode arcar com advogado particular.",
    website: "https://www.anadep.org.br",
  },
  {
    id: "disque-100",
    name: "Disque 100 (Direitos Humanos)",
    phone: "100",
    availability: "24 horas, todos os dias, ligação gratuita",
    description:
      "Canal nacional para denúncias e orientações sobre violações de direitos humanos, incluindo violência contra crianças, adolescentes, idosos e pessoas em vulnerabilidade.",
    website: "https://www.gov.br/mdh/pt-br/ondh",
  },
];
