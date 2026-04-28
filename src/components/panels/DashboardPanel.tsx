import { ReactNode } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, Badge, cn } from '@/components/ui';
import { useLeads } from '@/hooks/useLeads';
import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER, LEAD_ORIGIN_LABEL, Lead, LeadOrigin } from '@/types';

function StatCard({
  label,
  value,
  trend,
  trendType,
  icon,
  accent,
}: {
  label: string;
  value: ReactNode;
  trend?: string;
  trendType?: 'up' | 'down';
  icon: ReactNode;
  accent: string;
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2 text-xs">
                {trendType === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-rose-400" />
                )}
                <span className={trendType === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
                  {trend}
                </span>
                <span className="text-slate-600">vs. semana</span>
              </div>
            )}
          </div>
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', accent)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineFunnel() {
  const { leads, stats } = useLeads();
  const max = Math.max(...Object.values(stats.byStatus), 1);
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Funil de Atendimento</h3>
            <p className="text-xs text-slate-500">Distribuição de leads por estágio</p>
          </div>
          <Badge variant="primary">{leads.length} leads</Badge>
        </div>
        <div className="space-y-2.5">
          {LEAD_STATUS_ORDER.map((status) => {
            const count = stats.byStatus[status];
            const pct = max > 0 ? (count / max) * 100 : 0;
            return (
              <div key={status}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{LEAD_STATUS_LABEL[status]}</span>
                  <span className="text-slate-500">{count}</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function OriginBreakdown() {
  const { leads } = useLeads();
  const counts = leads.reduce<Record<LeadOrigin, number>>(
    (acc, l) => {
      acc[l.origin] = (acc[l.origin] ?? 0) + 1;
      return acc;
    },
    { meta_ads: 0, organico: 0, indicacao: 0, google_ads: 0, whatsapp: 0 },
  );
  const total = leads.length;
  const items = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const colors = ['bg-primary-500', 'bg-accent-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500'];

  return (
    <Card>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Origem dos Leads</h3>
          <p className="text-xs text-slate-500">De onde vêm seus leads</p>
        </div>
        <div className="space-y-3">
          {items.map(([origin, count], idx) => {
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={origin} className="flex items-center gap-3">
                <span className={cn('h-2 w-2 rounded-full shrink-0', colors[idx % colors.length])} />
                <span className="text-xs text-slate-300 flex-1">{LEAD_ORIGIN_LABEL[origin as LeadOrigin]}</span>
                <span className="text-xs text-slate-500 tabular-nums">{count}</span>
                <span className="text-xs text-slate-600 tabular-nums w-12 text-right">{pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  const { leads } = useLeads();
  const recent = [...leads]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Atividade Recente</h3>
            <p className="text-xs text-slate-500">Últimas atualizações de leads</p>
          </div>
        </div>
        <div className="space-y-3">
          {recent.map((l: Lead) => (
            <div key={l.id} className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-primary-500/15 text-primary-300 flex items-center justify-center text-xs font-semibold">
                {l.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 truncate">{l.name}</p>
                <p className="text-[11px] text-slate-500">
                  {LEAD_STATUS_LABEL[l.status]} • {LEAD_ORIGIN_LABEL[l.origin]}
                </p>
              </div>
              <span className="text-[11px] text-slate-600">
                {new Date(l.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPanel() {
  const { stats } = useLeads();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Leads"
          value={stats.total}
          trend="+12%"
          trendType="up"
          icon={<Users className="h-5 w-5 text-primary-300" />}
          accent="bg-primary-500/15"
        />
        <StatCard
          label="Em agendamento"
          value={stats.byStatus.agendamento}
          trend="+5%"
          trendType="up"
          icon={<Calendar className="h-5 w-5 text-amber-300" />}
          accent="bg-amber-500/15"
        />
        <StatCard
          label="Conversões"
          value={stats.closed}
          trend="+8%"
          trendType="up"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-300" />}
          accent="bg-emerald-500/15"
        />
        <StatCard
          label="Taxa de conversão"
          value={`${stats.conversionRate.toFixed(1)}%`}
          trend={stats.conversionRate > 20 ? '+2.3pp' : '-0.4pp'}
          trendType={stats.conversionRate > 20 ? 'up' : 'down'}
          icon={<TrendingUp className="h-5 w-5 text-accent-400" />}
          accent="bg-accent-500/15"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PipelineFunnel />
        </div>
        <OriginBreakdown />
      </div>

      <RecentActivity />
    </div>
  );
}
