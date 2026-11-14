# W-2 to 1099: moving a nurse staffing marketplace to contractors

I proposed and led ESHYFT's switch from employing nurses as W-2 employees to working with them as 1099 independent contractors. It launched on January 1, 2026. Since launch, revenue is up by over 80% and fill rate has roughly doubled.

**[Try the live demo: interactive prototype](https://josephfanpm.github.io/eshyft-1099/)** · [Full case study](docs/CASE_STUDY.md) · [Requirements (PRD)](docs/PRD.md)

Try this first: switch between Before: W-2 and After: 1099, then apply to a shift and compare a W-2 paycheck with a contractor payout.


![The prototype on desktop: a phone showing the nurse app, with a W-2 / 1099 switch and a list of what changed beside it](docs/screenshots/desktop.png)

The prototype is my own before-and-after recreation, built for this portfolio. Facilities, rates and tax figures are made up, and ESHYFT's branding is left out.

## At a glance

| | |
|---|---|
| **Company** | ESHYFT, a marketplace where nursing homes post per diem shifts and CNAs, LPNs and RNs pick them up |
| **Change** | Nurses moved from W-2 employees to 1099 contractors, on a single date |
| **Timeline** | Kickoff late September 2025, launch January 1, 2026 (about three months) |
| **Scope** | Nurse app, facility apps, admin tools, payouts, Terms of Use |
| **Result** | Revenue up by over 80% and fill rate roughly doubled since launch |
| **Lesson** | The biggest lever on fill rate wasn't a feature. It was the employment model. |

## Problem

Per diem nurses keep two or three staffing apps on their phone and book whichever shift pays best on the day they're free. The largest competitors (ShiftKey, Clipboard Health, CareRev, Nursa) treat nurses as contractors. ESHYFT employed them as W-2 employees.

Under W-2, taxes came out of the rate before the nurse saw it. Our posted hourly rates typically looked **15–20% lower** than a competitor's for comparable work. Take-home pay was comparable after taxes, but nurses compare the rates on screen, and they booked the shift that looked like it paid more.

The gap mattered. In our rate experiments, boosting a shift by as little as **$1 an hour increased confirmed shifts by more than 10%**.

ESHYFT had chosen W-2 for good reasons: early facility customers preferred it, and the legal climate in several key states favored employee status. A PESTLE review showed those conditions had shifted by 2025. The [case study](docs/CASE_STUDY.md#why-eshyft-started-as-a-w-2-employer) has the full review with sources.

## Target users

| User | What they need | What W-2 cost them |
|---|---|---|
| **Per diem nurses** (CNAs, LPNs, RNs) | A competitive posted rate, flexible shifts, fast access to pay | Lower-looking rates, only partial early cash-out |
| **Facilities** (nursing homes) | Shifts filled at a predictable cost | A bill rate loaded with payroll taxes and a processing fee |
| **ESHYFT operations** | One clear model per nurse, a record of consent, reliable payouts | Withholding and employee-only steps (overtime, I-9) on every shift |

## Solution

Every nurse, facility and shift got an employment type. From January 1, 2026, shifts at eligible facilities became 1099; a small number of states stayed W-2.

| Area | Before: W-2 | After: 1099 |
|---|---|---|
| Posted rate | Taxes withheld | No withholding; two small per-shift insurance fees (occupational accident, malpractice) |
| Early cash-out | Part of approved pay | All of it, on a new payout system |
| Nurse app | Timecards, work state, overtime, I-9 step | Earnings, license state, no overtime or I-9 |
| Consent | n/a | Must accept new Terms of Use before applying, booking or clocking in on a contractor shift |
| Facility bill rate | Nurse rate + payroll taxes + platform fee + processing fee | Nurse rate + platform fee; overtime settings removed |
| Admin tools | n/a | Employment-type filters, contractor payouts, terms-acceptance record |

| Screen | Before: W-2 | After: 1099 |
|---|---|---|
| Shift list | ![W-2 shift list](docs/screenshots/shifts-w2.png) | ![1099 shift list](docs/screenshots/shifts-1099.png) |
| Earnings | ![W-2 timecards tab](docs/screenshots/earnings-w2.png) | ![1099 earnings tab](docs/screenshots/earnings-1099.png) |
| Pay stub | ![W-2 paycheck](docs/screenshots/timecard-w2.png) | ![1099 payout](docs/screenshots/timecard-1099.png) |
| Facility calculator | ![W-2 bill rate calculator](docs/screenshots/facility-w2.png) | ![1099 cost breakdown](docs/screenshots/facility-1099.png) |

## My role

Product manager. I:

- Found the problem through competitive analysis, rate experiments and conversations with nurses and facilities.
- Ran a PESTLE review of why ESHYFT chose W-2 and what had changed since.
- Made the case to leadership to switch, despite the risk of losing large clients who preferred W-2. Leadership agreed.
- Led the conversion across the nurse app, facility apps, admin tools, payouts and legal language, from kickoff to launch.
- Built this prototype and wrote the case study.

<!-- TODO(Joseph): Optional: team size and who you worked with (eng, design, legal, finance, ops), if you're comfortable sharing. -->

## Key decisions and trade-offs

<!-- TODO(Joseph): The "Options considered" column lists the natural alternatives to each choice. The case study records the choice and the reasoning, not a formal options list. Confirm these match what was actually on the table. -->

| Decision | Options considered | Chosen | Given up | Why |
|---|---|---|---|---|
| **Employment model** | Stay W-2; move to 1099 | 1099 | Some large clients had chosen ESHYFT partly because it was a W-2 employer, each a significant share of revenue | Nurses picked shifts on posted rate. A 15–20% gap was the biggest thing holding back fill rate, and a $1/hr boost alone moved confirmed shifts more than 10%. |
| **Facility pricing** | Keep payroll costs in the bill rate; drop them | Bill rate = nurse rate + platform fee | Payroll taxes and the processing fee as bill-rate line items | Facilities pay the same or less for the same nurse rate. That answered the main client risk. |
| **Where to switch** | All states; only where the law supports it | Most states moved; a small number stayed W-2 | One model everywhere; the product supports both | Strict "ABC test" states make contractor status harder to defend. Legal counsel wrote the new terms and privacy policy. |
| **One classification per nurse** | Let nurses work both types; one type per nurse | One type per nurse | Nurses can't see the other type's shifts | Nobody ends up with both a W-2 and a 1099 in the same year, which would create messy payroll and taxes. |
| **Cutover** | Phased migration; one date for everyone | Single date, January 1, 2026 | A softer rollout; W-2 and 1099 timecards ran side by side briefly | A clean tax-year boundary, and December shifts were still paid under the old model. |
| **Consent** | Notice only; required acceptance | Full-screen notice plus required acceptance before applying, booking or clocking in on a contractor shift | Extra friction at each nurse's next booking | Every contractor shift is covered by recorded acceptance of the new terms. |

## Success metrics

**Measured results** (from the [case study](docs/CASE_STUDY.md#impact))

| Metric | Result |
|---|---|
| Revenue | Up by over 80% since launch |
| Fill rate | Roughly doubled |

<!-- TODO(Joseph): Add the measurement window (e.g. "first N weeks after launch vs the N weeks before") and note anything else that changed in that period and could explain part of the lift. -->

**Pre-launch evidence** that justified the bet

| Signal | Finding |
|---|---|
| Posted-rate gap vs 1099 competitors | W-2 rates typically looked 15–20% lower for comparable work |
| Rate sensitivity | A boost of as little as $1/hr increased confirmed shifts by more than 10% |

**KPIs I'd track for this change** (tracking metrics, no values claimed)

| KPI | Why it matters |
|---|---|
| Fill rate and confirmed shifts per week | The core goal |
| Posted-rate gap vs competitors on comparable shifts | Confirms the root cause is fixed |
| Large-client retention and bill rate per hour | The main risk of the switch |
| Terms acceptance rate among existing nurses | Nurses who don't accept can't book contractor shifts |
| Payout errors and support tickets around cutover | Goal: no interruption to shifts or payouts |
| Share of shifts in states that stayed W-2 | Size of the remaining carve-out |

<!-- TODO(Joseph): If you have real values for any of these KPIs (e.g. terms acceptance rate, large-client retention), move them into the measured table. -->

## Roadmap

My proposed next steps after launch. These are recommendations, not a committed ESHYFT roadmap.

| Horizon | Item | Why |
|---|---|---|
| **Now** | In-app tax help: collect W-9s, deliver 1099s electronically, show how much to set aside from each payout | Many nurses are filing as contractors for the first time |
| **Next** | Test an estimated take-home amount next to the posted rate | Lets nurses compare what they keep across apps, not only the headline rate |
| **Later** | Track state legislation on healthcare worker platforms | Switch the remaining W-2 states when the law allows; react fast where it tightens |

## Technical fluency

The prototype is a single-page React app with no backend. All pay, cash-out and bill-rate math is pure functions, kept apart from the UI and covered by unit tests.

| Layer | Detail |
|---|---|
| Stack | React 19, TypeScript, Tailwind CSS v4, Vite, Vitest, lucide-react |
| Business logic | [`src/data.ts`](src/data.ts): `payBreakdown` (W-2 withholding vs contractor fees), `cashOutAvailable` (partial vs full early pay), `billBreakdown` (facility bill rate under each model), demo data |
| Tests | [`src/data.test.ts`](src/data.test.ts): every demo W-2 rate sits 15–20% below its 1099 rate; pay stubs and cash-out add up; a facility pays more under W-2 at the same nurse rate |
| App shell and state | [`src/App.tsx`](src/App.tsx): W-2/1099 mode, route stack, per-screen change notes, the terms gate on apply |
| Screens | [`src/nurse.tsx`](src/nurse.tsx) (shifts, earnings, pay stub), [`src/facility.tsx`](src/facility.tsx) (bill rate calculator), [`src/TermsModal.tsx`](src/TermsModal.tsx), [`src/chrome.tsx`](src/chrome.tsx) |
| CI/CD | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): on push to `main`, runs tests, builds and deploys to GitHub Pages |

Choices worth noting:

- **Illustrative numbers, real structure.** Rates, withholding and fees are made up, but the line items and rules follow what shipped. The tests lock in relationships (the rate gap, who pays more), not real figures.
- **No confidential data.** Original design exports are git-ignored; only screenshots of this recreation are published.

## Try the prototype

- Switch between **Before: W-2** and **After: 1099** from the panel beside the phone. The panel lists what changed on the current screen.
- On the shift list, the same shifts post higher rates under 1099, and the Overtime filter disappears.
- Switch to 1099 and the app shows the terms update every existing nurse saw. Close it and apply to a shift: you have to accept the new Terms of Use first.
- Open Timecards (renamed Earnings under 1099). W-2 nurses could cash out only part of their approved pay early; contractors can cash out all of it. Tap a timecard to compare a W-2 paycheck with a contractor payout.
- Switch to the facility app and change the nurse rate. Under W-2 the bill rate adds payroll taxes and a processing fee; under 1099 it's the nurse rate plus a platform fee.
- Reset the demo from the panel to start over.

## Getting started

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # pay and bill-rate logic tests
npm run build
```

## Limitations

- The prototype is my own before-and-after recreation, not the shipped app. Facilities, rates and tax figures are made up, ESHYFT branding is left out, and no confidential data is used. The line items and rules follow what shipped, but the numbers in the demo are illustrative.
- The revenue and fill rate results are real measured results from the launch, but this README does not state the measurement window or what else changed in that period, so it does not prove the switch alone caused the full lift.
- A small number of states stayed W-2, so the switch was not universal. Screen layouts did not change, only classification, pay, pricing, language and consent.
- In-app tax help was not built: collecting W-9s, delivering 1099s electronically, and showing how much to set aside from each payout. That was proposed as a follow-up in the roadmap.
- What I would do next: build the in-app tax help first, test an estimated take-home amount next to the posted rate, and track state legislation so the remaining W-2 states can move when the law allows.
- This writeup does not state team size or who else worked on the change, so the scope of my role here is the work described, not a team chart.

## Credits

Built by Joseph Fan ([@josephfanpm](https://github.com/josephfanpm)). This is an independent portfolio project, not an official ESHYFT app. The copy follows the shipped app and designs; every facility, rate and tax figure is illustrative.

<!-- TODO(Joseph): The repo has no LICENSE file. Add one (or state "All rights reserved") so reuse terms are clear. -->
