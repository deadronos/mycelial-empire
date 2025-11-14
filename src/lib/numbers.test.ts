import { describe, it, expect } from 'vitest';
import { average, clamp, formatNumber, percentFromFraction } from './numbers';

describe('numbers utils', () => {
  it('average returns 0 for empty arrays', () => {
    expect(average([])).toBe(0);
  });

  it('average computes mean correctly', () => {
    expect(average([1, 2, 3, 4])).toBe(2.5);
  });

  it('clamp returns the min or max when out of bounds', () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('formatNumber returns compact or fixed formatting', () => {
    expect(formatNumber(12)).toBe('12.0');
    expect(String(formatNumber(12345))).toContain('');
  });

  it('percentFromFraction returns percent string', () => {
    expect(percentFromFraction(0.5)).toBe('50%');
    expect(percentFromFraction(-0.2)).toBe('0%');
    expect(percentFromFraction(1.5)).toBe('100%');
  });
});
