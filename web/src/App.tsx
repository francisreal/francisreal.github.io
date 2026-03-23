import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import WorkoutPlayer from './pages/WorkoutPlayer';
import Nutrition from './pages/Nutrition';
import ImportData from './pages/ImportData';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import { Nav } from './components/Nav';
import { QuickLogButton } from './components/QuickLogButton';

async function login(email: string, password: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json();
  if (json.token) localStorage.setItem('token', json.token);
  return json.token;
}

export default function App() {
  const [authed, setAuthed] = useState(Boolean(localStorage.getItem('token')));

  if (!authed) {
    return (
      <main className="mx-auto mt-16 max-w-md card">
        <h1 className="text-2xl font-bold">TempoCoach</h1>
        <p className="mb-2 text-sm">Single-user local login</p>
        <button className="btn" onClick={async () => setAuthed(Boolean(await login('owner@tempocoach.local', 'password123')))}>
          Login as owner
        </button>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <main className="mx-auto max-w-5xl p-4">
        <h1 className="mb-2 text-3xl font-bold">TempoCoach</h1>
        <Nav />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/workout" element={<WorkoutPlayer />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/import" element={<ImportData />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
        <QuickLogButton />
      </main>
    </BrowserRouter>
  );
}
