export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  procedure: string;
  professional: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show';
  notes?: string;
}

export interface Patient {
  id: string;
  leadId?: string;
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  appointments: Appointment[];
  totalSpent: number;
  firstVisit?: string;
  lastVisit?: string;
  createdAt: string;
}
