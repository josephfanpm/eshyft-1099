# PRD: W-2 to 1099 conversion

A condensed requirements summary for the switch, reconstructed for this portfolio from the [case study](CASE_STUDY.md) and the [prototype](https://josephfanpm.github.io/eshyft-1099/). It is not the internal spec. Back to the [README](../README.md).

<!-- TODO(Joseph): If any requirement below differs from what actually shipped, correct it here. Rules marked "prototype" are shown in this repo's code; the rest come from the case study. -->

## Goals

1. Make posted rates competitive with 1099 apps, without raising what facilities pay.
2. Increase fill rate and revenue by winning back shifts nurses were booking elsewhere.
3. Move every eligible nurse and facility on a single date, without interrupting shifts or payouts.

## Non-goals

- Changing screen layouts. The work was classification, pay, pricing, language and consent.
- Moving every state. A small number of states stayed W-2.
- In-app tax tools (W-9 collection, e-delivered 1099s, set-aside estimates). Proposed as a follow-up; see the [roadmap](../README.md#roadmap).

## Requirements

| # | Area | Requirement |
|---|---|---|
| R1 | Classification | Every nurse, facility and shift has an employment type. Shifts starting on or after January 1, 2026 at eligible facilities are 1099. |
| R2 | Classification | A nurse sees and works only one type of shift. |
| R3 | Consent | Existing nurses see a full-screen terms notice and must accept the new Terms of Use before applying, booking or clocking in on a contractor shift. New nurses accept at sign-up. |
| R4 | Pay | No withholding on contractor pay. Two flat per-shift insurance fees apply: occupational accident and medical malpractice. |
| R5 | Payouts | Contractors move to a new payout system and can cash out all approved pay. W-2 early cash-out stays partial. |
| R6 | Nurse app | Timecards becomes Earnings; "work state" becomes "license state"; overtime and the I-9 step are removed for contractors; the referral bonus drops its supplemental-wage tax note. |
| R7 | Facility apps | Contractor bill rate = nurse rate + platform fee. Payroll taxes, state picker, processing fee and overtime settings are removed. |
| R8 | Admin | Employment-type filters, contractor payouts and a record of who accepted the new terms. |
| R9 | Cutover | W-2 and 1099 timecards are supported side by side briefly, so December shifts pay out under W-2. |

## Key flows

### Accepting the new terms (R3, prototype)

```gherkin
Feature: Terms of Use gate for contractor shifts

  Scenario: Existing nurse opens the app after the switch
    Given I am an existing nurse who has not accepted the new Terms of Use
    When I open the app on or after January 1, 2026
    Then I see the full-screen terms notice

  Scenario: Nurse tries to apply before accepting
    Given I closed the terms notice without accepting
    When I apply to a contractor shift
    Then the terms notice opens again
    And my application is not sent until I accept

  Scenario: Nurse accepts the terms
    Given the terms notice is open
    When I check every required box and accept
    Then my acceptance is recorded
    And I can apply to, book and clock in on contractor shifts
```

### Seeing one type of shift (R1, R2)

```gherkin
Feature: One employment type per nurse

  Scenario: Contractor nurse browses shifts
    Given I am classified as a 1099 contractor
    When I view the shift list
    Then I only see 1099 shifts
    And I do not see the Overtime filter

  Scenario: Nurse in a state that stayed W-2
    Given I am classified as a W-2 employee
    When I view the shift list
    Then I only see W-2 shifts
```

### Cashing out early (R4, R5, prototype)

```gherkin
Feature: Early cash-out

  Scenario: Contractor cashes out
    Given I am a 1099 contractor with approved timecards
    When I open Earnings
    Then my available balance is all of my approved pay, less the two per-shift insurance fees

  Scenario: W-2 nurse cashes out
    Given I am a W-2 employee with approved timecards
    When I open Timecards
    Then my available balance is only part of my approved gross pay
```

### Pricing a shift as a facility (R7, prototype)

```gherkin
Feature: Facility bill rate

  Scenario: Facility prices a contractor shift
    Given my facility is on the 1099 model
    When I enter a nurse hourly rate
    Then the bill rate is the nurse rate plus the platform fee
    And no payroll taxes or processing fee are added

  Scenario: Same nurse rate costs less under 1099
    Given the same nurse hourly rate
    Then the 1099 bill rate is lower than the W-2 bill rate
```
