# Graphic design → medicine: saved-plan walkthrough

Tested October 16, 2026 with a fictional student on an isolated localhost browser draft. The real production draft was not edited. Release 0.15.1.

## Student journey

1. Reopened the existing graphic-design plan, with 30 original mixed-interest answers and two completed exploration activities. Marked the portfolio activity complete, added a target date and a reflection about wanting to explore patient care.
2. Exported a full baseline backup. Chose health → medicine/dentistry/nutrition → physician tasks → family medicine.
3. Checked college + MD/DO + paid residency and the common roughly 11-year route after high school. Dell Med's one-year resident tuition/required-fee reference remains separate from undergraduate costs and living costs.
4. Chose the published first-year resident pay example and created a medical plan. Later practice pay was previewed and explicitly adopted separately.
5. Switched back to graphic design and returned to medicine. Confirmed that each saved career restored its focus, salary context, education, and own steps without duplicates.
6. Reloaded, exported My Plan and the full draft, restored the final medicine backup through the actual UI, and inspected the earlier completed design step and note.

## Financial checks

The same chosen Austin spending basket was held constant at $3,843.07/month. It includes savings, an individual rental, and a financed used car. These are scenario assumptions, not promises about housing or purchases. No student-loan payment was entered in this browser case, and the report explicitly says so.

| Scenario | Gross used internally | Rounded headline | Estimated monthly take-home | Monthly room after chosen spending |
|---|---:|---:|---:|---:|
| Graphic-design entry proxy | $46,122 | $46K | $2,749 | −$1,094 |
| Dell Med first-year resident example | $69,528 | $70K | $4,179 | $336 |
| Qualified family-medicine entry proxy | $185,725 | $190K | $10,333 | $6,490 |

Rounding affects display only. Practice pay begins after residency. Salary/lifestyle previews do not adopt an income until requested. Starting wages use the existing TWC lower-paid-third proxy; later milestones remain illustrations. Published employer training pay is a separate evidence category. Source amounts and requirements were not changed by this release; prior source review remains applicable.

Automated scenarios additionally preserve entered debt and needs, reject stale manual take-home on a changed career/stage, cap retirement to the model's limit, and retain a same-context manual override on reopening. A large illustrative debt payment correctly reduces affordability rather than disappearing during the switch.

## Fixes

- A new physician plan starts at residency, not qualified practice pay. Paid apprenticeships likewise use their explicitly identified first training stage.
- Changed salary context recalculates take-home. Spending, debt, savings choices, and budget notes remain.
- Earlier field, area, and task choices are retained across career-mode navigation, tree navigation, and task changes, as well as exploration mode.
- Saved career focuses survive full-draft restore. Returning to a saved main option restores its own interest/task context. Original questionnaire responses are never rewritten.
- Previous career steps are grouped by career under “Earlier career steps & other saved work.” Only current-career steps appear as its new actions.
- A design education budget is retained under other saved education budgets unless explicitly linked to the new career. It is not presented as a medical-school estimate. Program and period remain visible.
- My Plan export includes the explicitly selected salary stage, annual gross, and evidence basis even when private budgets are excluded.
- A read-only before/after example is available at `#/student-examples/career-switch`, linked from the earlier transition example.

## Evidence and limits

- `validation/career-switch-browser-2026-10-16.json`: compared real browser exports; original questionnaire and six earlier actions match exactly. The existing 1,620-character note remains intact.
- `tests/career-switch.test.js`: focused regressions including switching back, alternative/preview non-mutation, budget attribution, full-draft restoration, privacy opt-in, malformed focus history, and explicit role-specific financial context.
- Full suite: 221 tests; syntax checks passed.

These checks establish application behavior and consistency with the existing financial model. They do not validate predictive career matching, medical-school admission chances, or future income.
