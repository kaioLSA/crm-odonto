import { Lead, LeadOrigin } from '@/types';
import { delay, nowIso, uid } from '../api';

const FIRST_NAMES = [
  'Mariana', 'Lucas', 'Ana Clara', 'Felipe', 'Gabriela', 'Rafael',
  'Camila', 'Bruno', 'Larissa', 'Vinícius', 'Beatriz', 'Tiago',
  'Juliana', 'Henrique', 'Patrícia', 'Eduardo', 'Sofia', 'André',
];
const LAST_NAMES = [
  'Souza', 'Oliveira', 'Pereira', 'Lima', 'Costa', 'Almeida',
  'Ribeiro', 'Carvalho', 'Mendes', 'Cardoso', 'Rocha', 'Barros',
];
const PROCEDURES = [
  'Implante dentário',
  'Clareamento',
  'Avaliação ortodôntica',
  'Limpeza profissional',
  'Lente de contato dental',
  'Tratamento de canal',
  'Aparelho ortodôntico',
];

const CAMPAIGNS = [
  'Campanha Implantes - SP',
  'Lente de Contato Dental',
  'Black Friday Odonto',
  'Avaliação Gratuita',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  const ddd = 11 + Math.floor(Math.random() * 89);
  const part1 = 90000 + Math.floor(Math.random() * 9999);
  const part2 = 1000 + Math.floor(Math.random() * 8999);
  return `(${ddd}) 9${part1.toString().slice(0, 4)}-${part2}`;
}

export interface MetaAdsWebhookPayload {
  campaign: string;
  leadName: string;
  phone: string;
  email?: string;
  procedure?: string;
}

export function generateMetaAdsLead(): Lead {
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const procedure = pick(PROCEDURES);
  const origin: LeadOrigin = 'meta_ads';
  return {
    id: uid('lead'),
    name,
    phone: randomPhone(),
    email: `${name.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@gmail.com`,
    origin,
    status: 'novo_lead',
    procedure,
    estimatedValue: 500 + Math.floor(Math.random() * 8000),
    notes: `Veio da campanha "${pick(CAMPAIGNS)}" interessado(a) em ${procedure.toLowerCase()}.`,
    tags: [pick(['quente', 'morno', 'frio'])],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    interactions: [
      {
        id: uid('int'),
        type: 'system',
        description: 'Lead recebido automaticamente via Meta Ads (webhook)',
        createdAt: nowIso(),
      },
    ],
  };
}

export const metaAdsService = {
  async fetchInitialLeads(count = 12): Promise<Lead[]> {
    await delay(180);
    const leads: Lead[] = [];
    for (let i = 0; i < count; i++) {
      leads.push(generateMetaAdsLead());
    }
    return leads;
  },

  async simulateWebhook(): Promise<Lead> {
    await delay(220);
    return generateMetaAdsLead();
  },

  subscribeToWebhook(callback: (lead: Lead) => void, intervalMs = 25_000): () => void {
    const id = window.setInterval(() => {
      callback(generateMetaAdsLead());
    }, intervalMs);
    return () => window.clearInterval(id);
  },
};
