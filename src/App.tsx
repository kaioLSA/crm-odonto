import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar, TopBar, NewLeadModal } from '@/components/panels';
import { useMetaAdsSimulation } from '@/hooks/useLeads';
import { useLeadsStore } from '@/store/leadsStore';
import { useEffect } from 'react';

import Dashboard from '@/pages/Dashboard';
import Pipeline from '@/pages/Pipeline';
import Leads from '@/pages/Leads';
import Chat from '@/pages/Chat';
import Tasks from '@/pages/Tasks';
import Patients from '@/pages/Patients';

export default function App() {
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const initialize = useLeadsStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useMetaAdsSimulation(true);

  return (
    <div className="h-screen flex" style={{ background: '#050505' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onCreateLead={() => setNewLeadOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ background: '#050505' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<Leads />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <NewLeadModal open={newLeadOpen} onClose={() => setNewLeadOpen(false)} />
    </div>
  );
}
