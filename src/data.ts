export type Mode = 'w2' | '1099';
export type Role = 'CNA' | 'LPN' | 'RN';
export type Slot = 'day' | 'evening' | 'night';

export interface Shift {
  id: string;
  date: string;
  role: Role;
  facility: string;
  town: string;
  miles: number;
  slot: Slot;
  hours: number;
  /** Hourly rate shown to a 1099 contractor. */
  rate: number;
  /** Hourly rate the same shift showed under W-2, after payroll costs came out of the facility's budget. */
  w2Rate: number;
  favorite?: boolean;
  urgent?: boolean;
  status: 'open' | 'applied';
}

export interface Timecard {
  id: string;
  date: string;
  facility: string;
  role: Role;
  hours: number;
  rate: number;
  w2Rate: number;
  status: 'pending' | 'approved';
}

export const SLOT_TIME: Record<Slot, string> = {
  day: '7:00 AM - 3:00 PM',
  evening: '3:00 PM - 11:00 PM',
  night: '11:00 PM - 7:00 AM',
};

/** Illustrative W-2 withholding for a per diem nurse; real rates depend on income, state and filing status. */
export const W2_WITHHOLDING = [
  { label: 'Federal income tax', rate: 0.1 },
  { label: 'Social Security', rate: 0.062 },
  { label: 'Medicare', rate: 0.0145 },
  { label: 'State income tax', rate: 0.03 },
] as const;

/** Flat per-timecard coverage fees for contractors: occupational accident and medical malpractice insurance. Amounts are illustrative. */
export const CONTRACTOR_FEES = [
  { label: 'Occupational accident insurance', amount: 2.5 },
  { label: 'Medical malpractice insurance', amount: 1.5 },
] as const;

/** W-2 nurses could cash out part of their approved pay early (share is illustrative); contractors can cash out all of it. */
export const W2_CASHOUT_SHARE = 0.6;

export const rateFor = (s: { rate: number; w2Rate: number }, mode: Mode) => (mode === '1099' ? s.rate : s.w2Rate);
export const round2 = (n: number) => Math.round(n * 100) / 100;
export const money = (n: number) => `${n < 0 ? '-' : ''}$${Math.abs(n).toFixed(2)}`;

export interface PayLine {
  label: string;
  amount: number;
}

/** What one timecard pays out: gross, the lines taken out of it, and what reaches the nurse's bank. */
export function payBreakdown(tc: Timecard, mode: Mode): { gross: number; lines: PayLine[]; net: number } {
  const gross = round2(tc.hours * rateFor(tc, mode));
  const lines: PayLine[] =
    mode === 'w2'
      ? W2_WITHHOLDING.map((w) => ({ label: w.label, amount: round2(gross * w.rate) }))
      : CONTRACTOR_FEES.map((f) => ({ label: f.label, amount: f.amount }));
  const net = round2(gross - lines.reduce((sum, l) => sum + l.amount, 0));
  return { gross, lines, net };
}

/** Approved pay the nurse can cash out before payday. */
export function cashOutAvailable(timecards: Timecard[], mode: Mode) {
  const approved = timecards.filter((t) => t.status === 'approved');
  if (mode === '1099') return round2(approved.reduce((sum, t) => sum + payBreakdown(t, mode).net, 0));
  return round2(approved.reduce((sum, t) => sum + payBreakdown(t, mode).gross, 0) * W2_CASHOUT_SHARE);
}

// Illustrative rates for the facility calculator; real fees and payroll loads aren't published here.
/** Employer payroll load under W-2: FICA match, unemployment, workers' comp. Varies by state. */
export const W2_PAYROLL_LOAD = 0.16;
export const PLATFORM_FEE = 0.2;
export const W2_PROCESSING = 0.03;

/** The facility's hourly bill rate for a given nurse rate, itemized the way the facility calculator shows it. */
export function billBreakdown(nurseRate: number, mode: Mode): { lines: PayLine[]; total: number } {
  if (mode === '1099') {
    const fee = round2(nurseRate * PLATFORM_FEE);
    return {
      lines: [
        { label: 'Nurse hourly rate', amount: nurseRate },
        { label: `Platform fee (${PLATFORM_FEE * 100}%)`, amount: fee },
      ],
      total: round2(nurseRate + fee),
    };
  }
  const payroll = round2(nurseRate * W2_PAYROLL_LOAD);
  const subtotal = round2(nurseRate + payroll);
  const fee = round2(subtotal * PLATFORM_FEE);
  const processing = round2((subtotal + fee) * W2_PROCESSING);
  return {
    lines: [
      { label: 'Nurse hourly rate', amount: nurseRate },
      { label: 'Payroll taxes and insurance', amount: payroll },
      { label: `Platform fee (${PLATFORM_FEE * 100}%)`, amount: fee },
      { label: 'Processing fee', amount: processing },
    ],
    total: round2(subtotal + fee + processing),
  };
}

// --- Demo data -------------------------------------------------------------------------

export const toKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Open shifts over the next two weeks. Facilities, towns and rates are invented and checked against real facility names. */
export function generateShifts(today: Date): Shift[] {
  const rows: Array<[number, Role, string, string, number, Slot, number, number, Partial<Shift>?]> = [
    [1, 'CNA', 'Halverbrook Care Center', 'Halverton, OH', 3.2, 'day', 32, 26.5, { favorite: true }],
    [1, 'LPN', 'Quinnmoor Rehabilitation', 'Orrin Falls, OH', 8.4, 'evening', 46, 38, { urgent: true }],
    [2, 'RN', 'Tessaly Pines Senior Living', 'Halverton, OH', 4.1, 'night', 62, 51],
    [2, 'CNA', 'Orrinvale Health & Rehab', 'Brackenlow, OH', 11.7, 'night', 34, 28],
    [3, 'CNA', 'Wrenmarsh Nursing Home', 'Orrin Falls, OH', 6.0, 'day', 31, 25.5],
    [4, 'LPN', 'Halverbrook Care Center', 'Halverton, OH', 3.2, 'day', 45, 37, { favorite: true }],
    [5, 'CNA', 'Brackenlow Manor', 'Westholm, OH', 14.2, 'evening', 33, 27],
    [6, 'RN', 'Quinnmoor Rehabilitation', 'Orrin Falls, OH', 8.4, 'day', 60, 49.5],
    [7, 'CNA', 'Tessaly Pines Senior Living', 'Halverton, OH', 4.1, 'evening', 32, 26.5],
    [8, 'LPN', 'Orrinvale Health & Rehab', 'Brackenlow, OH', 11.7, 'night', 48, 39.5],
  ];
  return rows.map(([offset, role, facility, town, miles, slot, rate, w2Rate, extra], i) => ({
    id: `s${i + 1}`,
    date: toKey(addDays(today, offset)),
    role,
    facility,
    town,
    miles,
    slot,
    hours: 7.5,
    rate,
    w2Rate,
    status: 'open',
    ...extra,
  }));
}

/** Shifts the demo nurse already worked this week. */
export function generateTimecards(today: Date): Timecard[] {
  return [
    { id: 't1', date: toKey(addDays(today, -1)), facility: 'Halverbrook Care Center', role: 'CNA', hours: 7.5, rate: 32, w2Rate: 26.5, status: 'pending' },
    { id: 't2', date: toKey(addDays(today, -3)), facility: 'Wrenmarsh Nursing Home', role: 'CNA', hours: 7.5, rate: 31, w2Rate: 25.5, status: 'approved' },
    { id: 't3', date: toKey(addDays(today, -5)), facility: 'Tessaly Pines Senior Living', role: 'CNA', hours: 7.5, rate: 32, w2Rate: 26.5, status: 'approved' },
  ];
}
