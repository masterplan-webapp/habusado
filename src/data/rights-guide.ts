export interface RightsSection {
  id: string;
  title: string;
  summary: string;
  points: string[];
  practicalTip: string;
}

export const RIGHTS_DISCLAIMER =
  "Este guia tem caráter estritamente informativo e educativo sobre noções gerais do direito brasileiro. Ele não substitui a análise individualizada de um advogado especialista em Direito de Família ou Direito Penal, nem da Defensoria Pública.";

export const RIGHTS_GUIDE_SECTIONS: RightsSection[] = [
  {
    id: "preservacao-licita-de-provas",
    title: "Preservação Lícita de Provas",
    summary:
      "Em conflitos familiares ou situações de violência psicológica, moral ou física, preservar registros de forma legal evita que a sua palavra fique isolada diante de versões distorcidas.",
    points: [
      "Capturas de tela (prints) de mensagens, ameaças ou ofensas devem mostrar data, hora e o número ou nome completo do remetente, sempre que possível.",
      "No Brasil, a jurisprudência do STF admite a gravação ambiental ou telefônica feita por um dos interlocutores da conversa, ou seja, quando você participa diretamente do diálogo, sem que isso exija aviso prévio.",
      "Não invada celulares, contas privadas ou dispositivos da outra pessoa, nem instale aplicativos espiões: provas obtidas de forma ilícita podem ser anuladas e gerar responsabilização contra você.",
      "Para mensagens digitais de maior relevância, existe a ata notarial em cartório de notas e plataformas de certificação digital de provas como a Verifact, que reforçam a autenticidade técnica do conteúdo.",
    ],
    practicalTip:
      "Guarde cópias organizadas por data em uma conta de e-mail nova, protegida por senha forte e verificação em duas etapas, fora do alcance de dispositivos compartilhados.",
  },
  {
    id: "guarda-e-convivencia-com-filhos",
    title: "Guarda e Convivência com Filhos",
    summary:
      "O medo de perder o vínculo com os filhos faz muitos pais suportarem ambientes hostis. Conhecer as regras básicas de guarda ajuda a planejar decisões com serenidade e segurança jurídica.",
    points: [
      "A guarda compartilhada é a regra no Código Civil brasileiro quando ambos os pais têm condições de exercer o poder familiar, mesmo que o casal não tenha boa relação entre si.",
      "Guarda compartilhada significa divisão equilibrada das decisões importantes sobre escola, saúde e rotina da criança, independentemente de qual casa seja a residência base.",
      "Sair de casa para preservar a integridade física ou emocional em meio a um conflito grave não retira automaticamente o seu direito de convivência nem caracteriza abandono dos filhos, desde que você mantenha assistência e procure formalizar o regime de convivência.",
      "Guarde comprovantes objetivos da sua participação na vida das crianças: reuniões escolares, consultas médicas, mensagens de acompanhamento e transferências para despesas dos filhos.",
    ],
    practicalTip:
      "Antes de mudar de endereço ou alterar a rotina com os filhos, consulte um advogado de família para estruturar a formalização da guarda e evitar mal-entendidos judiciais.",
  },
  {
    id: "alienacao-parental",
    title: "Alienação Parental",
    summary:
      "A Lei 12.318/2010 trata dos atos que interferem na formação psicológica da criança ou do adolescente para prejudicar o vínculo com um dos genitores.",
    points: [
      "Exemplos comuns incluem desqualificar o pai repetidamente diante dos filhos, dificultar chamadas ou visitas combinadas, omitir informações escolares ou médicas relevantes e mudar de cidade sem justificativa para afastar a criança.",
      "Reagir com agressividade ou falar mal do outro genitor para a criança agrava o sofrimento dela e enfraquece a sua posição em eventual avaliação psicossocial.",
      "Registre de maneira fria e cronológica cada impedimento de visita, cada recusa injustificada e as tentativas respeitosas de contato realizadas por escrito.",
      "Quando o padrão se repete, o juiz pode determinar acompanhamento psicológico, ampliação da convivência ou advertência formal após estudo técnico da equipe multidisciplinar.",
    ],
    practicalTip:
      "Mantenha toda comunicação sobre horários e cuidados dos filhos por texto objetivo e educado, sempre pensando que aquelas mensagens podem ser lidas por um juiz no futuro.",
  },
  {
    id: "defesa-contra-falsas-acusacoes",
    title: "Defesa Contra Falsas Acusações",
    summary:
      "Em separações altamente conflituosas, existe o risco de distorção de fatos ou imputações infundadas. Prevenção, calma e acompanhamento técnico imediato fazem diferença decisiva.",
    points: [
      "Se houver intimação, medida protetiva ou convocação policial, cumpra rigorosamente qualquer determinação judicial de afastamento e nunca tente resolver o assunto procurando a outra pessoa por conta própria.",
      "Procure imediatamente um advogado criminalista ou a Defensoria Pública antes de prestar depoimento ou enviar mensagens explicativas sob forte emoção.",
      "Reúna desde cedo elementos objetivos de rotina: comprovantes de localização lícitos (como ponto de trabalho, recibos, câmeras de condomínio), testemunhas e histórico íntegro de mensagens.",
      "Em momentos de provocação verbal dentro de casa, priorize se retirar do cômodo em silêncio em vez de discutir acaloradamente ou responder com gritos.",
    ],
    practicalTip:
      "Em qualquer audiência ou delegacia, atenha-se aos fatos verificáveis, leve cópias organizadas dos seus registros e mantenha postura serena.",
  },
  {
    id: "boletim-de-ocorrencia-e-defensoria",
    title: "Boletim de Ocorrência e Defensoria Pública",
    summary:
      "Homens que sofrem agressão física, ameaça, injúria, calúnia, dano patrimonial ou constrangimento ilegal têm direito pleno de registrar ocorrência e buscar assistência jurídica gratuita.",
    points: [
      "Em caso de agressão física ou lesão, procure atendimento médico imediato, solicite o prontuário detalhado e peça encaminhamento para exame de corpo de delito no IML ao registrar o Boletim de Ocorrência.",
      "O Boletim de Ocorrência pode ser registrado em delegacia comum ou pela Delegacia Virtual do seu estado, descrevendo data, local, fatos objetivos e eventuais testemunhas.",
      "Se você não tem condições financeiras de contratar advogado particular, a Defensoria Pública estadual oferece atendimento gratuito para ações de divórcio, guarda, pensão e defesa criminal.",
      "Para agendar atendimento na Defensoria Pública, ligue para o número 129 ou consulte o portal oficial da Defensoria do seu estado.",
    ],
    practicalTip:
      "Leve consigo um resumo escrito em tópicos com datas e fatos principais antes de ir à delegacia ou à Defensoria. Sob estresse, o papel ajuda a não esquecer detalhes importantes.",
  },
];
