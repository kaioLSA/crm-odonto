import { useEffect, useMemo } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { useNotificationsStore } from '@/store/notificationsStore';
import { metaAdsService } from '@/services/integrations/metaAdsService';
import { Lead, LeadStatus } from '@/types';

export function useLeads() {
  const store = useLeadsStore();
  const filtered = useLeadsStore((s) => s.selectFiltered());

  useEffect(() => {
    store.initialize();
  }, []);

  const stats = useMemo(() => {
    const all = store.leads;
    const byStatus = all.reduce<Record<LeadStatus, number>>(
      (acc, l) => {
        acc[l.status] = (acc[l.status] ?? 0) + 1;
        return acc;
      },
      {
        novo_lead: 0,
        contato_iniciado: 0,
        agendamento: 0,
        compareceu: 0,
        fechado: 0,
      },
    );
    const total = all.length;
    const closed = byStatus.fechado;
    const conversionRate = total > 0 ? (closed / total) * 100 : 0;
    const totalValue = all
      .filter((l) => l.status === 'fechado')
      .reduce((sum, l) => sum + (l.estimatedValue ?? 0), 0);
    return { total, byStatus, closed, conversionRate, totalValue };
  }, [store.leads]);

  return {
    leads: store.leads,
    filtered,
    filters: store.filters,
    stats,
    addLead: store.addLead,
    updateLead: store.updateLead,
    moveLead: store.moveLead,
    addInteraction: store.addInteraction,
    setFilters: store.setFilters,
    selectLead: store.setSelectedLead,
    selectedLeadId: store.selectedLeadId,
    receiveSimulatedLead: store.receiveSimulatedLead,
  };
}

export function useMetaAdsSimulation(enabled: boolean) {
  const addLead = useLeadsStore((s) => s.addLead);
  const pushNotification = useNotificationsStore((s) => s.push);

  useEffect(() => {
    if (!enabled) return;
    const unsubscribe = metaAdsService.subscribeToWebhook((lead: Lead) => {
      addLead(lead);
      pushNotification({
        type: 'lead',
        title: 'Novo lead recebido',
        description: `${lead.name} via Meta Ads — ${lead.procedure ?? 'avaliação'}`,
        link: `/leads/${lead.id}`,
      });
    }, 30_000);
    return unsubscribe;
  }, [enabled, addLead, pushNotification]);
}
