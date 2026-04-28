import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead, LeadInteraction, LeadOrigin, LeadStatus } from '@/types';
import { metaAdsService } from '@/services/integrations/metaAdsService';
import { nowIso, uid } from '@/services/api';

interface LeadsFilters {
  origin?: LeadOrigin | 'all';
  status?: LeadStatus | 'all';
  search?: string;
}

interface LeadsState {
  leads: Lead[];
  filters: LeadsFilters;
  selectedLeadId?: string;
  hydrated: boolean;
  initialize: () => Promise<void>;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  moveLead: (id: string, status: LeadStatus) => void;
  addInteraction: (id: string, interaction: Omit<LeadInteraction, 'id' | 'createdAt'>) => void;
  setFilters: (filters: Partial<LeadsFilters>) => void;
  setSelectedLead: (id?: string) => void;
  selectFiltered: () => Lead[];
  receiveSimulatedLead: () => Promise<Lead>;
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set, get) => ({
      leads: [],
      filters: { origin: 'all', status: 'all', search: '' },
      hydrated: false,

      initialize: async () => {
        if (get().leads.length > 0) {
          set({ hydrated: true });
          return;
        }
        const seed = await metaAdsService.fetchInitialLeads(14);
        const distributed = seed.map((lead, idx) => {
          const statuses: LeadStatus[] = [
            'novo_lead', 'novo_lead', 'novo_lead', 'novo_lead',
            'contato_iniciado', 'contato_iniciado', 'contato_iniciado',
            'agendamento', 'agendamento',
            'compareceu', 'compareceu',
            'fechado', 'fechado', 'fechado',
          ];
          return { ...lead, status: statuses[idx] ?? 'novo_lead' };
        });
        set({ leads: distributed, hydrated: true });
      },

      addLead: (lead) =>
        set((state) => ({ leads: [lead, ...state.leads] })),

      updateLead: (id, patch) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, ...patch, updatedAt: nowIso() } : l,
          ),
        })),

      removeLead: (id) =>
        set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),

      moveLead: (id, status) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status,
                  updatedAt: nowIso(),
                  interactions: [
                    ...l.interactions,
                    {
                      id: uid('int'),
                      type: 'system' as const,
                      description: `Status alterado para "${status}"`,
                      createdAt: nowIso(),
                    },
                  ],
                }
              : l,
          ),
        })),

      addInteraction: (id, interaction) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  updatedAt: nowIso(),
                  interactions: [
                    ...l.interactions,
                    { ...interaction, id: uid('int'), createdAt: nowIso() },
                  ],
                }
              : l,
          ),
        })),

      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      setSelectedLead: (id) => set({ selectedLeadId: id }),

      selectFiltered: () => {
        const { leads, filters } = get();
        return leads.filter((l) => {
          if (filters.origin && filters.origin !== 'all' && l.origin !== filters.origin) return false;
          if (filters.status && filters.status !== 'all' && l.status !== filters.status) return false;
          if (filters.search) {
            const q = filters.search.toLowerCase();
            const hay = `${l.name} ${l.phone} ${l.email ?? ''} ${l.procedure ?? ''}`.toLowerCase();
            if (!hay.includes(q)) return false;
          }
          return true;
        });
      },

      receiveSimulatedLead: async () => {
        const lead = await metaAdsService.simulateWebhook();
        set((state) => ({ leads: [lead, ...state.leads] }));
        return lead;
      },
    }),
    {
      name: 'pixel-agents:leads',
      partialize: (state) => ({ leads: state.leads }),
    },
  ),
);
