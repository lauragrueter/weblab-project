import { describe, it, expect } from 'vitest';
import { toDateKey, parseBackendDate } from './date.utils';

describe('toDateKey', () => {
  it('formats a normal date as YYYY-MM-DD', () => {
    const date = new Date(2024, 5, 15); // June 15, 2024
    expect(toDateKey(date)).toBe('2024-06-15');
  });

  it('pads a single-digit month with a leading zero', () => {
    const date = new Date(2024, 0, 15); // January = month index 0
    expect(toDateKey(date)).toBe('2024-01-15');
  });

  it('pads a single-digit day with a leading zero', () => {
    const date = new Date(2024, 5, 5);
    expect(toDateKey(date)).toBe('2024-06-05');
  });

  it('pads month and day at the same time', () => {
    const date = new Date(2024, 0, 1); // January 1st
    expect(toDateKey(date)).toBe('2024-01-01');
  });

  it('handles the year boundary correctly (December 31)', () => {
    const date = new Date(2024, 11, 31);
    expect(toDateKey(date)).toBe('2024-12-31');
  });

  it('handles February 29 in a leap year', () => {
    const date = new Date(2024, 1, 29); // 2024 is a leap year
    expect(toDateKey(date)).toBe('2024-02-29');
  });

  it('uses the local timezone, not UTC', () => {
    // Deliberate guard against a common bug: toISOString() would shift this
    // to the previous day depending on timezone. toDateKey must NOT do that.
    const date = new Date(2024, 5, 15, 0, 30); // shortly after local midnight
    expect(toDateKey(date)).toBe('2024-06-15');
  });
});

describe('parseBackendDate', () => {
  it('parses a valid backend string correctly', () => {
    const result = parseBackendDate('2024-01-15');
    expect(result).toEqual(new Date(2024, 0, 15));
  });

  it('returns null for null', () => {
    expect(parseBackendDate(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseBackendDate(undefined)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseBackendDate('')).toBeNull();
  });

  it('returns null when the year is missing', () => {
    expect(parseBackendDate('-01-15')).toBeNull();
  });

  it('returns null when the month is missing', () => {
    expect(parseBackendDate('2024--15')).toBeNull();
  });

  it('returns null when the day is missing', () => {
    expect(parseBackendDate('2024-01-')).toBeNull();
  });

  it('returns null when only the year is given', () => {
    expect(parseBackendDate('2024')).toBeNull();
  });

  it('returns null when year and month are given but the day is missing', () => {
    expect(parseBackendDate('2024-01')).toBeNull();
  });

  it('returns null for completely non-numeric input', () => {
    expect(parseBackendDate('abc-def-ghi')).toBeNull();
  });

  it('returns null for a random, non-date string', () => {
    expect(parseBackendDate('not-a-date')).toBeNull();
  });

  it('accepts single-digit month/day values without leading zeros', () => {
    // Parsing itself doesn't require padding (only toDateKey enforces it on write)
    const result = parseBackendDate('2024-1-5');
    expect(result).toEqual(new Date(2024, 0, 5));
  });

  it('parses February 29 in a leap year correctly', () => {
    const result = parseBackendDate('2024-02-29');
    expect(result).toEqual(new Date(2024, 1, 29));
  });

  it('is an exact round trip with toDateKey', () => {
    const original = new Date(2024, 8, 3); // September 3, 2024
    const key = toDateKey(original);
    const parsed = parseBackendDate(key);
    expect(parsed).toEqual(original);
  });

  describe('edge case: out-of-range values are rejected, not silently rolled over', () => {
    // These tests confirm the rollover guard (date.getMonth() !== month - 1)
    // rejects values the native Date constructor would otherwise "correct"
    // by overflowing into the next month/year.

    it('rejects month 13 instead of rolling into next year', () => {
      const result = parseBackendDate('2024-13-01');
      expect(result).toBeNull();
    });

    it('rejects month 0', () => {
      const result = parseBackendDate('2024-00-15');
      expect(result).toBeNull();
    });

    it('rejects February 30 in a leap year', () => {
      const result = parseBackendDate('2024-02-30');
      expect(result).toBeNull();
    });

    it('rejects February 30 in a non-leap year', () => {
      const result = parseBackendDate('2023-02-30');
      expect(result).toBeNull();
    });

    it('rejects day 32 (rolls into the next month, caught by the same guard)', () => {
      const result = parseBackendDate('2024-01-32');
      expect(result).toBeNull();
    });

    it('rejects day 0', () => {
      const result = parseBackendDate('2024-01-0');
      expect(result).toBeNull();
    });

    it('ignores extra parts after the third dash-separated segment', () => {
      // Array destructuring [year, month, day] only takes the first three
      // values; the rest is silently discarded rather than causing an error.
      const result = parseBackendDate('2024-01-15-extra-stuff');
      expect(result).toEqual(new Date(2024, 0, 15));
    });
  });
});