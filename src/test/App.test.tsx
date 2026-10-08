import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from '@/App';

describe('MoonPaw App Shell & Layout', () => {
  it('renders all 5 main navigation sections and layout headers', async () => {
    render(<App />);

    // Wait for database initialization to finish and Home screen to appear
    await waitFor(() => {
      expect(screen.getByText(/Good Evening, Starlight Traveler/i)).toBeInTheDocument();
    });

    // Check brand headers
    expect(screen.getAllByText('MoonPaw').length).toBeGreaterThanOrEqual(1);

    // Check all 5 navigation labels (present in desktop sidebar or mobile bottom nav)
    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tasks').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Calendar').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mystic').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Cat & Settings').length).toBeGreaterThanOrEqual(1);
  });
});
