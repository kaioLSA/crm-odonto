import { useEffect, useState } from 'react';
import { Plus, Check, Trash2, AlertCircle, Clock } from 'lucide-react';
import {
  Badge, Button, Card, CardContent, EmptyState, Input, Modal, Select, Textarea, cn,
} from '@/components/ui';
import { useTasksStore } from '@/store/tasksStore';
import { useLeadsStore } from '@/store/leadsStore';
import { Task, TaskPriority, TASK_PRIORITY_LABEL } from '@/types';

const priorityVariant: Record<TaskPriority, 'danger' | 'warning' | 'info'> = {
  high: 'danger',
  medium: 'warning',
  low: 'info',
};

export default function Tasks() {
  const initialize = useTasksStore((s) => s.initialize);
  const tasks = useTasksStore((s) => s.tasks);
  const addTask = useTasksStore((s) => s.addTask);
  const toggleStatus = useTasksStore((s) => s.toggleStatus);
  const removeTask = useTasksStore((s) => s.removeTask);
  const leads = useLeadsStore((s) => s.leads);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    leadId: '',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    priority: 'medium' as TaskPriority,
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const submit = () => {
    if (!form.title.trim()) return;
    addTask({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      leadId: form.leadId || undefined,
      dueDate: form.dueDate,
      priority: form.priority,
    });
    setOpen(false);
    setForm({
      title: '', description: '', leadId: '',
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      priority: 'medium',
    });
  };

  const grouped = {
    pending: tasks.filter((t) => t.status === 'pending'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const isOverdue = (t: Task) => t.status !== 'done' && t.dueDate < new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Tarefas & Follow-ups</h1>
          <p className="text-sm text-slate-400">
            Organize seus lembretes e mantenha o relacionamento com leads em dia.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Nova tarefa
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['pending', 'in_progress', 'done'] as const).map((bucket) => (
          <Card key={bucket}>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-200">
                  {bucket === 'pending' ? 'Pendentes' :
                   bucket === 'in_progress' ? 'Em andamento' : 'Concluídas'}
                </h3>
                <Badge variant="outline">{grouped[bucket].length}</Badge>
              </div>
              {grouped[bucket].length === 0 ? (
                <EmptyState title="Sem tarefas" description="Tudo em dia por aqui!" />
              ) : (
                <div className="space-y-2">
                  {grouped[bucket].map((t) => {
                    const lead = leads.find((l) => l.id === t.leadId);
                    return (
                      <div
                        key={t.id}
                        className={cn(
                          'p-3 rounded-lg border transition',
                          t.status === 'done'
                            ? 'border-border/40 bg-surface-2/30 opacity-70'
                            : 'border-border/60 bg-surface-2/50 hover:border-primary-500/40',
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => toggleStatus(t.id)}
                            className={cn(
                              'h-5 w-5 rounded-full border-2 shrink-0 mt-0.5 transition flex items-center justify-center',
                              t.status === 'done'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : t.status === 'in_progress'
                                  ? 'border-amber-500 bg-amber-500/30'
                                  : 'border-border hover:border-primary-500',
                            )}
                          >
                            {t.status === 'done' && <Check className="h-3 w-3" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm text-slate-100',
                              t.status === 'done' && 'line-through text-slate-500',
                            )}>
                              {t.title}
                            </p>
                            {t.description && (
                              <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant={priorityVariant[t.priority]}>
                                {TASK_PRIORITY_LABEL[t.priority]}
                              </Badge>
                              <span className={cn(
                                'text-[11px] flex items-center gap-1',
                                isOverdue(t) ? 'text-rose-400' : 'text-slate-500',
                              )}>
                                {isOverdue(t) ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                {new Date(t.dueDate).toLocaleDateString('pt-BR')}
                              </span>
                              {lead && (
                                <Badge variant="outline">{lead.name}</Badge>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeTask(t.id)}
                            className="text-slate-500 hover:text-danger transition shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova tarefa"
        description="Crie um lembrete ou follow-up"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={submit} disabled={!form.title.trim()}>Criar tarefa</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Título *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Ligar para Maria sobre orçamento"
          />
          <Textarea
            label="Descrição"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Vencimento"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <Select
              label="Prioridade"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </Select>
          </div>
          <Select
            label="Vincular a um lead"
            value={form.leadId}
            onChange={(e) => setForm({ ...form, leadId: e.target.value })}
          >
            <option value="">Nenhum</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}
