import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect,it } from 'vitest';

import { useGameStore } from '@/state/useGameStore';

import { ResourceTray } from './ResourceTray';

describe('ResourceTray', () => {
  beforeEach(() => {
    // Reset the store to default each test
    useGameStore.getState().reset();
  });

  it('renders resource labels and network health', () => {
    render(<ResourceTray />);
    // labels
    expect(screen.getByText(/sugar/i)).toBeInTheDocument();
    expect(screen.getByText(/water/i)).toBeInTheDocument();
    // network health
    expect(screen.getByText(/Network Health/i)).toBeInTheDocument();
  });

  it('displays updated resource values when state changes', () => {
    // set some specific values
    useGameStore.setState((state) => ({
      resources: { ...state.resources, sugar: 12345 },
      stats: { ...state.stats, netSugar: 10.5, networkHealth: 0.34 },
    }));

    render(<ResourceTray />);
    expect(screen.getByText(/12345|12.?3?K/)).toBeInTheDocument();
    expect(screen.getByText(/Network Health/)).toBeInTheDocument();
  });
});
