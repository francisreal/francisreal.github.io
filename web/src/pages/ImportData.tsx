import { useState } from 'react';

export default function ImportData() {
  const [status, setStatus] = useState('No file uploaded');
  return (
    <div className="card">
      <h2 className="text-lg font-bold">CSV import</h2>
      <p className="text-sm">Header: date,steps,exercise_minutes,calories,protein,resting_hr,weight_kg,body_fat_pct</p>
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const body = new FormData();
          body.append('file', file);
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/health/import-csv`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body
          });
          setStatus(res.ok ? 'Imported successfully' : 'Import failed');
        }}
      />
      <p>{status}</p>
    </div>
  );
}
