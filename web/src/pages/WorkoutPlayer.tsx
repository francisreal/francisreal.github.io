import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function WorkoutPlayer() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api('/api/workouts/templates').then(setTemplates).catch(() => null);
  }, []);

  const t = templates[0];
  return (
    <div className="card">
      <h2 className="text-lg font-bold">Workout player</h2>
      <p className="text-sm">Complete set, rest timer, and log RPE/weight.</p>
      {t?.exercises?.map((e: any, i: number) => (
        <div key={e.id} className="mt-2 rounded border p-2">
          <p>{e.name} — {e.sets}x{e.reps}</p>
          <button className="btn mt-1" onClick={() => setDone({ ...done, [e.id]: !done[e.id] })}>{done[e.id] ? 'Done' : 'Complete set'}</button>
          <span className="ml-2 text-xs">Rest {e.restSec}s</span>
        </div>
      ))}
      <button
        className="btn mt-3"
        onClick={() => t && api('/api/workouts/sessions', { method: 'POST', body: JSON.stringify({ templateId: t.id, date: new Date().toISOString(), completed: true, setsData: done, soreness: 3 }) })}
      >
        Save workout
      </button>
    </div>
  );
}
