import { useState } from 'react';
import { api } from '../lib/api';

export function QuickLogButton() {
  const [open, setOpen] = useState(false);
  const [calories, setCalories] = useState('2050');
  const [protein, setProtein] = useState('115');

  return (
    <div className="fixed bottom-6 right-6">
      <button className="btn rounded-full" onClick={() => setOpen((v) => !v)}>Quick log</button>
      {open && (
        <div className="card mt-2 w-64">
          <p className="font-semibold">Log nutrition</p>
          <input className="w-full border" value={calories} onChange={(e) => setCalories(e.target.value)} />
          <input className="mt-2 w-full border" value={protein} onChange={(e) => setProtein(e.target.value)} />
          <button
            className="btn mt-2"
            onClick={async () => {
              await api('/api/nutrition/log', {
                method: 'POST',
                body: JSON.stringify({ date: new Date().toISOString().slice(0, 10), calories: Number(calories), protein: Number(protein), carbs: 200, fat: 60 })
              });
              setOpen(false);
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
