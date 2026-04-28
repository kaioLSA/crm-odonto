import { useMemo } from 'react';
import { useLeadsStore } from '@/store/leadsStore';
import { Lead, LEAD_STATUS_ORDER, LEAD_STATUS_LABEL, LeadStatus } from '@/types';

export interface PipelineColumn {
  id: LeadStatus;
  title: string;
  leads: Lead[];
  totalValue: number;
}

export function usePipeline() {
  const leads = useLeadsStore((s) => s.leads);
  const moveLead = useLeadsStore((s) => s.moveLead);

  const columns: PipelineColumn[] = useMemo(() => {
    return LEAD_STATUS_ORDER.map((status) => {
      const colLeads = leads.filter((l) => l.status === status);
      return {
        id: status,
        title: LEAD_STATUS_LABEL[status],
        leads: colLeads,
        totalValue: colLeads.reduce((sum, l) => sum + (l.estimatedValue ?? 0), 0),
      };
    });
  }, [leads]);

  return { columns, moveLead };
}
