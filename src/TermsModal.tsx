import { Check, Landmark, ShieldCheck, Wallet, X } from 'lucide-react';
import { useState } from 'react';

const CHECKS = [
  'I acknowledge the Terms of Use',
  'I agree to the arbitration agreement',
  'I consent to sharing my credentials and information with the platform',
];

const POINTS = [
  { icon: Wallet, title: 'Your Pay', body: 'You will now receive 100% of your earnings.' },
  { icon: ShieldCheck, title: 'Your Safety', body: "You'll be fully covered by Occupational Accident & Medical Malpractice insurance (a small fee applies)." },
  { icon: Landmark, title: 'Your Taxes', body: "As an independent contractor, you'll now manage your own tax filings." },
];

/**
 * The full-screen notice every existing nurse saw at the switch. Applying, booking and clocking in on a
 * contractor shift stayed blocked until all three boxes were checked.
 */
export function TermsModal({ onClose, onAccept }: { onClose: () => void; onAccept: () => void }) {
  const [checked, setChecked] = useState<boolean[]>(CHECKS.map(() => false));
  const ready = checked.every(Boolean);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="terms-title" className="screen-up absolute inset-0 z-20 flex flex-col bg-white">
      <div className="flex h-11 shrink-0 items-center px-3 pt-1">
        <button onClick={onClose} aria-label="Close" className="text-ink-2">
          <X size={24} />
        </button>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-6 text-center">
        <Illustration />
        <h2 id="terms-title" className="mt-4 text-[20px] font-medium text-ink">
          Updates to Terms of Use
        </h2>
        <p className="mt-3 text-[16px] font-medium text-ink">Keep 100% of what you earn 🎉</p>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
          Starting January 1, 2026, you'll be a 1099 independent contractor. <strong className="text-ink">You will receive 100% of your earnings!</strong>
        </p>

        <div className="mt-5 rounded-lg bg-panel p-4 text-left">
          <p className="text-[18px] font-medium text-brand">Starting Jan 1, 2026:</p>
          <ul className="mt-3 flex flex-col gap-3">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-[14px] font-medium text-ink">{title}</span>
                  <span className="block text-[13px] leading-snug text-ink-2">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 text-[14px] text-ink-2">
          Please review and acknowledge the <strong className="text-ink">Terms of Use</strong> below.
        </p>
        <div className="mt-3 rounded-lg bg-white p-4 text-left shadow-[0_0_44px_rgba(120,146,141,0.18)]">
          <p className="text-[16px] font-medium text-ink">Terms of Use</p>
          <hr className="my-3 border-line" />
          <div className="flex flex-col gap-2 text-[12px] leading-relaxed text-ink-3">
            <p>1. Independent contractor relationship. You choose whether, when and where to work and which shifts to accept. Nothing in these terms makes you an employee.</p>
            <p>2. Payment. You are paid for approved time at the rate shown when you booked the shift, less per-shift insurance fees.</p>
            <p>3. Taxes. No taxes are withheld from your payments. You are responsible for reporting and paying your own taxes.</p>
            <p className="italic">Placeholder text for this prototype; the full terms were written by legal counsel.</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-white px-5 pt-3 pb-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-2.5">
          {CHECKS.map((label, i) => (
            <label key={label} className="flex cursor-pointer items-start gap-2.5 text-left text-[13px] leading-snug text-ink-2">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-px grid size-[18px] shrink-0 place-items-center rounded border peer-focus-visible:outline-2 peer-focus-visible:outline-brand ${checked[i] ? 'border-brand bg-brand text-white' : 'border-line bg-white'}`}
              >
                {checked[i] && <Check size={13} strokeWidth={3} />}
              </span>
              {label}
            </label>
          ))}
        </div>
        <button disabled={!ready} onClick={onAccept} className="mt-3 h-11 w-full rounded-md bg-brand text-[15px] font-medium text-white disabled:bg-brand-disabled">
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
}

function Illustration() {
  return (
    <svg viewBox="0 0 136 96" className="mx-auto mt-1 h-24 w-auto" aria-hidden="true">
      <rect x="20" y="12" width="74" height="78" rx="8" fill="#e3f0fe" />
      <rect x="32" y="28" width="50" height="5" rx="2.5" fill="#9cc9fb" />
      <rect x="32" y="40" width="40" height="5" rx="2.5" fill="#9cc9fb" />
      <rect x="32" y="52" width="46" height="5" rx="2.5" fill="#9cc9fb" />
      <circle cx="98" cy="62" r="24" fill="#3699fa" />
      <text x="98" y="70" textAnchor="middle" fontSize="22" fontWeight="700" fill="white" fontFamily="Ubuntu, sans-serif">
        $
      </text>
    </svg>
  );
}
