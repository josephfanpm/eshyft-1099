import { Bell, CalendarCheck, CircleDollarSign, House, MessageSquare, Search, Stethoscope, Timer } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { BottomNav, Header, HomeIndicator, type NavItem } from './chrome';
import { generateShifts, generateTimecards, money, type Mode, type Shift } from './data';
import { FacilityRates } from './facility';
import { EarningsTab, ShiftDetail, ShiftsTab, TimecardDetail } from './nurse';
import { TermsModal } from './TermsModal';

type App = 'nurse' | 'facility';
type Route = { name: 'shifts' } | { name: 'earnings' } | { name: 'shift'; id: string } | { name: 'timecard'; id: string };
type ScreenKey = Route['name'] | 'facility';

const REPO = 'https://github.com/josephfanpm/eshyft-1099';

/** What the switch changed on each screen, shown beside the phone. */
const CHANGES: Record<ScreenKey, string[]> = {
  shifts: [
    'The same shifts show higher hourly rates and totals, because payroll taxes no longer come out of them.',
    'The Overtime filter is gone. Contractors are not paid overtime.',
  ],
  shift: [
    'Estimated earnings explain who handles taxes: withheld by the employer, or filed by the nurse.',
    'Applying is blocked until the nurse accepts the new Terms of Use.',
  ],
  earnings: [
    'The Timecards tab is renamed Earnings.',
    'Pay on demand, capped at part of approved pay to cover withholding, becomes InstantPay for 100% of it.',
    'A wallet adds payout history and a downloadable earnings statement.',
  ],
  timecard: ['Four withholding lines become two flat insurance fees per shift.', 'The pay stub says the nurse files their own taxes, and when a 1099 is issued.'],
  facility: [
    'The calculator drops the state picker, payroll taxes and processing fee. The bill rate is the nurse rate plus a platform fee.',
    'The overtime warning is removed.',
    'At the same nurse rate, the facility pays less per hour.',
  ],
};

export function App() {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const [mode, setMode] = useState<Mode>('w2');
  const [app, setApp] = useState<App>('nurse');
  const [shifts, setShifts] = useState<Shift[]>(() => generateShifts(today));
  const [timecards] = useState(() => generateTimecards(today));
  const [stack, setStack] = useState<Route[]>([{ name: 'shifts' }]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsSeen, setTermsSeen] = useState(false);
  const [pendingApply, setPendingApply] = useState<string | null>(null);
  const [nurseRate, setNurseRate] = useState(32);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const route = stack[stack.length - 1]!;
  const push = (r: Route) => setStack((s) => [...s, r]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const tab = (name: 'shifts' | 'earnings') => setStack([{ name }]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [route, app]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const switchMode = (next: Mode) => {
    setMode(next);
    // Every existing nurse met the terms update the first time they opened the app after the switch.
    if (next === '1099' && app === 'nurse' && !termsAccepted && !termsSeen) {
      setTermsOpen(true);
      setTermsSeen(true);
    }
    if (next === 'w2') setTermsOpen(false);
  };

  const setStatus = (id: string, status: Shift['status']) => setShifts((all) => all.map((s) => (s.id === id ? { ...s, status } : s)));

  const apply = (id: string) => {
    if (mode === '1099' && !termsAccepted) {
      setPendingApply(id);
      setTermsOpen(true);
      return;
    }
    setStatus(id, 'applied');
    setToast('Application sent');
  };

  const reset = () => {
    setMode('w2');
    setApp('nurse');
    setShifts(generateShifts(today));
    setStack([{ name: 'shifts' }]);
    setTermsAccepted(false);
    setTermsOpen(false);
    setTermsSeen(false);
    setPendingApply(null);
    setNurseRate(32);
  };

  const outside = (what: string) => setToast(`${what} is outside this prototype`);

  let title: string;
  let body: ReactNode;
  let nav: { items: NavItem[]; active: string; onSelect: (label: string) => void } | null = null;
  const earningsLabel = mode === 'w2' ? 'Timecards' : 'Earnings';

  if (app === 'facility') {
    title = 'Create shift';
    body = <FacilityRates mode={mode} nurseRate={nurseRate} onRate={setNurseRate} onField={outside} />;
    nav = {
      items: [
        { label: 'Feed', icon: Bell },
        { label: 'Shifts', icon: CalendarCheck },
        { label: 'Timecards', icon: Timer },
        { label: 'Nurses', icon: Stethoscope },
        { label: 'Chats', icon: MessageSquare },
      ],
      active: 'Shifts',
      onSelect: (label) => label !== 'Shifts' && outside(label),
    };
  } else {
    const items: NavItem[] = [
      { label: 'Home', icon: House },
      { label: 'Shifts', icon: Search },
      { label: 'My shifts', icon: CalendarCheck },
      { label: earningsLabel, icon: CircleDollarSign },
      { label: 'Chats', icon: MessageSquare },
    ];
    const onSelect = (label: string) => (label === 'Shifts' ? tab('shifts') : label === earningsLabel ? tab('earnings') : outside(label));

    if (route.name === 'shifts') {
      title = 'Find shifts';
      body = <ShiftsTab shifts={shifts} mode={mode} onShift={(id) => push({ name: 'shift', id })} onFilter={() => outside('Filtering')} />;
      nav = { items, active: 'Shifts', onSelect };
    } else if (route.name === 'earnings') {
      title = earningsLabel;
      body = (
        <EarningsTab
          timecards={timecards}
          mode={mode}
          onTimecard={(id) => push({ name: 'timecard', id })}
          onCashOut={() => setToast(mode === 'w2' ? 'Cash-out requests went through the payroll provider' : 'InstantPay sends your balance to your bank in minutes')}
          onRow={outside}
        />
      );
      nav = { items, active: earningsLabel, onSelect };
    } else if (route.name === 'shift') {
      title = 'Shift';
      const shift = shifts.find((s) => s.id === route.id)!;
      body = (
        <ShiftDetail
          shift={shift}
          mode={mode}
          onApply={() => apply(shift.id)}
          onWithdraw={() => {
            setStatus(shift.id, 'open');
            setToast('Application withdrawn');
          }}
        />
      );
    } else {
      title = 'Timecard';
      body = <TimecardDetail timecard={timecards.find((t) => t.id === route.id)!} mode={mode} />;
    }
  }

  const screen: ScreenKey = app === 'facility' ? 'facility' : route.name;
  const onRoot = app === 'facility' || nav !== null;

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-10 md:flex-row md:p-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white md:h-[min(812px,calc(100vh-48px))] md:w-[375px] md:shrink-0 md:rounded-[44px] md:border-[10px] md:border-ink md:shadow-2xl">
        <Header title={title} onBack={onRoot ? undefined : back} onHelp={() => outside('Help')} onProfile={onRoot ? () => outside('Profile') : undefined} />
        <main ref={scrollRef} key={`${app}-${stack.length}`} className="no-scrollbar screen-enter flex flex-1 flex-col overflow-y-auto bg-canvas">
          {body}
        </main>
        {nav && <BottomNav {...nav} />}
        <div className="bg-white">
          <HomeIndicator />
        </div>
        {termsOpen && (
          <TermsModal
            onClose={() => {
              setTermsOpen(false);
              setPendingApply(null);
            }}
            onAccept={() => {
              setTermsAccepted(true);
              setTermsOpen(false);
              if (pendingApply) {
                setStatus(pendingApply, 'applied');
                setPendingApply(null);
                setToast('Terms accepted. Application sent.');
              } else {
                setToast('Terms accepted. You can book 1099 shifts.');
              }
            }}
          />
        )}
        {toast && (
          <div role="status" className="absolute inset-x-4 bottom-24 z-30 rounded-lg bg-ink/90 px-4 py-3 text-center text-[13px] text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>

      <aside className="w-full max-w-[400px] px-5 pb-12 md:px-0 md:pb-0">
        <p className="text-[12px] font-bold tracking-widest text-brand uppercase">Product case study</p>
        <h2 className="mt-2 text-[28px] leading-tight font-bold text-ink">Moving nurses from W-2 to 1099</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          As W-2 employees, nurses saw hourly rates 15-20% below competing 1099 apps for the same shift, because taxes came out first. Take-home pay was comparable, but
          nurses booked the shifts that appeared to have a higher hourly rate. On January 1, 2026 the app switched to 1099. Weekly revenue rose about 2.5x and fill rate about 2x.
        </p>

        <h3 className="mt-6 text-[14px] font-bold text-ink">Compare</h3>
        <Segmented
          label="Employment model"
          value={mode}
          onChange={switchMode}
          options={[
            ['w2', 'Before: W-2'],
            ['1099', 'After: 1099'],
          ]}
        />
        <Segmented
          label="App"
          value={app}
          onChange={(next) => {
            setApp(next);
            setTermsOpen(false);
          }}
          options={[
            ['nurse', 'Nurse app'],
            ['facility', 'Facility app'],
          ]}
        />

        <div className="mt-4 rounded-xl border border-line bg-white p-4">
          <p className="text-[12px] font-bold tracking-wide text-ink-3 uppercase">What changes on this screen</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[14px] leading-snug text-ink-2">
            {CHANGES[screen].map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          {screen === 'shifts' && (
            <p className="mt-3 text-[13px] text-ink-3">
              {shifts[0]!.facility}, {shifts[0]!.role}: {money(shifts[0]!.w2Rate)}/hr as W-2, {money(shifts[0]!.rate)}/hr as 1099.
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {mode === '1099' && app === 'nurse' && (
            <button onClick={() => setTermsOpen(true)} className="rounded-full border border-brand bg-white px-3 py-1.5 text-[13px] text-brand">
              Show the terms update
            </button>
          )}
          <button onClick={reset} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-ink-2">
            Reset demo
          </button>
        </div>

        <h3 className="mt-6 text-[14px] font-bold text-ink">Try it</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-ink-2">
          <li>Flip between W-2 and 1099 on the shift list and watch the same shifts change price.</li>
          <li>Switch to 1099 and apply to a shift. The new Terms of Use have to be accepted first.</li>
          <li>Open {earningsLabel} and tap a timecard to compare a W-2 paycheck with a contractor payout.</li>
          <li>Open the facility app and change the nurse rate to see what the facility pays under each model.</li>
        </ul>

        <p className="mt-6 text-[13px] text-ink-2">
          <a className="font-medium text-brand underline-offset-2 hover:underline" href={`${REPO}/blob/main/docs/CASE_STUDY.md`}>
            Read the full case study
          </a>{' '}
          ·{' '}
          <a className="font-medium text-brand underline-offset-2 hover:underline" href={REPO}>
            Source on GitHub
          </a>
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
          An independent recreation of a change I led as a product manager. Facilities, rates and tax figures are illustrative, and this is not an official app.
        </p>
      </aside>
    </div>
  );
}

function Segmented<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: ReadonlyArray<readonly [T, string]> }) {
  return (
    <div role="radiogroup" aria-label={label} className="mt-2 flex rounded-full border border-line bg-white p-1">
      {options.map(([v, text]) => (
        <button
          key={v}
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`h-9 flex-1 rounded-full text-[14px] ${value === v ? 'bg-brand font-medium text-white' : 'text-ink-2'}`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
