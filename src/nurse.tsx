import { ArrowUpDown, ChevronDown, ChevronRight, CircleAlert, CircleDollarSign, Clock, FileText, Heart, House, Info, Moon, Search, SlidersHorizontal, Sun, Sunset, Wallet, Zap } from 'lucide-react';
import { useState } from 'react';
import { AmountRow } from './chrome';
import { cashOutAvailable, fromKey, money, payBreakdown, rateFor, round2, SLOT_TIME, type Mode, type Role, type Shift, type Slot, type Timecard } from './data';

const ROLE_COLOR: Record<Role, string> = { CNA: 'bg-brand', LPN: 'bg-lpn', RN: 'bg-rn' };
const SLOT_ICON = { day: Sun, evening: Sunset, night: Moon } as const;

function SlotGlyph({ slot }: { slot: Slot }) {
  const Icon = SLOT_ICON[slot];
  return <Icon size={13} strokeWidth={1.75} className="shrink-0 text-brand" />;
}

function DateBlock({ date, role }: { date: string; role: Role }) {
  const d = fromKey(date);
  return (
    <div className="flex w-[60px] shrink-0 flex-col items-center">
      <div className="flex items-center gap-1">
        <span className="text-[10px] leading-tight text-ink-2 uppercase">
          {d.toLocaleDateString('en-US', { weekday: 'short' })}
          <br />
          {d.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-[30px] leading-none font-light text-ink-2">{String(d.getDate()).padStart(2, '0')}</span>
      </div>
      <span className={`mt-1.5 w-full rounded-full py-0.5 text-center text-[12px] text-white ${ROLE_COLOR[role]}`}>{role}</span>
    </div>
  );
}

// --- Shifts tab ----------------------------------------------------------------------

function ShiftCard({ shift, mode, onOpen }: { shift: Shift; mode: Mode; onOpen: () => void }) {
  const rate = rateFor(shift, mode);
  return (
    <button onClick={onOpen} className="flex w-full gap-3 bg-white px-4 py-4 text-left hover:bg-canvas/40">
      <DateBlock date={shift.date} role={shift.role} />
      <span className="w-px self-stretch bg-line" />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-snug font-medium text-ink-2">
          {shift.favorite && <Heart size={13} className="mr-1 inline fill-urgent text-urgent" />}
          {shift.facility}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-3">
          {shift.town} <span className="text-line">|</span> <House size={11} className="fill-ink-3" /> {shift.miles} mi
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] whitespace-nowrap text-ink-2">
          <SlotGlyph slot={shift.slot} /> {SLOT_TIME[shift.slot]}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {shift.status === 'applied' && <span className="rounded bg-brand-soft px-2 py-0.5 text-[12px] text-brand">Applied</span>}
          {shift.urgent && (
            <span className="flex items-center gap-1 rounded bg-urgent-soft px-2 py-0.5 text-[12px] text-urgent">
              <CircleAlert size={11} className="fill-current [&>line]:text-white" /> Urgent
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[16px] font-bold text-ink-2">{money(rate)}/hr</p>
        <p className="mt-1 text-[14px] text-ink-2">{money(round2(rate * shift.hours))}</p>
      </div>
    </button>
  );
}

export function ShiftsTab({ shifts, mode, onShift, onFilter }: { shifts: Shift[]; mode: Mode; onShift: (id: string) => void; onFilter: () => void }) {
  const [highestFirst, setHighestFirst] = useState(true);
  const list = [...shifts].sort((a, b) => a.date.localeCompare(b.date) || (highestFirst ? b.rate - a.rate : a.rate - b.rate));
  // Overtime only exists for employees, so the filter left with W-2.
  const chips = ['$15 - $100/hr', 'Next 14 days', '0-50 miles', 'All roles', ...(mode === 'w2' ? ['Overtime'] : [])];

  return (
    <>
      <div className="bg-white px-4 pt-4 pb-3">
        <button onClick={onFilter} className="flex h-12 w-full items-center gap-3 rounded-full border border-line px-4 text-left text-[15px] text-brand">
          <Search size={18} className="text-ink-3" /> Home address
          <span className="relative ml-auto grid size-8 place-items-center rounded-full bg-canvas">
            <SlidersHorizontal size={15} className="text-brand" />
          </span>
        </button>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {chips.map((chip) => (
            <button key={chip} onClick={onFilter} className="flex shrink-0 items-center gap-1 rounded-full bg-brand px-4 py-2 text-[14px] text-white">
              {chip} <ChevronDown size={15} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end bg-canvas px-4 py-2.5">
        <button onClick={() => setHighestFirst((v) => !v)} className="flex items-center gap-1.5 text-[14px] text-brand">
          <ArrowUpDown size={15} /> Rate: {highestFirst ? 'highest to lowest' : 'lowest to highest'}
        </button>
      </div>
      <div className="flex flex-col gap-2 bg-canvas pb-2">
        {list.map((s) => (
          <ShiftCard key={s.id} shift={s} mode={mode} onOpen={() => onShift(s.id)} />
        ))}
      </div>
    </>
  );
}

// --- Shift detail --------------------------------------------------------------------

export function ShiftDetail({ shift, mode, onApply, onWithdraw }: { shift: Shift; mode: Mode; onApply: () => void; onWithdraw: () => void }) {
  const rate = rateFor(shift, mode);
  const total = round2(rate * shift.hours);
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <div className="flex gap-3 bg-white px-4 py-3">
        <DateBlock date={shift.date} role={shift.role} />
        <span className="w-px self-stretch bg-line" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-snug font-medium text-ink-2">{shift.facility}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-3">
            {shift.town} <span className="text-line">|</span> <House size={11} className="fill-ink-3" /> {shift.miles} mi
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-2">
            <SlotGlyph slot={shift.slot} /> {SLOT_TIME[shift.slot]}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[16px] font-bold text-ink-2">{money(total)}</p>
          <p className="mt-1 text-[13px] text-ink-2">{money(rate)}/hr</p>
        </div>
      </div>

      <div className="m-4 rounded-xl bg-white p-4">
        <p className="flex items-center gap-2 text-[15px] font-medium text-ink">
          <CircleDollarSign size={18} className="text-ok" /> Estimated earnings
        </p>
        <p className="mt-2 text-[28px] font-bold text-ink">{money(total)}</p>
        <p className="mt-1 text-[13px] text-ink-2">
          {shift.hours} hours × {money(rate)}/hr
        </p>
        <p className="mt-3 border-t border-line/60 pt-3 text-[13px] leading-relaxed text-ink-2">
          {mode === 'w2'
            ? 'Federal, state and payroll taxes are withheld from your paycheck. Shifts over 40 hours in a week pay overtime.'
            : "You're paid 100% of your earnings, less a small insurance fee per shift. As an independent contractor, you manage your own taxes."}
        </p>
      </div>

      <div className="mx-4 rounded-xl bg-white p-4">
        <h3 className="text-[15px] font-medium text-ink">Facility description</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
          A skilled nursing facility with long-term care and short-term rehab units. Parking is free, and per diem staff check in at the front desk 15 minutes before the
          shift.
        </p>
      </div>

      <div className="flex-1" />
      <div className="sticky bottom-0 mt-4 bg-white p-3 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
        {shift.status === 'open' ? (
          <button onClick={onApply} className="h-11 w-full rounded-md bg-brand text-[15px] font-medium text-white">
            Apply for this shift
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <p className="flex-1 text-[13px] text-ink-2">Applied. The facility will confirm or decline.</p>
            <button onClick={onWithdraw} className="h-10 rounded-md border border-line px-4 text-[14px] text-ink-2">
              Withdraw
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Earnings (formerly Timecards) ----------------------------------------------------

export function EarningsTab({ timecards, mode, onTimecard, onCashOut, onRow }: { timecards: Timecard[]; mode: Mode; onTimecard: (id: string) => void; onCashOut: () => void; onRow: (label: string) => void }) {
  const available = cashOutAvailable(timecards, mode);
  return (
    <div className="flex min-h-full flex-col gap-3 bg-canvas p-4">
      {mode === 'w2' ? (
        <section className="rounded-xl bg-white p-4">
          <p className="flex items-center gap-2 text-[14px] font-medium text-pod">
            <Zap size={16} className="fill-current" /> Pay on demand
          </p>
          <p className="mt-2 text-[13px] text-ink-2">Available to cash out before payday</p>
          <p className="mt-1 text-[28px] font-bold text-ink">{money(available)}</p>
          <p className="mt-1 text-[12px] leading-snug text-ink-3">
            You can cash out part of your approved earnings early. The rest is held for tax withholding and paid on payday.
          </p>
          <button onClick={onCashOut} className="mt-3 h-10 w-full rounded-md bg-pod text-[14px] font-medium text-white">
            Cash out
          </button>
        </section>
      ) : (
        <section className="rounded-xl bg-white p-4">
          <p className="flex items-center gap-1.5 text-[13px] text-ink-2">
            InstantPay balance <Info size={14} className="text-ink-3" />
          </p>
          <p className="mt-1 text-[28px] font-bold text-ink">{money(available)}</p>
          <p className="mt-1 text-[12px] leading-snug text-ink-3">100% of your approved earnings, after insurance fees.</p>
          <button onClick={onCashOut} className="mt-3 h-10 w-full rounded-md bg-brand text-[14px] font-medium text-white">
            Request InstantPay
          </button>
        </section>
      )}

      {mode === '1099' && (
        <section className="shrink-0 overflow-hidden rounded-xl bg-white">
          {[
            { label: 'Payout history', icon: Wallet },
            { label: 'Earnings Statement', icon: FileText },
          ].map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => onRow(label)} className="flex w-full items-center gap-3 border-b border-line/50 px-4 py-3 text-left text-[14px] text-ink last:border-0">
              <Icon size={18} className="text-brand" /> <span className="flex-1">{label}</span> <ChevronRight size={18} className="text-ink-3" />
            </button>
          ))}
        </section>
      )}

      <h2 className="mt-1 text-[13px] font-bold tracking-wide text-ink-2 uppercase">This week</h2>
      {timecards.map((tc) => {
        const { gross } = payBreakdown(tc, mode);
        return (
          <button key={tc.id} onClick={() => onTimecard(tc.id)} className="flex w-full gap-3 rounded-xl bg-white px-3 py-3 text-left">
            <DateBlock date={tc.date} role={tc.role} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-snug font-medium text-ink-2">{tc.facility}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-3">
                <Clock size={12} /> {tc.hours} hrs × {money(rateFor(tc, mode))}/hr
              </p>
              <span className={`mt-2 inline-block rounded px-2 py-0.5 text-[12px] ${tc.status === 'approved' ? 'bg-ok-soft text-ok' : 'bg-canvas text-ink-2'}`}>
                {tc.status === 'approved' ? 'Approved' : 'Pending approval'}
              </span>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-bold text-ink-2">{money(gross)}</p>
              <ChevronRight size={18} className="mt-2 ml-auto text-ink-3" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function TimecardDetail({ timecard, mode }: { timecard: Timecard; mode: Mode }) {
  const { gross, lines, net } = payBreakdown(timecard, mode);
  const d = fromKey(timecard.date);
  return (
    <div className="flex min-h-full flex-col gap-3 bg-canvas p-4">
      <section className="rounded-xl bg-white p-4">
        <p className="text-[13px] text-ink-3">{d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <p className="mt-1 text-[15px] font-medium text-ink">{timecard.facility}</p>
        <p className="mt-1 text-[13px] text-ink-2">
          {timecard.role} · {timecard.hours} hours × {money(rateFor(timecard, mode))}/hr
        </p>
      </section>
      <section className="rounded-xl bg-white px-4 py-2">
        <h3 className="pt-2 pb-1 text-[13px] font-bold tracking-wide text-ink-2 uppercase">{mode === 'w2' ? 'Paycheck' : 'Earning summary'}</h3>
        <AmountRow label={mode === 'w2' ? 'Gross pay' : 'Earnings'} amount={money(gross)} />
        {lines.map((l) => (
          <AmountRow key={l.label} label={l.label} amount={money(l.amount)} minus />
        ))}
        <div className="border-t border-line/60">
          <AmountRow label={mode === 'w2' ? 'Take-home pay' : 'Payout'} amount={money(net)} strong />
        </div>
      </section>
      <p className="px-1 text-[12px] leading-relaxed text-ink-3">
        {mode === 'w2'
          ? 'Taxes are withheld by your employer and reported on your W-2. Withholding shown here is illustrative.'
          : "No taxes are withheld. As an independent contractor, you'll manage your own tax filings, and earnings of $600 or more are reported on a 1099."}
      </p>
    </div>
  );
}
