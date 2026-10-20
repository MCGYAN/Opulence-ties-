'use client';

import { useEffect, useState } from 'react';
import {
  OFFICE_FEATURES,
  ROLE_PRESETS,
  TeamMember,
  featureTitle,
  loadTeam,
  saveTeam,
} from '@/lib/admin-team';

const emptyForm = { name: '', email: '', role: '', access: [] as string[] };

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setMembers(loadTeam());
  }, []);

  const persist = (next: TeamMember[]) => {
    setMembers(next);
    saveTeam(next);
  };

  const toggleAccess = (id: string) => {
    setForm((current) => ({
      ...current,
      access: current.access.includes(id)
        ? current.access.filter((item) => item !== id)
        : [...current.access, id],
    }));
  };

  const applyPreset = (role: string, access: string[]) => {
    setForm((current) => ({
      ...current,
      role,
      name: current.name || role,
      access,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setNotice('');
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const role = form.role.trim();
    if (!name || !email) {
      setNotice('Add a name and an email.');
      return;
    }
    if (!email.includes('@')) {
      setNotice('That email does not look complete.');
      return;
    }
    if (form.access.length === 0) {
      setNotice('Choose at least one part of the office.');
      return;
    }
    const duplicate = members.find((member) => member.email.toLowerCase() === email && member.id !== editingId);
    if (duplicate) {
      setNotice('That email is already on the team.');
      return;
    }

    const nextMember: TeamMember = {
      id: editingId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `team-${Date.now()}`),
      name,
      email,
      role: role || 'Team',
      access: form.access,
    };
    const next = editingId
      ? members.map((member) => (member.id === editingId ? nextMember : member))
      : [nextMember, ...members];
    persist(next);
    resetForm();
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setNotice('');
    setForm({
      name: member.name,
      email: member.email,
      role: member.role,
      access: member.access,
    });
  };

  const removeMember = (id: string) => {
    persist(members.filter((member) => member.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#c4a15a]">Team</p>
      <h1 className="mt-1 text-3xl font-bold text-[#2a241e]">Who can come in</h1>
      <p className="mt-1 max-w-xl text-sm text-[#6b6156]">
        Add a person by name and email, then choose the parts of the office they can open. Sign in with that email to see only those parts.
      </p>

      <form onSubmit={onSubmit} className="admin-panel mt-6 rounded-2xl p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-2 block text-[#6b6156]">Name</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-xl border border-[#e4d8c4] bg-white/80 px-4 py-3 text-[#2a241e] outline-none focus:border-[#c4a15a]"
              placeholder="Sales attendant"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-[#6b6156]">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full rounded-xl border border-[#e4d8c4] bg-white/80 px-4 py-3 text-[#2a241e] outline-none focus:border-[#c4a15a]"
              placeholder="sales@opulenceties.com"
            />
          </label>
        </div>

        <div className="mt-5">
          <p className="text-sm text-[#6b6156]">Start from a role, then adjust</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLE_PRESETS.map((preset) => (
              <button
                key={preset.role}
                type="button"
                onClick={() => applyPreset(preset.role, preset.access)}
                className={`rounded-full border px-3 py-1.5 text-sm ${form.role === preset.role ? 'border-[#c4a15a] bg-[#c4a15a]/15 text-[#2a241e]' : 'border-[#e4d8c4] text-[#6b6156] hover:border-[#c4a15a]'}`}
              >
                {preset.role}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-[#6b6156]">They can open</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICE_FEATURES.map((feature) => {
              const on = form.access.includes(feature.id);
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggleAccess(feature.id)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm ${on ? 'border-[#c4a15a] bg-[#c4a15a]/12 text-[#2a241e]' : 'border-[#e4d8c4] text-[#6b6156]'}`}
                >
                  <i className={`${feature.icon} text-lg ${on ? 'text-[#8d6230]' : ''}`}></i>
                  <span>{feature.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {notice && <p className="mt-4 text-sm text-[#8d6230]">{notice}</p>}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="rounded-xl bg-[#c4a15a] px-5 py-3 text-sm font-semibold text-[#2a241e] hover:bg-[#a8873f]">
            {editingId ? 'Save changes' : 'Add to the team'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-xl border border-[#e4d8c4] px-5 py-3 text-sm text-[#2a241e]">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {members.map((member) => (
          <article key={member.id} className="admin-panel rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#2a241e]">{member.name}</h2>
                <p className="text-sm text-[#6b6156]">{member.email}</p>
                {member.role && <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8d6230]">{member.role}</p>}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(member)} className="rounded-lg border border-[#e4d8c4] px-3 py-2 text-sm text-[#2a241e] hover:border-[#c4a15a]">
                  Edit
                </button>
                <button type="button" onClick={() => removeMember(member.id)} className="rounded-lg border border-[#e4d8c4] px-3 py-2 text-sm text-[#6b6156] hover:border-[#c4a15a]">
                  Remove
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {member.access.map((id) => (
                <span key={id} className="rounded-full bg-[#c4a15a]/15 px-3 py-1 text-xs text-[#2a241e]">
                  {featureTitle(id)}
                </span>
              ))}
            </div>
          </article>
        ))}
        {members.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#e4d8c4] px-4 py-8 text-center text-sm text-[#6b6156]">
            No one else is on the team yet.
          </p>
        )}
      </div>
    </div>
  );
}
