export type LeadOrigin = 'meta_ads' | 'organico' | 'indicacao' | 'google_ads' | 'whatsapp';

export type LeadStatus =
  | 'novo_lead'
  | 'contato_iniciado'
  | 'agendamento'
  | 'compareceu'
  | 'fechado';

export interface LeadInteraction {
  id: string;
  type: 'call' | 'message' | 'note' | 'meeting' | 'system';
  description: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  origin: LeadOrigin;
  status: LeadStatus;
  procedure?: string;
  estimatedValue?: number;
  notes?: string;
  tags?: string[];
  assignedTo?: string;
  isPatient?: boolean;
  patientId?: string;
  createdAt: string;
  updatedAt: string;
  interactions: LeadInteraction[];
}

export const LEAD_ORIGIN_LABEL: Record<LeadOrigin, string> = {
  meta_ads: 'Meta Ads',
  organico: 'Orgânico',
  indicacao: 'Indicação',
  google_ads: 'Google Ads',
  whatsapp: 'WhatsApp',
};

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  novo_lead: 'Novo Lead',
  contato_iniciado: 'Contato Iniciado',
  agendamento: 'Agendamento',
  compareceu: 'Compareceu',
  fechado: 'Fechado',
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  'novo_lead',
  'contato_iniciado',
  'agendamento',
  'compareceu',
  'fechado',
];
