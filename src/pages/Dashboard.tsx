import { DashboardPanel } from '@/components/panels';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Visão geral do desempenho da Premium Odonto e leads em atendimento.
        </p>
      </header>
      <DashboardPanel />
    </div>
  );
}
