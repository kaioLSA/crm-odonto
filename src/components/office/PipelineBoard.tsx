import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Lead, LeadStatus } from '@/types';
import { usePipeline } from '@/hooks/usePipeline';
import { Column } from './Column';

interface PipelineBoardProps {
  onLeadClick?: (lead: Lead) => void;
}

export function PipelineBoard({ onLeadClick }: PipelineBoardProps) {
  const { columns, moveLead } = usePipeline();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination, source } = result;
    if (destination.droppableId === source.droppableId) return;
    moveLead(draggableId, destination.droppableId as LeadStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
        {columns.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            leads={col.leads}
            totalValue={col.totalValue}
            onLeadClick={onLeadClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
