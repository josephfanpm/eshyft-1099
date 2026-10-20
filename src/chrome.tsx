import { BatteryFull, ChevronLeft, MessageCircleQuestion, Signal, User, Wifi, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** Status bar and blue title bar shared by every screen. */
export function Header({ title, onBack, onHelp, onProfile }: { title: string; onBack?: () => void; onHelp: () => void; onProfile?: () => void }) {
  return (
    <header className="shrink-0 bg-brand text-white">
      <div className="flex h-11 items-center justify-between px-8 pt-1 text-[15px] font-medium">
        <span>9:41</span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <Signal size={15} strokeWidth={2.5} />
          <Wifi size={15} strokeWidth={2.5} />
          <BatteryFull size={20} strokeWidth={2} />
        </span>
      </div>
      <div className="relative flex h-11 items-center justify-center px-4">
        {onBack && (
          <button onClick={onBack} className="absolute left-3 flex items-center gap-1 text-[17px]">
            <ChevronLeft size={22} /> Back
          </button>
        )}
        <h1 className="text-[19px] font-normal tracking-wide uppercase">{title}</h1>
        <div className="absolute right-3 flex items-center gap-3">
          <button onClick={onHelp} aria-label="Help">
            <MessageCircleQuestion size={22} strokeWidth={1.75} />
          </button>
          {onProfile && (
            <button onClick={onProfile} aria-label="Profile">
              <User size={22} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
}

export function BottomNav({ items, active, onSelect }: { items: NavItem[]; active: string; onSelect: (label: string) => void }) {
  return (
    <nav className="flex h-[52px] shrink-0 border-t border-line/60 bg-white">
      {items.map(({ label, icon: Icon }) => {
        const on = label === active;
        return (
          <button
            key={label}
            onClick={() => onSelect(label)}
            aria-current={on ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium uppercase ${on ? 'text-brand' : 'text-ink-3'}`}
          >
            <Icon size={20} strokeWidth={on ? 2.25 : 2} className={on ? '' : 'fill-ink-3/30'} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

export function HomeIndicator() {
  return (
    <div className="flex h-[22px] shrink-0 items-start justify-center bg-inherit" aria-hidden="true">
      <span className="h-[5px] w-[134px] rounded-full bg-ink/80" />
    </div>
  );
}

/** The white strip under the header that labels a screen section. */
export function DateBar({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between bg-white px-4 text-[15px] text-ink-2">
      <span>{children}</span>
      {right}
    </div>
  );
}

/** A labelled amount row used on pay stubs and the facility cost breakdown. */
export function AmountRow({ label, amount, minus, strong }: { label: ReactNode; amount: string; minus?: boolean; strong?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-2 ${strong ? 'text-[15px] font-bold text-ink' : 'text-[14px] text-ink-2'}`}>
      <span>{label}</span>
      <span className={`tabular-nums ${minus ? 'text-urgent' : ''}`}>
        {minus ? '- ' : ''}
        {amount}
      </span>
    </div>
  );
}
