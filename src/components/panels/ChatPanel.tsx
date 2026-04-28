import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Phone, Video, MoreVertical, Search } from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, Input, cn } from '@/components/ui';
import { useChatStore } from '@/store/chatStore';
import { useLeadsStore } from '@/store/leadsStore';
import { useChat } from '@/hooks/useChat';
import { LEAD_ORIGIN_LABEL, Lead } from '@/types';

function formatTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function ConversationList({
  leads,
  activeId,
  onSelect,
}: {
  leads: Lead[];
  activeId?: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const threads = useChatStore((s) => s.threads);

  const items = leads
    .filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
    .map((lead) => {
      const t = threads[lead.id];
      const last = t?.messages[t.messages.length - 1];
      return { lead, lastText: last?.content ?? lead.notes ?? 'Sem mensagens', lastAt: t?.lastMessageAt, unread: t?.unreadCount ?? 0 };
    })
    .sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? ''));

  return (
    <div className="w-full md:w-80 shrink-0 border-r border-border/60 flex flex-col">
      <div className="p-3 border-b border-border/60">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Buscar conversa"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-8">Nenhuma conversa</p>
        )}
        {items.map(({ lead, lastText, lastAt, unread }) => (
          <button
            key={lead.id}
            onClick={() => onSelect(lead.id)}
            className={cn(
              'w-full text-left px-3 py-3 border-b border-border/40 hover:bg-surface-2/60 transition flex gap-3',
              activeId === lead.id && 'bg-primary-500/10',
            )}
          >
            <Avatar name={lead.name} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-100 truncate">{lead.name}</span>
                <span className="text-[10px] text-slate-500 shrink-0">{formatTime(lastAt)}</span>
              </div>
              <p className="text-xs text-slate-400 truncate">{lastText}</p>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="outline">
                  {LEAD_ORIGIN_LABEL[lead.origin]}
                </Badge>
                {unread > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface ChatPanelProps {
  initialLeadId?: string;
}

export function ChatPanel({ initialLeadId }: ChatPanelProps) {
  const leads = useLeadsStore((s) => s.leads);
  const [activeId, setActiveId] = useState<string | undefined>(initialLeadId ?? leads[0]?.id);
  const [draft, setDraft] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  const lead = leads.find((l) => l.id === activeId);
  const { messages, send, suggestions, simulatingReply, loadingSuggestions } = useChat(activeId);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, simulatingReply]);

  useEffect(() => {
    if (initialLeadId) setActiveId(initialLeadId);
  }, [initialLeadId]);

  const submit = () => {
    if (!draft.trim()) return;
    send(draft);
    setDraft('');
  };

  return (
    <div className="flex h-full bg-surface/40 rounded-xl overflow-hidden border border-border/50">
      <ConversationList leads={leads} activeId={activeId} onSelect={setActiveId} />

      <div className="flex-1 flex flex-col min-w-0">
        {!lead ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={<Sparkles className="h-6 w-6" />}
              title="Selecione uma conversa"
              description="Escolha um lead à esquerda para iniciar o atendimento."
            />
          </div>
        ) : (
          <>
            <div className="h-16 px-4 border-b border-border/60 flex items-center gap-3">
              <Avatar name={lead.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{lead.name}</p>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-500">{lead.phone}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </div>

            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.05),transparent_50%)]"
            >
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xs text-slate-500">Nenhuma mensagem ainda. Use uma sugestão da IA abaixo para iniciar.</p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex',
                    m.sender === 'agent' ? 'justify-end' : 'justify-start',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[75%] px-3.5 py-2 rounded-2xl text-sm shadow-sm',
                      m.sender === 'agent'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-surface-2 text-slate-100 rounded-bl-sm',
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    <p className={cn(
                      'text-[10px] mt-1 opacity-70',
                      m.sender === 'agent' ? 'text-right' : '',
                    )}>
                      {formatTime(m.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {simulatingReply && (
                <div className="flex justify-start">
                  <div className="bg-surface-2 text-slate-300 px-3.5 py-2 rounded-2xl rounded-bl-sm text-sm">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-pulse" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:240ms]" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="px-4 py-2 border-t border-border/40 bg-surface-2/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent-400" />
                  <span className="text-[11px] font-semibold text-accent-400 uppercase tracking-wider">
                    Sugestões da IA
                  </span>
                  {loadingSuggestions && <span className="text-[10px] text-slate-500">gerando…</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setDraft(s)}
                      className="text-xs text-left px-3 py-1.5 rounded-lg bg-surface-2 border border-border/60 hover:border-accent-500/50 hover:bg-surface-2/80 text-slate-300 transition max-w-md truncate"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 border-t border-border/60 flex gap-2 items-end">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Digite uma mensagem... (Enter envia)"
                className="flex-1 resize-none rounded-lg bg-surface-2 border border-border/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 max-h-24"
              />
              <Button onClick={submit} disabled={!draft.trim()}>
                <Send className="h-4 w-4" />
                Enviar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
