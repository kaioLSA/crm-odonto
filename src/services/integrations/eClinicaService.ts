import { Appointment, Patient } from '@/types';
import { delay, nowIso, uid } from '../api';

const PROFESSIONALS = [
  'Dra. Helena Martins',
  'Dr. Roberto Salles',
  'Dra. Camila Duarte',
  'Dr. Tiago Andrade',
];

const PROCEDURES = [
  'Avaliação inicial',
  'Limpeza',
  'Clareamento',
  'Implante',
  'Restauração',
  'Ortodontia',
  'Endodontia',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFutureDate(daysAhead = 14): { date: string; time: string } {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  const hour = 8 + Math.floor(Math.random() * 10);
  const minute = Math.random() > 0.5 ? '00' : '30';
  return {
    date: d.toISOString().slice(0, 10),
    time: `${hour.toString().padStart(2, '0')}:${minute}`,
  };
}

function randomPastDate(daysBack = 60): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().slice(0, 10);
}

const SEED_PATIENTS: Patient[] = [
  {
    id: 'pat_001',
    name: 'Carolina Mendes',
    phone: '(11) 98877-1234',
    email: 'carolina.mendes@email.com',
    cpf: '321.654.987-00',
    birthDate: '1989-04-12',
    address: 'Rua das Flores, 145 - São Paulo/SP',
    appointments: [
      {
        id: uid('apt'),
        patientId: 'pat_001',
        date: randomPastDate(30),
        time: '14:00',
        procedure: 'Limpeza',
        professional: 'Dra. Helena Martins',
        status: 'completed',
        notes: 'Paciente regular, retorno em 6 meses',
      },
      {
        id: uid('apt'),
        patientId: 'pat_001',
        date: randomFutureDate(7).date,
        time: '10:30',
        procedure: 'Clareamento',
        professional: 'Dra. Helena Martins',
        status: 'scheduled',
      },
    ],
    totalSpent: 2400,
    firstVisit: '2022-03-10',
    lastVisit: randomPastDate(30),
    createdAt: '2022-03-10T10:00:00Z',
  },
  {
    id: 'pat_002',
    name: 'Gustavo Ferreira',
    phone: '(11) 99662-5544',
    email: 'gustavo.ferreira@email.com',
    cpf: '987.123.456-11',
    birthDate: '1984-09-22',
    address: 'Av. Brasil, 2200 - São Paulo/SP',
    appointments: [
      {
        id: uid('apt'),
        patientId: 'pat_002',
        date: randomPastDate(90),
        time: '09:00',
        procedure: 'Implante',
        professional: 'Dr. Roberto Salles',
        status: 'completed',
        notes: 'Implante superior, cicatrização ok',
      },
    ],
    totalSpent: 7800,
    firstVisit: '2021-08-05',
    lastVisit: randomPastDate(90),
    createdAt: '2021-08-05T11:00:00Z',
  },
];

const patientsRegistry = new Map<string, Patient>(
  SEED_PATIENTS.map((p) => [p.id, p]),
);

export const eClinicaService = {
  async listPatients(): Promise<Patient[]> {
    await delay(160);
    return Array.from(patientsRegistry.values());
  },

  async getPatient(id: string): Promise<Patient | null> {
    await delay(120);
    return patientsRegistry.get(id) ?? null;
  },

  async findPatientByPhone(phone: string): Promise<Patient | null> {
    await delay(100);
    const cleaned = phone.replace(/\D/g, '');
    return (
      Array.from(patientsRegistry.values()).find(
        (p) => p.phone.replace(/\D/g, '') === cleaned,
      ) ?? null
    );
  },

  async createPatientFromLead(lead: { id: string; name: string; phone: string; email?: string }): Promise<Patient> {
    await delay(220);
    const patient: Patient = {
      id: uid('pat'),
      leadId: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      appointments: [],
      totalSpent: 0,
      firstVisit: nowIso().slice(0, 10),
      createdAt: nowIso(),
    };
    patientsRegistry.set(patient.id, patient);
    return patient;
  },

  async scheduleAppointment(
    patientId: string,
    procedure?: string,
  ): Promise<Appointment> {
    await delay(200);
    const patient = patientsRegistry.get(patientId);
    if (!patient) throw new Error('Paciente não encontrado');
    const slot = randomFutureDate();
    const appointment: Appointment = {
      id: uid('apt'),
      patientId,
      date: slot.date,
      time: slot.time,
      procedure: procedure ?? pick(PROCEDURES),
      professional: pick(PROFESSIONALS),
      status: 'scheduled',
    };
    patient.appointments.push(appointment);
    return appointment;
  },

  async listUpcomingAppointments(): Promise<Appointment[]> {
    await delay(150);
    const all: Appointment[] = [];
    patientsRegistry.forEach((p) => all.push(...p.appointments));
    return all
      .filter((a) => a.status === 'scheduled')
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  },
};
