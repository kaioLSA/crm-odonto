import { useState } from 'react';
import { Modal, Input, Select, Textarea, Button } from '@/components/ui';
import { useLeadsStore } from '@/store/leadsStore';
import { useNotificationsStore } from '@/store/notificationsStore';
import { Lead, LeadOrigin } from '@/types';
import { nowIso, uid } from '@/services/api';

interface NewLeadModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewLeadModal({ open, onClose }: NewLeadModalProps) {
  const addLead = useLeadsStore((s) => s.addLead);
  const pushNotif = useNotificationsStore((s) => s.push);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    origin: 'organico' as LeadOrigin,
    procedure: '',
    estimatedValue: '',
    notes: '',
  });

  const reset = () => setForm({ name: '', phone: '', email: '', origin: 'organico', procedure: '', estimatedValue: '', notes: '' });

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    const lead: Lead = {
      id: uid('lead'),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      origin: form.origin,
      status: 'novo_lead',
      procedure: form.procedure.trim() || undefined,
      estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
      notes: form.notes.trim() || undefined,
      tags: ['novo'],
      createdAt: nowIso(),
      updatedAt: nowIso(),
      interactions: [
        {
          id: uid('int'),
          type: 'system',
          description: 'Lead criado manualmente',
          createdAt: nowIso(),
        },
      ],
    };
    addLead(lead);
    pushNotif({ type: 'success', title: 'Lead criado', description: lead.name });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo Lead"
      description="Cadastre um lead manualmente"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={!form.name.trim() || !form.phone.trim()}>
            Criar Lead
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Input
          label="Nome completo *"
          placeholder="Ex: Maria Silva"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Telefone *"
            placeholder="(11) 9 9999-9999"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="email@exemplo.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Origem"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value as LeadOrigin })}
          >
            <option value="meta_ads">Meta Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="organico">Orgânico</option>
            <option value="indicacao">Indicação</option>
            <option value="whatsapp">WhatsApp</option>
          </Select>
          <Input
            label="Valor estimado (R$)"
            type="number"
            placeholder="0"
            value={form.estimatedValue}
            onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })}
          />
        </div>
        <Input
          label="Procedimento de interesse"
          placeholder="Ex: Implante, Clareamento..."
          value={form.procedure}
          onChange={(e) => setForm({ ...form, procedure: e.target.value })}
        />
        <Textarea
          label="Observações"
          rows={3}
          placeholder="Notas internas sobre o lead..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
    </Modal>
  );
}
