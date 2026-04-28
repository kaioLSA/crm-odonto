import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { nowIso, uid } from '@/services/api';

interface TasksState {
  tasks: Task[];
  initialize: () => void;
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'status'> & { status?: TaskStatus }) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleStatus: (id: string) => void;
  removeTask: (id: string) => void;
  selectByLead: (leadId: string) => Task[];
  selectPending: () => Task[];
}

const SEED: Task[] = [
  {
    id: uid('task'),
    title: 'Ligar para a Mariana sobre o orçamento',
    description: 'Reforçar a proposta de implante e oferecer parcelamento',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    priority: 'high',
    status: 'pending',
    createdAt: nowIso(),
  },
  {
    id: uid('task'),
    title: 'Confirmar agendamento do Lucas',
    description: 'Avaliação ortodôntica - confirmar 24h antes',
    dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
    priority: 'medium',
    status: 'in_progress',
    createdAt: nowIso(),
  },
  {
    id: uid('task'),
    title: 'Enviar pesquisa de satisfação',
    description: 'Pacientes que finalizaram tratamento na última semana',
    dueDate: new Date(Date.now() + 432000000).toISOString().slice(0, 10),
    priority: 'low',
    status: 'pending',
    createdAt: nowIso(),
  },
];

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],

      initialize: () => {
        if (get().tasks.length === 0) set({ tasks: SEED });
      },

      addTask: (input) => {
        const task: Task = {
          id: uid('task'),
          createdAt: nowIso(),
          status: input.status ?? 'pending',
          ...input,
          priority: input.priority as TaskPriority,
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
        return task;
      },

      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      toggleStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const next: TaskStatus =
              t.status === 'pending' ? 'in_progress' :
              t.status === 'in_progress' ? 'done' : 'pending';
            return { ...t, status: next };
          }),
        })),

      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      selectByLead: (leadId) => get().tasks.filter((t) => t.leadId === leadId),
      selectPending: () => get().tasks.filter((t) => t.status !== 'done'),
    }),
    { name: 'pixel-agents:tasks' },
  ),
);
