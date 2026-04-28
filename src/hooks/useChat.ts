import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useLeadsStore } from '@/store/leadsStore';
import { aiService } from '@/services/integrations/aiService';
import { Message } from '@/types';

export function useChat(leadId?: string) {
  const ensureThread = useChatStore((s) => s.ensureThread);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const receiveMessage = useChatStore((s) => s.receiveMessage);
  const setActive = useChatStore((s) => s.setActive);
  const thread = useChatStore((s) => (leadId ? s.threads[leadId] : undefined));

  const lead = useLeadsStore((s) => (leadId ? s.leads.find((l) => l.id === leadId) : undefined));
  const addInteraction = useLeadsStore((s) => s.addInteraction);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [simulatingReply, setSimulatingReply] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    ensureThread(leadId);
    setActive(leadId);
    return () => {
      setActive(undefined);
    };
  }, [leadId, ensureThread, setActive]);

  useEffect(() => {
    if (!lead) return;
    const messages: Message[] = thread?.messages ?? [];
    setLoadingSuggestions(true);
    aiService
      .suggestReplies(lead, messages)
      .then(setSuggestions)
      .finally(() => setLoadingSuggestions(false));
  }, [lead, thread?.messages.length]);

  const send = (content: string) => {
    if (!leadId || !content.trim()) return;
    sendMessage(leadId, content.trim());
    addInteraction(leadId, {
      type: 'message',
      description: `Enviada mensagem: "${content.trim().slice(0, 60)}${content.length > 60 ? '…' : ''}"`,
    });
    setSimulatingReply(true);
    aiService
      .simulateLeadReply()
      .then((reply) => receiveMessage(leadId, reply))
      .finally(() => setSimulatingReply(false));
  };

  return {
    thread,
    messages: thread?.messages ?? [],
    send,
    suggestions,
    loadingSuggestions,
    simulatingReply,
  };
}
