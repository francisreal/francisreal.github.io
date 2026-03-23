import { useState } from 'react';
import { api } from '../lib/api';

const sampleMeals = ['Greek yogurt + berries', 'Chicken bowl + rice', 'Salmon + potatoes', 'Cottage cheese + fruit'];

export default function Nutrition() {
  const [values, setValues] = useState({ calories: 2050, protein: 115, carbs: 210, fat: 60 });
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-bold">Log nutrition</h2>
        <button className="btn mt-2" onClick={() => api('/api/nutrition/log', { method: 'POST', body: JSON.stringify({ date: new Date().toISOString().slice(0, 10), ...values }) })}>Save daily totals</button>
      </div>
      <div className="card">
        <h3 className="font-semibold">7-day sample meal plan</h3>
        <ul className="list-disc pl-6">{sampleMeals.map((m) => <li key={m}>{m}</li>)}</ul>
        <p className="text-xs">PDF export placeholder for production renderer.</p>
      </div>
    </div>
  );
}
