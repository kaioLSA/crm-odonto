import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, MoreHorizontal, Filter, Phone, Mail } from 'lucide-react';
import {
  Avatar, Badge, Button, Card, CardContent, EmptyState, Select,
} from '@/components/ui';
import { LeadDetailsPanel } from '@/components/panels';
import { useLeads } from '@/hooks/useLeads';
import {
  Lead, LEAD_ORIGIN_LABEL, LEAD_STATUS_LABEL, LeadOrigin, LeadStatus,
} from '@/types';

export default function Leads() {
  const navigate = useNavigate();
  const { filtered, filters, setFilters, leads } = useLeads();
  const [selected, setSelected] = useState<Lead | undefined>();
  const [open, setOpen] = useState(false);

  const openDetail = (lead: Lead) => {
    setSelected(lead);
    setOpen(true);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Leads & Pacientes</h1>
          <p className="text-sm text-slate-400">
            Lista completa de leads recebidos. Total: {leads.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select
            value={filters.origin ?? 'all'}
            onChange={(e) => setFilters({ origin: e.target.value as LeadOrigin | 'all' })}
            className="w-40"
          >
            <option value="all">Todas as origens</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="organico">Orgânico</option>
            <option value="indicacao">Indicação</option>
            <option value="whatsapp">WhatsApp</option>
          </Select>
          <Select
            value={filters.status ?? 'all'}
            onChange={(e) => setFilters({ status: e.target.value as LeadStatus | 'all' })}
            className="w-44"
          >
            <option value="all">Todos os status</option>
            <option value="novo_lead">Novo Lead</option>
            <option value="contato_iniciado">Contato Iniciado</option>
            <option value="agendamento">Agendamento</option>
            <option value="compareceu">Compareceu</option>
            <option value="fechado">Fechado</option>
          </Select>
        </div>
      </header>

      <Card>
        <CardContent className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500 border-b border-border/60">
                  <th className="px-5 py-3 font-medium">Lead</th>
                  <th className="px-5 py-3 font-medium">Contato</th>
                  <th className="px-5 py-3 font-medium">Origem</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Procedimento</th>
                  <th className="px-5 py-3 font-medium text-right">Valor</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState title="Nenhum lead encontrado" description="Ajuste os filtros ou aguarde novos leads via webhook." />
                    </td>
                  </tr>
                )}
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border/30 hover:bg-surface-2/30 transition cursor-pointer"
                    onClick={() => openDetail(lead)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={lead.name} size="sm" />
                        <div>
                          <p className="text-sm text-slate-100 font-medium">{lead.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" /> {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="primary" dot>{LEAD_ORIGIN_LABEL[lead.origin]}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="info">{LEAD_STATUS_LABEL[lead.status]}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-300">{lead.procedure ?? '—'}</td>
                    <td className="px-5 py-3 text-right text-emerald-400 font-medium tabular-nums">
                      {lead.estimatedValue ? `R$ ${lead.estimatedValue.toLocaleString('pt-BR')}` : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/chat?lead=${lead.id}`);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <LeadDetailsPanel
        lead={selected}
        open={open}
        onClose={() => setOpen(false)}
        onOpenChat={(id) => navigate(`/chat?lead=${id}`)}
      />
    </div>
  );
}
