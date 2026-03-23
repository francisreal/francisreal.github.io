import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ averages: { calories: 2050, protein: 115 } }) }) as any;

test('renders dashboard cards', async () => {
  render(<Dashboard />);
  expect(await screen.findByText('Today’s workout')).toBeInTheDocument();
  expect(await screen.findByText(/7-day avg calories/)).toBeInTheDocument();
});
