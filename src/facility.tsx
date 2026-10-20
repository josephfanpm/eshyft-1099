import { ChevronDown, Info, Minus, Plus, TriangleAlert } from 'lucide-react';
import { AmountRow } from './chrome';
import { billBreakdown, money, type Mode } from './data';

/** The facility manager's rate step when posting a shift, with the cost calculator beneath it. */
export function FacilityRates({ mode, nurseRate, onRate, onField }: { mode: Mode; nurseRate: number; onRate: (r: number) => void; onField: (label: string) => void }) {
  const { lines, total } = billBreakdown(nurseRate, mode);
  return (
    <div className="flex min-h-full flex-col gap-3 bg-canvas p-4">
      <section className="flex flex-col gap-3 rounded-xl bg-white p-4">
        <div className="flex gap-3">
          <Field label="License" value="CNA" onClick={() => onField('License')} />
          {mode === 'w2' && <Field label="State" value="Ohio" onClick={() => onField('State')} />}
        </div>

        <div>
          <p className="text-[13px] text-ink-2">Nurse hourly rate</p>
          <div className="mt-1 flex h-12 items-center rounded-md border border-line">
            <button onClick={() => onRate(Math.max(15, nurseRate - 1))} aria-label="Lower rate by $1" className="grid h-full w-12 place-items-center text-brand">
              <Minus size={18} />
            </button>
            <span className="flex-1 text-center text-[18px] font-medium text-ink tabular-nums">{money(nurseRate)}/hr</span>
            <button onClick={() => onRate(Math.min(80, nurseRate + 1))} aria-label="Raise rate by $1" className="grid h-full w-12 place-items-center text-brand">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </section>

      {mode === 'w2' && (
        <section className="flex gap-3 rounded-xl bg-warn-soft p-3 text-[13px] leading-snug text-warn">
          <TriangleAlert size={18} className="shrink-0" />
          <span>Hours over 40 in a week are paid and billed at 1.5x overtime.</span>
        </section>
      )}

      <section className="rounded-xl bg-white px-4 py-2">
        <h3 className="flex items-center gap-1.5 pt-2 pb-1 text-[13px] font-bold tracking-wide text-ink-2 uppercase">
          {mode === 'w2' ? 'Bill rate calculator' : 'Breakdown of cost'} <Info size={14} className="text-ink-3" />
        </h3>
        {lines.map((l, i) => (
          <AmountRow key={l.label} label={l.label} amount={`${i === 0 ? '' : '+ '}${money(l.amount)}`} />
        ))}
        <div className="border-t border-line/60">
          <AmountRow label="You pay per hour" amount={money(total)} strong />
        </div>
      </section>
      <p className="px-1 text-[12px] leading-relaxed text-ink-3">
        {mode === 'w2'
          ? 'Payroll taxes cover the employer share of FICA, unemployment and workers’ comp, and vary by state. Figures are illustrative.'
          : 'No payroll taxes or overtime: the nurse rate plus the platform fee. Figures are illustrative.'}
      </p>
    </div>
  );
}

function Field({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex-1 text-left">
      <span className="block text-[13px] text-ink-2">{label}</span>
      <span className="mt-1 flex h-11 items-center justify-between rounded-md border border-line px-3 text-[15px] text-ink">
        {value} <ChevronDown size={16} className="text-ink-3" />
      </span>
    </button>
  );
}
