import { create } from 'zustand';
import { Patient } from '@/types';
import { eClinicaService } from '@/services/integrations/eClinicaService';

interface PatientsState {
  patients: Patient[];
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  upsert: (patient: Patient) => void;
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  loading: false,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    set({ loading: true });
    const patients = await eClinicaService.listPatients();
    set({ patients, loading: false, initialized: true });
  },

  refresh: async () => {
    set({ loading: true });
    const patients = await eClinicaService.listPatients();
    set({ patients, loading: false });
  },

  upsert: (patient) =>
    set((state) => {
      const idx = state.patients.findIndex((p) => p.id === patient.id);
      const next = [...state.patients];
      if (idx >= 0) next[idx] = patient;
      else next.push(patient);
      return { patients: next };
    }),
}));
