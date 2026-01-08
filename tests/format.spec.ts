import { describe, it, expect } from 'vitest';
import { format } from '../src/store/gameStore';

describe('format()', () => {
  it('returns 0 for negative values', () => {
    expect(format(-5)).toBe('0');
  });

  it('rounds to one decimal place when necessary', () => {
    expect(format(3.456)).toBe('3.5');
  });

  it('shows integer values without decimals when appropriate', () => {
    expect(format(4)).toBe('4');
  });
});
