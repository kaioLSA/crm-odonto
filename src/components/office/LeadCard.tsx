import { MessageCircle, Phone } from 'lucide-react';
import { Lead, LEAD_ORIGIN_LABEL } from '@/types';
import { Avatar, Badge, cn } from '@/components/ui';

interface LeadCardProps {
  lead: Lead;
  onClick?: (lead: Lead) => void;
  draggable?: boolean;
  isDragging?: boolean;
}

const originVariant: Record<string, 'primary' | 'info' | 'warning' | 'success' | 'default'> = {
  meta_ads: 'primary',
  google_ads: 'info',
  organico: 'success',
  indicacao: 'warning',
  whatsapp: 'success',
};

export function LeadCard({ lead, onClick, isDragging }: LeadCardProps) {
  return (
    <div
      onClick={() => onClick?.(lead)}
      className={cn(
        'group bg-surface-2/80 hover:bg-surface-2 border border-border/50 hover:border-primary-500/40',
        'rounded-lg p-3 cursor-pointer transition-all',
        'shadow-sm hover:shadow-glow',
        isDragging && 'rotate-1 shadow-2xl border-primary-500/60 bg-surface-2',
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={lead.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-100 truncate">
              {lead.name}
            </span>
            {lead.estimatedValue && (
              <span className="text-[11px] font-semibold text-emerald-400 whitespace-nowrap">
                R$ {lead.estimatedValue.toLocaleString('pt-BR')}
              </span>
            )}
          </div>
          {lead.procedure && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {lead.procedure}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <Badge variant={originVariant[lead.origin] ?? 'default'} dot>
          {LEAD_ORIGIN_LABEL[lead.origin]}
        </Badge>
        <div className="flex items-center gap-1 text-slate-500 group-hover:text-slate-300 transition">
          <Phone className="h-3 w-3" />
          <MessageCircle className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
