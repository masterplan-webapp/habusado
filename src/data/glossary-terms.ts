export interface GlossaryTerm {
  slug: string;
  term: string;
  category: string;
  summary: string;
  everydayExample: string;
  howToRespond: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "gaslighting",
    term: "Gaslighting",
    category: "Manipulação Psicológica",
    summary:
      "Padrão contínuo em que a outra pessoa nega fatos, distorce conversas anteriores ou questiona sua sanidade até você perder a confiança na própria memória.",
    everydayExample:
      "Você lembra exatamente de uma ofensa dita na noite anterior, mas no dia seguinte ouve com calma: \"Eu nunca disse isso, você está inventando coisas de novo.\"",
    howToRespond:
      "Registre episódios importantes com data e contexto em um local privado. Evite debates longos tentando provar o óbvio e converse com alguém de confiança fora da relação.",
  },
  {
    slug: "tratamento-de-silencio",
    term: "Tratamento de Silêncio",
    category: "Punição Emocional",
    summary:
      "Recusa deliberada de conversar, responder perguntas básicas ou reconhecer a sua presença como forma de punição e controle após qualquer desacordo.",
    everydayExample:
      "Você discorda de um gasto ou visita sua família, e passa três dias dentro de casa sendo ignorado, sem resposta nem para assuntos práticos da rotina.",
    howToRespond:
      "Diferencie uma pausa combinada para esfriar a cabeça de uma punição silenciosa. Comunique de forma tranquila que está disponível para conversar quando houver respeito, sem implorar por atenção.",
  },
  {
    slug: "darvo-inversao-de-culpa",
    term: "DARVO / Inversão de Culpa",
    category: "Manipulação Psicológica",
    summary:
      "Sigla em inglês para Negar, Atacar e Inverter Vítima e Agressor. Sempre que você aponta um comportamento que machucou, a conversa vira contra você.",
    everydayExample:
      "Você comenta que ficou magoado com uma humilhação na frente dos amigos e, dez minutos depois, está pedindo desculpas porque a outra pessoa afirma que você a fez se sentir atacada.",
    howToRespond:
      "Mantenha o foco em um único fato objetivo por vez. Se a conversa virar um julgamento sobre o seu caráter, encerre o diálogo naquele momento.",
  },
  {
    slug: "isolamento-gradual",
    term: "Isolamento Gradual",
    category: "Controle Social",
    summary:
      "Afastamento lento e constante de amigos, familiares, colegas de trabalho e atividades pessoais, quase sempre disfarçado de ciúme, cuidado ou conflitos repetidos.",
    everydayExample:
      "Toda vez que você marca um almoço com amigos antigos ou visita seus pais, surge uma briga antes de sair ou uma crise na volta, até você desistir de ir para manter a paz.",
    howToRespond:
      "Retome contato com pelo menos uma pessoa de confiança, mesmo por mensagens curtas. Relações saudáveis convivem bem com amizades e vínculos familiares.",
  },
  {
    slug: "abuso-financeiro",
    term: "Abuso Financeiro",
    category: "Controle Patrimonial",
    summary:
      "Uso do dinheiro para limitar sua autonomia, vigiar cada gasto pessoal, acumular dívidas no seu nome ou impedir que você tenha acesso transparente às contas da casa.",
    everydayExample:
      "Seu salário vai inteiro para uma conta controlada pela outra pessoa, e você precisa pedir permissão ou justificar despesas básicas de transporte e alimentação.",
    howToRespond:
      "Organize extratos, comprovantes de renda e documentos bancários em local seguro. Mantenha uma conta individual em seu nome e procure orientação jurídica se houver dívidas ou bens em risco.",
  },
  {
    slug: "chantagem-emocional",
    term: "Chantagem Emocional",
    category: "Coerção",
    summary:
      "Uso de culpa, medo, ameaças de término, ameaças contra si mesma ou uso dos filhos para forçar você a ceder contra a própria vontade.",
    everydayExample:
      "Quando você impõe um limite simples, ouve frases como \"se você sair agora, nunca mais vai ver as crianças\" ou \"você está destruindo a minha saúde\".",
    howToRespond:
      "Reconheça que você é responsável pelas suas escolhas, mas não pelo descontrole emocional de outro adulto. Em caso de ameaça de autoagressão, acione ajuda médica ou familiar imediatamente.",
  },
  {
    slug: "ciclo-de-lua-de-mel",
    term: "Ciclo de Lua de Mel",
    category: "Dinâmica do Abuso",
    summary:
      "Fase de carinho intenso, promessas de mudança e pedidos de desculpas que aparece logo após uma explosão ou humilhação grave, renovando a esperança e prendendo você no ciclo.",
    everydayExample:
      "Depois de um fim de semana de ofensas pesadas, a outra pessoa prepara seu prato favorito, chora dizendo que vai mudar e tudo fica perfeito por duas semanas, até a tensão recomeçar.",
    howToRespond:
      "Observe mudanças consistentes ao longo de meses, em vez de promessas feitas no calor do arrependimento. Anotar as datas dos episódios ajuda a enxergar a repetição do ciclo.",
  },
  {
    slug: "triangulacao",
    term: "Triangulação",
    category: "Manipulação Psicológica",
    summary:
      "Introdução deliberada de terceiros (ex-parceiros, familiares, colegas ou amigos) na relação para gerar ciúme, insegurança ou pressionar você a provar seu valor.",
    everydayExample:
      "Comparações frequentes como \"o marido da minha amiga nunca me trataria assim\" ou relatos distorcidos da sua vida íntima para parentes ficarem contra você.",
    howToRespond:
      "Recuse entrar em competições fabricadas. Mantenha sua postura serena com terceiros e limite a exposição de assuntos internos do casal.",
  },
  {
    slug: "controle-digital",
    term: "Controle Digital",
    category: "Vigilância",
    summary:
      "Fiscalização invasiva de celular, senhas, redes sociais, e-mails, localização em tempo real ou exigência de respostas imediatas a qualquer hora do dia.",
    everydayExample:
      "Se você fica vinte minutos sem responder no trabalho, recebe dezenas de ligações, acusações de traição ou exigência de mandar foto para provar onde está.",
    howToRespond:
      "Revise senhas, sessões abertas e compartilhamento de localização em um dispositivo seguro. Privacidade básica é um direito dentro de qualquer relacionamento.",
  },
  {
    slug: "minimizacao-e-invalidacao",
    term: "Minimização e Invalidação",
    category: "Desgaste Emocional",
    summary:
      "Desqualificação constante da sua dor, cansaço ou desconforto, tratando sentimentos legítimos como exagero, fraqueza ou falta de masculinidade.",
    everydayExample:
      "Você relata estar exausto e ansioso com as brigas em casa e ouve: \"Que drama, você não aguenta nada mesmo, vira homem.\"",
    howToRespond:
      "Valide a própria experiência mesmo quando a outra pessoa se recusa a fazer isso. Busque escuta em terapia ou com pessoas que respeitem seus sentimentos.",
  },
  {
    slug: "sabotagem-de-sono-e-paz",
    term: "Sabotagem de Sono e Paz",
    category: "Desgaste Físico e Mental",
    summary:
      "Discussões iniciadas de madrugada, barulhos propositais antes de dias importantes ou crises recorrentes sempre que você tenta descansar ou se concentrar no trabalho.",
    everydayExample:
      "Na véspera de uma reunião decisiva ou prova, uma discussão sem fim começa à meia-noite e impede você de dormir até o amanhecer.",
    howToRespond:
      "Estabeleça o limite claro de não discutir de madrugada ou em estado de exaustão. Proteger o próprio sono é essencial para manter clareza mental.",
  },
  {
    slug: "alienacao-parental",
    term: "Alienação Parental",
    category: "Paternidade e Família",
    summary:
      "Campanha de desqualificação do pai diante dos filhos, criação de obstáculos para visitas ou manipulação emocional da criança para afastá-la do convívio paterno.",
    everydayExample:
      "Cancelamentos repetidos de última hora nos seus dias de convivência, ou falas frequentes para a criança sugerindo que o pai a abandonou ou não se importa.",
    howToRespond:
      "Mantenha registros objetivos de todas as tentativas de contato, participação escolar e combinados escritos. Procure orientação de um advogado de família para resguardar o vínculo.",
  },
];
