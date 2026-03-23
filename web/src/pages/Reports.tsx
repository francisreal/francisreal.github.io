import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { day: 'Mon', weight: 72.2, waist: 89, steps: 4200 },
  { day: 'Wed', weight: 72.0, waist: 88.7, steps: 5100 },
  { day: 'Fri', weight: 71.9, waist: 88.5, steps: 5600 }
];

export default function Reports() {
  const [week, setWeek] = useState('2026-W12');
  return (
    <div className="card">
      <h2 className="text-lg font-bold">Reports</h2>
      <input className="border" value={week} onChange={(e) => setWeek(e.target.value)} />
      <LineChart width={500} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="weight" stroke="#2563eb" />
      </LineChart>
      <p className="text-xs">Download JSON/PDF summary through backend report endpoint.</p>
    </div>
  );
}
