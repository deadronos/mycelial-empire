import { render } from '@testing-library/react';
import { describe, it, beforeEach, expect } from 'vitest';
import { ResourceTray } from './ResourceTray';
import { useGameStore } from '@/state/useGameStore';

describe('ResourceTray', () => {
  beforeEach(() => {
    // Reset the store to default each test
    useGameStore.getState().reset();
  });

  it('renders resource labels and network health', () => {
    const { getByText } = render(<ResourceTray />);
    // labels
    expect(getByText(/sugar/i)).toBeInTheDocument();
    expect(getByText(/water/i)).toBeInTheDocument();
    // network health
    expect(getByText(/Network Health/i)).toBeInTheDocument();
  });

  it('displays updated resource values when state changes', () => {
    // set some specific values
    useGameStore.setState((state) => ({
      resources: { ...state.resources, sugar: 12345 },
      stats: { ...state.stats, netSugar: 10.5, networkHealth: 0.34 },
    }));

    const { getByText } = render(<ResourceTray />);
    expect(getByText(/12345|12.?3?K/)).toBeTruthy();
    expect(getByText(/Network Health/)).toBeInTheDocument();
  });
});
