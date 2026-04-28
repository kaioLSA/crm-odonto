import { useState } from 'react';
import { PipelineBoard } from '@/components/office';
import { LeadDetailsPanel } from '@/components/panels';
import { Lead } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui';
import { useLeads } from '@/hooks/useLeads';

export default function Pipeline() {
  const [selected, setSelected] = useState<Lead | undefined>();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { stats } = useLeads();

  const handleClick = (lead: Lead) => {
    setSelected(lead);
    setOpen(true);
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Pipeline de Atendimento</h1>
          <p className="text-sm text-slate-400">
            Arraste os cards entre as colunas para mover os leads no funil.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">{stats.total} leads</Badge>
          <Badge variant="success">{stats.closed} fechados</Badge>
          <Badge variant="info">R$ {stats.totalValue.toLocaleString('pt-BR')}</Badge>
        </div>
      </header>

      <div className="flex-1">
        <PipelineBoard onLeadClick={handleClick} />
      </div>

      <LeadDetailsPanel
        lead={selected}
        open={open}
        onClose={() => setOpen(false)}
        onOpenChat={(id) => navigate(`/chat?lead=${id}`)}
      />
    </div>
  );
}
