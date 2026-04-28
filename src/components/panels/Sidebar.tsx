import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  MessageSquare,
  CheckSquare,
  Stethoscope,
  Settings,
} from 'lucide-react';
import { cn } from '@/components/ui';
import { useChatStore } from '@/store/chatStore';
import { useTasksStore } from '@/store/tasksStore';
import { useLeadsStore } from '@/store/leadsStore';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/leads', label: 'Leads', icon: Users, badgeKey: 'leads' as const },
  { to: '/chat', label: 'Atendimento', icon: MessageSquare, badgeKey: 'chat' as const },
  { to: '/tasks', label: 'Tarefas', icon: CheckSquare, badgeKey: 'tasks' as const },
  { to: '/patients', label: 'Pacientes', icon: Stethoscope },
];

export function Sidebar() {
  const unreadChat = useChatStore((s) => s.totalUnread());
  const pendingTasks = useTasksStore((s) => s.tasks.filter((t) => t.status !== 'done').length);
  const newLeads = useLeadsStore((s) => s.leads.filter((l) => l.status === 'novo_lead').length);

  const badge = (key?: 'leads' | 'chat' | 'tasks') => {
    if (key === 'leads') return newLeads || undefined;
    if (key === 'chat') return unreadChat || undefined;
    if (key === 'tasks') return pendingTasks || undefined;
    return undefined;
  };

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#222] bg-[#080808]">
      {/* Logo */}
      <div className="px-4 h-[72px] flex items-center gap-3 border-b border-[#222]">
        <img
          src={`${import.meta.env.BASE_URL}logo.svg`}
          alt="Premium Odonto"
          className="h-10 w-10 object-contain"
        />
        <div>
          <p
            className="text-sm font-bold leading-tight tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #f3e4b3, #D4AF37, #9a7c0a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Premium Odonto
          </p>
          <p className="text-[10px] text-[#555] uppercase tracking-widest">CRM</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest px-3 mb-2 mt-1">
          Principal
        </p>
        {NAV_ITEMS.map((item) => {
          const count = badge(item.badgeKey);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#1a1500] text-[#D4AF37] border border-[#D4AF37]/30 shadow-glow-sm'
                    : 'text-[#888] hover:text-[#D4AF37] hover:bg-[#141000]',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {count != null && (
                <span className="text-[10px] font-bold bg-[#D4AF37] text-black px-1.5 py-0.5 rounded">
                  {count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#222]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#555] hover:text-[#D4AF37] hover:bg-[#141000] transition">
          <Settings className="h-4 w-4" />
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  );
}
