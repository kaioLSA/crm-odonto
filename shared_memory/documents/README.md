# Pixel Agents — CRM Odontológico

CRM moderno para clínica odontológica, inspirado em Kommo, com Kanban,
integrações simuladas (Meta Ads e e-Clínica) e atendimento via chat com IA.

## Como rodar

```bash
cd pixel-agents
npm install
npm run dev
```

Servidor em http://localhost:5173

## Recursos principais

- **Dashboard** — métricas, funil de conversão e atividades recentes
- **Pipeline** — Kanban com drag & drop (5 colunas: Novo Lead → Fechado)
- **Leads** — tabela com filtros por origem, status e busca livre
- **Chat** — atendimento estilo WhatsApp com sugestões de IA
- **Tarefas** — follow-ups vinculados a leads, com prioridade e vencimento
- **Pacientes** — integração mock com e-Clínica

## Webhook Meta Ads (mock)

A cada 30 segundos um novo lead é gerado automaticamente.
Use o botão `Simular webhook` na TopBar para forçar a entrada de um lead.

## Persistência

Leads, conversas e tarefas são persistidos no localStorage
(`pixel-agents:leads`, `pixel-agents:chat`, `pixel-agents:tasks`).
