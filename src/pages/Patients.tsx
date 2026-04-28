import { useEffect } from 'react';
import { Stethoscope, Calendar, DollarSign } from 'lucide-react';
import { Avatar, Badge, Card, CardContent, EmptyState } from '@/components/ui';
import { usePatientsStore } from '@/store/patientsStore';

export default function Patients() {
  const initialize = usePatientsStore((s) => s.initialize);
  const patients = usePatientsStore((s) => s.patients);
  const loading = usePatientsStore((s) => s.loading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Pacientes (e-Clínica)</h1>
        <p className="text-sm text-slate-400">
          Pacientes cadastrados e suas consultas — integração simulada com e-Clínica.
        </p>
      </header>

      {loading && <p className="text-sm text-slate-400">Carregando pacientes…</p>}

      {!loading && patients.length === 0 && (
        <Card>
          <CardContent>
            <EmptyState
              icon={<Stethoscope className="h-6 w-6" />}
              title="Nenhum paciente ainda"
              description="Converta um lead na tela de Pipeline para criar pacientes no e-Clínica."
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((p) => {
          const upcoming = p.appointments
            .filter((a) => a.status === 'scheduled')
            .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];
          return (
            <Card key={p.id} interactive>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar name={p.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.phone}</p>
                    {p.email && <p className="text-xs text-slate-500 truncate">{p.email}</p>}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    Tratamento total: <span className="text-emerald-400 font-medium">R$ {p.totalSpent.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Calendar className="h-3.5 w-3.5 text-primary-300" />
                    {p.appointments.length} consulta(s) registrada(s)
                  </div>
                </div>

                {upcoming ? (
                  <div className="mt-3 p-2.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
                    <p className="text-[10px] uppercase tracking-wider text-primary-300 font-semibold">Próxima consulta</p>
                    <p className="text-sm text-slate-100 mt-0.5">{upcoming.procedure}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(upcoming.date).toLocaleDateString('pt-BR')} às {upcoming.time} • {upcoming.professional}
                    </p>
                  </div>
                ) : (
                  <Badge variant="outline" className="mt-3">Sem consultas agendadas</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
