import { useState } from 'react';
import {
  Phone, Mail, Calendar, MessageSquare, FileText, X, ChevronRight,
  Stethoscope, Clock, Sparkles,
} from 'lucide-react';
import {
  Avatar, Badge, Button, Modal, Textarea, Select, EmptyState, cn,
} from '@/components/ui';
import { Lead, LEAD_ORIGIN_LABEL, LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from '@/types';
import { useLeadsStore } from '@/store/leadsStore';
import { useTasksStore } from '@/store/tasksStore';
import { usePatientsStore } from '@/store/patientsStore';
import { eClinicaService } from '@/services/integrations/eClinicaService';
import { useNotificationsStore } from '@/store/notificationsStore';

interface LeadDetailsPanelProps {
  lead?: Lead;
  open: boolean;
  onClose: () => void;
  onOpenChat?: (leadId: string) => void;
}

export function LeadDetailsPanel({ lead, open, onClose, onOpenChat }: LeadDetailsPanelProps) {
  const updateLead = useLeadsStore((s) => s.updateLead);
  const addInteraction = useLeadsStore((s) => s.addInteraction);
  const tasks = useTasksStore((s) => (lead ? s.selectByLead(lead.id) : []));
  const addTask = useTasksStore((s) => s.addTask);
  const upsertPatient = usePatientsStore((s) => s.upsert);
  const pushNotif = useNotificationsStore((s) => s.push);

  const [note, setNote] = useState('');
  const [creatingPatient, setCreatingPatient] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  if (!lead) return null;

  const saveNote = () => {
    if (!note.trim()) return;
    addInteraction(lead.id, { type: 'note', description: note.trim() });
    setNote('');
  };

  const sendToEClinica = async () => {
    setCreatingPatient(true);
    try {
      const patient = await eClinicaService.createPatientFromLead({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
      });
      upsertPatient(patient);
      updateLead(lead.id, { isPatient: true, patientId: patient.id });
      addInteraction(lead.id, {
        type: 'system',
        description: 'Paciente criado no e-Clínica (mock)',
      });
      pushNotif({
        type: 'success',
        title: 'Paciente cadastrado',
        description: `${lead.name} agora consta no e-Clínica`,
      });
    } finally {
      setCreatingPatient(false);
    }
  };

  const scheduleAppointment = async () => {
    if (!lead.patientId) return;
    setScheduling(true);
    try {
      const apt = await eClinicaService.scheduleAppointment(lead.patientId, lead.procedure);
      addInteraction(lead.id, {
        type: 'meeting',
        description: `Consulta agendada: ${apt.date} ${apt.time} • ${apt.procedure} (${apt.professional})`,
      });
      updateLead(lead.id, { status: 'agendamento' });
      pushNotif({
        type: 'success',
        title: 'Consulta agendada',
        description: `${lead.name} • ${apt.date} ${apt.time}`,
      });
    } finally {
      setScheduling(false);
    }
  };

  const quickFollowUp = () => {
    addTask({
      title: `Follow-up com ${lead.name}`,
      description: `Retornar contato sobre ${lead.procedure ?? 'avaliação'}`,
      leadId: lead.id,
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      priority: 'medium',
    });
    pushNotif({
      type: 'task',
      title: 'Tarefa criada',
      description: `Follow-up com ${lead.name} agendado para amanhã`,
    });
  };

  return (
    <Modal open={open} onClose={onClose} size="xl" title="Detalhes do Lead">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-start gap-4">
            <Avatar name={lead.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-slate-100">{lead.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge variant="primary" dot>{LEAD_ORIGIN_LABEL[lead.origin]}</Badge>
                <Badge variant="info">{LEAD_STATUS_LABEL[lead.status]}</Badge>
                {lead.isPatient && (
                  <Badge variant="success" dot>
                    <Stethoscope className="h-3 w-3" /> Paciente e-Clínica
                  </Badge>
                )}
                {lead.tags?.map((t) => (
                  <Badge key={t} variant="outline">#{t}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {lead.phone}
                </span>
                {lead.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {lead.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {lead.procedure && (
            <div className="bg-surface-2/50 border border-border/40 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Procedimento de interesse</p>
              <p className="text-sm font-medium text-slate-200">{lead.procedure}</p>
              {lead.estimatedValue && (
                <p className="text-xs text-emerald-400 mt-1">
                  Valor estimado: R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => onOpenChat?.(lead.id)}>
              <MessageSquare className="h-4 w-4" /> Abrir chat
            </Button>
            <Button size="sm" variant="secondary" onClick={quickFollowUp}>
              <Calendar className="h-4 w-4" /> Criar follow-up
            </Button>
            {!lead.isPatient ? (
              <Button size="sm" variant="outline" onClick={sendToEClinica} loading={creatingPatient}>
                <Stethoscope className="h-4 w-4" /> Enviar p/ e-Clínica
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={scheduleAppointment} loading={scheduling}>
                <Calendar className="h-4 w-4" /> Agendar consulta
              </Button>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Histórico de interações
            </h4>
            {lead.interactions.length === 0 ? (
              <EmptyState title="Sem interações ainda" description="Adicione uma nota ou inicie um chat." />
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {[...lead.interactions].reverse().map((int) => (
                  <div key={int.id} className="flex gap-3 text-sm">
                    <div className={cn(
                      'h-8 w-8 rounded-full shrink-0 flex items-center justify-center',
                      int.type === 'system' && 'bg-slate-700/60 text-slate-400',
                      int.type === 'message' && 'bg-primary-500/15 text-primary-300',
                      int.type === 'note' && 'bg-amber-500/15 text-amber-300',
                      int.type === 'meeting' && 'bg-emerald-500/15 text-emerald-300',
                      int.type === 'call' && 'bg-cyan-500/15 text-cyan-300',
                    )}>
                      {int.type === 'message' ? <MessageSquare className="h-3.5 w-3.5" /> :
                       int.type === 'note' ? <FileText className="h-3.5 w-3.5" /> :
                       int.type === 'meeting' ? <Calendar className="h-3.5 w-3.5" /> :
                       int.type === 'call' ? <Phone className="h-3.5 w-3.5" /> :
                       <Sparkles className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300">{int.description}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {new Date(int.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3">
              <Textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Adicionar nota interna..."
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={saveNote} disabled={!note.trim()}>
                  Salvar nota
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-surface-2/40 border border-border/40 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Mover no pipeline</p>
            <Select
              value={lead.status}
              onChange={(e) => updateLead(lead.id, { status: e.target.value as Lead['status'] })}
            >
              {LEAD_STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{LEAD_STATUS_LABEL[s]}</option>
              ))}
            </Select>
          </div>

          <div className="bg-surface-2/40 border border-border/40 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              Tarefas vinculadas
              <span className="bg-surface px-1.5 py-0.5 rounded text-slate-400">{tasks.length}</span>
            </p>
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhuma tarefa vinculada</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((t) => (
                  <li key={t.id} className="text-xs flex items-start gap-2">
                    <Clock className="h-3 w-3 text-slate-500 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-200 truncate">{t.title}</p>
                      <p className="text-slate-500">{new Date(t.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-accent-400" />
              <p className="text-xs font-semibold text-accent-300 uppercase tracking-wider">IA Insights</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lead com perfil <strong className="text-accent-300">{lead.tags?.[0] ?? 'morno'}</strong>.
              Baseado no estágio atual ({LEAD_STATUS_LABEL[lead.status]}), recomendo
              {' '}{lead.status === 'novo_lead' ? 'enviar mensagem inicial nas próximas 2h.' :
                   lead.status === 'contato_iniciado' ? 'oferecer horários disponíveis hoje.' :
                   lead.status === 'agendamento' ? 'enviar lembrete 24h antes.' :
                   lead.status === 'compareceu' ? 'fazer follow-up sobre proposta de tratamento.' :
                   'manter relacionamento com check-ins regulares.'}
            </p>
            <button
              onClick={() => onOpenChat?.(lead.id)}
              className="mt-3 inline-flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 font-medium"
            >
              Ver sugestões no chat <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </aside>
      </div>
    </Modal>
  );
}
