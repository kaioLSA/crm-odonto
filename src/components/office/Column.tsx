import { Droppable, Draggable } from '@hello-pangea/dnd';
import { LeadStatus, Lead } from '@/types';
import { LeadCard } from './LeadCard';
import { cn } from '@/components/ui';

interface ColumnProps {
  id: LeadStatus;
  title: string;
  leads: Lead[];
  totalValue: number;
  onLeadClick?: (lead: Lead) => void;
}

const columnAccent: Record<LeadStatus, string> = {
  novo_lead: 'bg-blue-500',
  contato_iniciado: 'bg-indigo-500',
  agendamento: 'bg-purple-500',
  compareceu: 'bg-cyan-500',
  fechado: 'bg-emerald-500',
};

export function Column({ id, title, leads, totalValue, onLeadClick }: ColumnProps) {
  return (
    <div className="flex flex-col w-72 shrink-0 bg-surface/60 border border-border/50 rounded-xl overflow-hidden">
      <div className="px-3 py-3 border-b border-border/50 bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', columnAccent[id])} />
            <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
            <span className="text-xs text-slate-500 bg-surface-2 px-1.5 py-0.5 rounded">
              {leads.length}
            </span>
          </div>
        </div>
        {totalValue > 0 && (
          <p className="text-[11px] text-slate-500 mt-1">
            R$ {totalValue.toLocaleString('pt-BR')} em pipeline
          </p>
        )}
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px] transition-colors',
              snapshot.isDraggingOver && 'bg-primary-500/5',
            )}
          >
            {leads.map((lead, idx) => (
              <Draggable key={lead.id} draggableId={lead.id} index={idx}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <LeadCard
                      lead={lead}
                      onClick={onLeadClick}
                      isDragging={dragSnapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {leads.length === 0 && (
              <div className="text-center text-xs text-slate-600 py-8 border border-dashed border-border/40 rounded-lg">
                Arraste leads para cá
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
