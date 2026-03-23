import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  useEffect(() => {
    api('/api/health/summary').then(setSummary).catch(() => null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold">Today’s workout</h2>
        <p>Session based on Mon / Wed / Sat cadence.</p>
      </div>
      <div className="card">
        <h3 className="font-semibold">Weekly calendar</h3>
        <p>Mon: Session A • Wed: Session B • Sat: Session C</p>
      </div>
      <div className="card">
        <h3 className="font-semibold">Weekly summary</h3>
        <p>7-day avg calories: {summary?.averages?.calories ?? '-'} </p>
        <p>7-day avg protein: {summary?.averages?.protein ?? '-'} g</p>
      </div>
    </div>
  );
}
