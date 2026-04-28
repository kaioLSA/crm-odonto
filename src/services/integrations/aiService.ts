import { Lead, Message } from '@/types';
import { delay } from '../api';

const SUGGESTIONS_BY_STATUS: Record<string, string[]> = {
  novo_lead: [
    'Olá {nome}! Aqui é da Premium Odonto. Vi que você se interessou pelo procedimento de {procedimento}. Posso te ajudar a tirar dúvidas?',
    'Oi {nome}, tudo bem? Recebemos seu contato sobre {procedimento}. Que tal agendarmos uma avaliação gratuita?',
    'Olá {nome}! Obrigado pelo interesse 🦷 Posso te enviar mais detalhes sobre {procedimento}?',
  ],
  contato_iniciado: [
    'Você teria disponibilidade essa semana para uma avaliação presencial?',
    'Posso te enviar alguns horários disponíveis para agendarmos a consulta?',
    'Quer que eu reserve um horário ainda hoje? Temos vagas para amanhã também.',
  ],
  agendamento: [
    'Confirmando seu horário: {procedimento} agendado. Pode contar com a gente!',
    'Lembrete amigável da sua consulta. Qualquer coisa, é só me chamar por aqui.',
    'Está tudo certo para a sua avaliação? Posso te ajudar com algo antes?',
  ],
  compareceu: [
    'Foi ótimo te receber! Como você está se sentindo após a consulta?',
    'Conseguiu avaliar a proposta do tratamento? Posso esclarecer alguma dúvida?',
    'Que bom ter te conhecido! Quer que eu já agende o próximo passo do tratamento?',
  ],
  fechado: [
    'Bem-vindo(a) à família Premium Odonto! Obrigado pela confiança 🙌',
    'Vamos cuidar muito bem de você! Qualquer coisa, estamos por aqui.',
    'Combinado! Já está tudo agendado no nosso sistema. Até breve!',
  ],
};

const RESPONSE_TEMPLATES = [
  'Oi! Tenho interesse sim, pode me passar valores?',
  'Que horários vocês têm disponíveis?',
  'Vocês aceitam parcelar no cartão?',
  'Onde fica a clínica?',
  'Posso levar acompanhante?',
  'Tudo certo, pode confirmar para mim por favor.',
];

function fillTemplate(template: string, lead: Lead): string {
  return template
    .replace('{nome}', lead.name.split(' ')[0])
    .replace('{procedimento}', lead.procedure ?? 'tratamento odontológico');
}

export const aiService = {
  async suggestReplies(lead: Lead, _history: Message[] = []): Promise<string[]> {
    await delay(280);
    const pool = SUGGESTIONS_BY_STATUS[lead.status] ?? SUGGESTIONS_BY_STATUS.novo_lead;
    return pool.map((tpl) => fillTemplate(tpl, lead));
  },

  async simulateLeadReply(): Promise<string> {
    await delay(900 + Math.random() * 1200);
    return RESPONSE_TEMPLATES[Math.floor(Math.random() * RESPONSE_TEMPLATES.length)];
  },
};
