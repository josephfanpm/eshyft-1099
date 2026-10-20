import { describe, expect, it } from 'vitest';
import { billBreakdown, cashOutAvailable, generateShifts, generateTimecards, payBreakdown, type Timecard } from './data';

const today = new Date(2026, 0, 14);
const timecard: Timecard = { id: 't', date: '2026-01-13', facility: 'Test', role: 'CNA', hours: 7.5, rate: 32, w2Rate: 26.5, status: 'approved' };

describe('rates', () => {
  it('shows every W-2 rate 15-20% below the 1099 rate for the same shift', () => {
    for (const s of [...generateShifts(today), ...generateTimecards(today)]) {
      const gap = 1 - s.w2Rate / s.rate;
      expect(gap).toBeGreaterThanOrEqual(0.15);
      expect(gap).toBeLessThanOrEqual(0.2);
    }
  });
});

describe('payBreakdown', () => {
  it('withholds taxes from a W-2 paycheck', () => {
    const { gross, lines, net } = payBreakdown(timecard, 'w2');
    expect(gross).toBe(198.75);
    expect(lines).toHaveLength(4);
    expect(net).toBeCloseTo(198.75 * (1 - 0.1 - 0.062 - 0.0145 - 0.03), 1);
  });

  it('takes only the two flat insurance fees from a contractor payout', () => {
    const { gross, net } = payBreakdown(timecard, '1099');
    expect(gross).toBe(240);
    expect(net).toBe(236);
  });
});

describe('cashOutAvailable', () => {
  it('caps W-2 cash-out at part of approved gross and gives contractors all of their net', () => {
    const cards = generateTimecards(today);
    expect(cashOutAvailable(cards, 'w2')).toBe(Math.round((7.5 * 25.5 + 7.5 * 26.5) * 0.6 * 100) / 100);
    expect(cashOutAvailable(cards, '1099')).toBe(7.5 * 31 - 4 + (7.5 * 32 - 4));
  });
});

describe('billBreakdown', () => {
  it('bills a contractor shift at the nurse rate plus the platform fee only', () => {
    const { lines, total } = billBreakdown(32, '1099');
    expect(lines.map((l) => l.label)).toEqual(['Nurse hourly rate', 'Platform fee (20%)']);
    expect(total).toBe(38.4);
  });

  it('costs the facility more under W-2 at the same nurse rate', () => {
    expect(billBreakdown(32, 'w2').total).toBeGreaterThan(billBreakdown(32, '1099').total);
  });
});
