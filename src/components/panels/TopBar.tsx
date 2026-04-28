import { useState } from 'react';
import { Bell, Search, Plus, Zap, Check, Trash2 } from 'lucide-react';
import { Button, Input, Avatar, Badge, cn } from '@/components/ui';
import { useNotificationsStore } from '@/store/notificationsStore';
import { useLeadsStore } from '@/store/leadsStore';

interface TopBarProps {
  onCreateLead?: () => void;
}

export function TopBar({ onCreateLead }: TopBarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const notifications = useNotificationsStore((s) => s.notifications);
  const unread = useNotificationsStore((s) => s.unreadCount());
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const removeNotif = useNotificationsStore((s) => s.remove);
  const pushNotif = useNotificationsStore((s) => s.push);

  const setSearch = useLeadsStore((s) => s.setFilters);
  const search = useLeadsStore((s) => s.filters.search);
  const receiveSimulatedLead = useLeadsStore((s) => s.receiveSimulatedLead);

  const triggerWebhook = async () => {
    const lead = await receiveSimulatedLead();
    pushNotif({
      type: 'lead',
      title: 'Webhook Meta Ads disparado',
      description: `${lead.name} acabou de chegar — ${lead.procedure ?? 'avaliação'}`,
    });
  };

  return (
    <header className="h-16 shrink-0 border-b border-[#222] bg-[#080808] sticky top-0 z-30">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <div className="flex-1 max-w-md">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Buscar leads, pacientes ou telefone..."
            value={search ?? ''}
            onChange={(e) => setSearch({ search: e.target.value })}
          />
        </div>

        <div className="flex-1" />

        <Button variant="outline" size="sm" onClick={triggerWebhook}>
          <Zap className="h-4 w-4" /> Simular webhook
        </Button>

        <Button size="sm" onClick={onCreateLead}>
          <Plus className="h-4 w-4" /> Novo Lead
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotif((v) => !v)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </Button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl shadow-2xl z-40 animate-slide-up">
              <div className="px-4 py-3 border-b border-[#222]/60 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Notificações</h4>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    Marcar todas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 px-4 py-8 text-center">
                    Sem notificações por aqui.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 border-b border-[#222]/40 last:border-0 flex gap-3',
                        !n.read && 'bg-primary-500/5',
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 truncate">{n.title}</p>
                        {n.description && (
                          <p className="text-xs text-slate-500 truncate">{n.description}</p>
                        )}
                        <span className="text-[10px] text-slate-600">
                          {new Date(n.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <button
                        onClick={() => removeNotif(n.id)}
                        className="text-slate-500 hover:text-danger transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="px-4 py-2 text-center border-t border-[#222]/60">
                  <Badge variant="outline">
                    <Check className="h-3 w-3" /> {notifications.length} totais
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-[#222]/60">
          <Avatar name="Você Operador" size="sm" />
          <div className="hidden md:block">
            <p className="text-sm text-slate-200 leading-tight">Operador</p>
            <p className="text-[11px] text-slate-500">Online agora</p>
          </div>
        </div>
      </div>
    </header>
  );
}
