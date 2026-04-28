# Pixel Agents — CRM Odontológico

CRM simples para clínica odontológica, inspirado em Kommo, com foco em gestão
de leads, pacientes e atendimento.

## Stack

- React 18 + TypeScript (TSX)
- Vite 5
- TailwindCSS 3 (dark-first)
- Zustand (estado + persistência)
- React Router 6
- @hello-pangea/dnd (drag-and-drop)
- lucide-react (ícones)

## Instalação

```bash
cd pixel-agents
npm install
npm run dev
```

Acesse http://localhost:5173

## Estrutura

```
pixel-agents/
├── src/
│   ├── components/
│   │   ├── office/        # PipelineBoard, Column, LeadCard
│   │   ├── ui/            # Button, Card, Modal, Input, Badge, Avatar, EmptyState
│   │   └── panels/        # TopBar, Sidebar, DashboardPanel, ChatPanel, LeadDetailsPanel
│   ├── hooks/             # useLeads, usePipeline, useChat
│   ├── services/
│   │   ├── integrations/  # metaAdsService, eClinicaService, aiService (mocks)
│   │   └── api.ts
│   ├── store/             # leadsStore, chatStore, tasksStore, notificationsStore
│   ├── types/             # Lead, Patient, Message, Task, Notification
│   ├── pages/             # Dashboard, Pipeline, Leads, Chat, Tasks, Patients
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── shared_memory/
│   ├── context.json
│   └── documents/
├── tailwind.config.js
└── vite.config.ts
```

## Funcionalidades

- **Dashboard** com cards, funil de conversão e atividade recente
- **Pipeline Kanban** com drag-and-drop (5 estágios)
- **Leads** com tabela, filtros (origem, status, busca) e modal de detalhes
- **Chat** estilo WhatsApp com sugestões de IA contextuais
- **Tarefas/Follow-ups** vinculados a leads
- **Integração Meta Ads** (mock) — webhook automático a cada 30s + botão manual
- **Integração e-Clínica** (mock) — converte lead em paciente e agenda consulta
- **Notificações** com badge na TopBar
- **Persistência local** via localStorage

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — preview do build
