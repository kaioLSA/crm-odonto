import { useSearchParams } from 'react-router-dom';
import { ChatPanel } from '@/components/panels';

export default function Chat() {
  const [params] = useSearchParams();
  const initialLeadId = params.get('lead') ?? undefined;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Atendimento</h1>
        <p className="text-sm text-slate-400">
          Converse com seus leads em tempo real, com sugestões de IA.
        </p>
      </header>
      <div className="flex-1 min-h-[600px]">
        <ChatPanel initialLeadId={initialLeadId} />
      </div>
    </div>
  );
}
