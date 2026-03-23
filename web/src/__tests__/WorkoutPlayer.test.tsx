import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutPlayer from '../pages/WorkoutPlayer';

const fetchMock = vi.fn()
  .mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 't1', exercises: [{ id: 'e1', name: 'Deadlift', sets: 3, reps: 5, restSec: 90 }] }]) })
  .mockResolvedValue({ ok: true, json: async () => ({}) });

global.fetch = fetchMock as any;

test('allows marking a set complete', async () => {
  render(<WorkoutPlayer />);
  const btn = await screen.findByRole('button', { name: 'Complete set' });
  await userEvent.click(btn);
  expect(await screen.findByRole('button', { name: 'Done' })).toBeInTheDocument();
});
