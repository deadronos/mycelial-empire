import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect,it } from 'vitest';

import { useGameStore } from '@/state/useGameStore';

import { ResourceTray } from './ResourceTray';

describe('ResourceTray', () => {
  beforeEach(() => {
    // Reset the store to default each test
    useGameStore.getState().reset();
  });

  it('renders resource labels', () => {
    render(<ResourceTray />);
    // labels
    expect(screen.getByText(/sugar/i)).toBeInTheDocument();
    expect(screen.getByText(/water/i)).toBeInTheDocument();
    // network health is in the app header, not ResourceTray; ResourceTray only shows resources
  });

  it('displays updated resource values when state changes', () => {
    // set some specific values
    useGameStore.setState((state) => ({
      resources: { ...state.resources, sugar: 12345 },
      stats: { ...state.stats, netSugar: 10.5, networkHealth: 0.34 },
    }));

    render(<ResourceTray />);
    expect(screen.getByText(/12345|12.?3?K/)).toBeInTheDocument();
    // network health is tested elsewhere; ResourceTray shows updated resources only
  });
});
