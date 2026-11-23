export interface SafetyPlanItem {
  id: string;
  text: string;
  tip?: string;
}

export interface SafetyPlanCategory {
  id: string;
  title: string;
  description: string;
  items: SafetyPlanItem[];
}

export interface DigitalPrivacyPlatform {
  id: string;
  platform: string;
  steps: string[];
}

export const SAFETY_PLAN_CATEGORIES: SafetyPlanCategory[] = [
  {
    id: "documentos-essenciais",
    title: "Documentos Essenciais",
    description:
      "Reunir cópias e originais com calma evita bloqueios burocráticos caso você precise sair de casa rapidamente.",
    items: [
      {
        id: "doc-pessoais",
        text: "RG, CPF, CNH, título de eleitor e passaporte reunidos ou digitalizados em local seguro.",
        tip: "Guarde fotos legíveis em uma pasta protegida em nuvem pessoal que apenas você acessa.",
      },
      {
        id: "doc-familia",
        text: "Certidão de casamento ou união estável e certidões de nascimento dos filhos.",
      },
      {
        id: "doc-saude",
        text: "Carteirinha do plano de saúde, cartão do SUS, receitas médicas e carteira de vacinação das crianças.",
      },
      {
        id: "doc-patrimonio",
        text: "Cópias de contratos de aluguel, escritura de imóvel, documento de veículo e declarações de Imposto de Renda.",
      },
    ],
  },
  {
    id: "protecao-financeira",
    title: "Proteção Financeira",
    description:
      "Autonomia financeira reduz a vulnerabilidade em momentos de ruptura ou pressão emocional.",
    items: [
      {
        id: "fin-conta",
        text: "Abrir ou manter uma conta bancária individual em seu nome, com correspondência apenas digital.",
      },
      {
        id: "fin-reserva",
        text: "Separar gradualmente uma reserva de emergência para transporte, alimentação e hospedagem inicial.",
        tip: "Mesmo valores pequenos guardados com constância garantem margem de manobra em um imprevisto.",
      },
      {
        id: "fin-extratos",
        text: "Salvar extratos bancários, holerites e comprovantes de pagamento das despesas da casa e dos filhos.",
      },
      {
        id: "fin-cartoes",
        text: "Verificar cartões adicionais, senhas bancárias e eventuais procurações em seu nome.",
      },
    ],
  },
  {
    id: "seguranca-digital",
    title: "Segurança Digital",
    description:
      "Proteger suas contas e dispositivos garante privacidade enquanto você busca informação e apoio.",
    items: [
      {
        id: "dig-email",
        text: "Criar uma conta de e-mail secundária exclusivamente para assuntos pessoais, jurídicos e de terapia.",
      },
      {
        id: "dig-senhas",
        text: "Trocar senhas previsíveis e ativar verificação em duas etapas no e-mail, banco e aplicativos de mensagem.",
        tip: "Evite datas de aniversário ou senhas que já foram usadas em outros serviços.",
      },
      {
        id: "dig-localizacao",
        text: "Revisar compartilhamento de localização em tempo real no celular, no Google Maps e no iCloud.",
      },
      {
        id: "dig-sessoes",
        text: "Encerrar sessões antigas no WhatsApp Web, computadores da casa e tablets compartilhados.",
      },
    ],
  },
  {
    id: "rede-de-apoio-e-saida",
    title: "Rede de Apoio e Saída Emergencial",
    description:
      "Ter combinados prévios com pessoas de confiança tira o peso de improvisar durante uma crise.",
    items: [
      {
        id: "apoio-contato",
        text: "Escolher um amigo ou familiar de confiança que saiba da situação e possa receber você por alguns dias se necessário.",
      },
      {
        id: "apoio-codigo",
        text: "Combinar uma palavra ou mensagem discreta com essa pessoa para sinalizar quando precisar de ajuda imediata.",
      },
      {
        id: "apoio-mochila",
        text: "Manter separada uma bolsa simples com roupas básicas, carregador de celular, chave reserva e medicamentos de uso contínuo.",
        tip: "Se não for seguro deixar em casa, você pode guardar no porta-malas do carro, no trabalho ou na casa de um familiar.",
      },
      {
        id: "apoio-emergencia",
        text: "Ter memorizados os números 190 (Polícia Militar), 192 (SAMU) e 188 (CVV) para qualquer urgência.",
      },
    ],
  },
];

export const DIGITAL_PRIVACY_GUIDE: DigitalPrivacyPlatform[] = [
  {
    id: "aba-anonima-iphone",
    platform: "Aba Anônima no iPhone (Safari)",
    steps: [
      "Abra o aplicativo Safari e toque no ícone de dois quadrados no canto inferior direito.",
      "Toque em \"Privada\" (ou deslize a barra inferior até a aba Privada).",
      "Toque no botão \"+\" para abrir uma página que não salva histórico nem cookies no aparelho.",
      "Ao terminar a leitura, feche a aba privada antes de bloquear a tela.",
    ],
  },
  {
    id: "aba-anonima-android",
    platform: "Aba Anônima no Android (Chrome)",
    steps: [
      "Abra o Google Chrome e toque nos três pontos no canto superior direito.",
      "Selecione \"Nova guia anônima\".",
      "Ative nas configurações de privacidade do Chrome a opção de bloquear guias anônimas com biometria ou PIN ao sair do aplicativo.",
      "Ao terminar, toque na notificação \"Fechar todas as guias anônimas\".",
    ],
  },
  {
    id: "aba-anonima-computador",
    platform: "Aba Anônima no Computador",
    steps: [
      "No Chrome ou Microsoft Edge: pressione Ctrl + Shift + N (Windows) ou Command + Shift + N (Mac).",
      "No Firefox ou Safari: pressione Ctrl + Shift + P (Windows) ou Command + Shift + N (Mac).",
      "Lembre que downloads de arquivos (.txt ou PDF) ainda ficam salvos na pasta Downloads do computador. Apague ou mova o arquivo após salvar em sua nuvem privada.",
    ],
  },
  {
    id: "limpeza-rapida-historico",
    platform: "Limpeza Rápida de Histórico",
    steps: [
      "No navegador do computador, pressione Ctrl + H (Windows) ou Command + Y (Mac) para abrir o histórico.",
      "Você pode apagar apenas visitas específicas do dia, em vez de limpar todo o histórico de meses, para não chamar atenção desnecessária.",
      "No celular, acesse o menu Histórico do navegador e remova os registros recentes individualmente ou da última hora.",
    ],
  },
  {
    id: "verificacao-localizacao",
    platform: "Verificação de Localização Compartilhada (Buscar / Find My e Google Maps)",
    steps: [
      "No iPhone: abra Ajustes > Privacidade e Segurança > Serviços de Localização > Compartilhar Minha Localização e verifique quem aparece na lista do app Buscar (Find My).",
      "No Google Maps (Android ou iPhone): toque na sua foto de perfil no canto superior direito > Compartilhamento de local e confira se há compartilhamento ativo com outra conta.",
      "Revise também aplicativos de família, rastreadores de veículo ou AirTags desconhecidos próximos a você.",
    ],
  },
  {
    id: "sessoes-ativas",
    platform: "Sessões Ativas (WhatsApp Web, Google e iCloud)",
    steps: [
      "No WhatsApp: abra Configurações (ou três pontos) > Dispositivos conectados e desconecte qualquer computador ou navegador que você não reconhece ou não usa mais.",
      "Na Conta Google: acesse myaccount.google.com/device-activity e saia de aparelhos antigos ou compartilhados.",
      "No iCloud (Apple): abra Ajustes > toque no seu nome no topo > role até a lista de dispositivos vinculados à sua conta e remova equipamentos que não estão sob seu controle.",
    ],
  },
];
