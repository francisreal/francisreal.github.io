import { useState } from 'react';
import { api } from '../lib/api';

export default function Onboarding() {
  const [form, setForm] = useState({ dob: '', sex: '', heightCm: 172, startingWeight: 72.18, bodyFatPct: 26, commuteMiles: 0.5, glp1Flag: false });
  return (
    <div className="card space-y-2">
      <h2 className="text-lg font-bold">Onboarding</h2>
      <input placeholder="DOB" className="w-full border" onChange={(e) => setForm({ ...form, dob: e.target.value })} />
      <input placeholder="Sex" className="w-full border" onChange={(e) => setForm({ ...form, sex: e.target.value })} />
      <button className="btn" onClick={() => api('/api/user/profile', { method: 'PUT', body: JSON.stringify(form) })}>Save profile</button>
    </div>
  );
}
