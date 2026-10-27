# Simplified guide · 0.8.1

October 16, 2026

Home offers one full guided assessment and five short entries: Lifestyle Expectations, Career Paths With College, Career Paths Without College, Careers, and Income Expectations. Persistent navigation contains only Start and My Plan. Earlier catalog/report routes remain readable resources, while legacy exploration routes lead into the new guide.

## One destination

The journey includes five reflection sections, optional provider-results entry, original-scale checks, and saved answers. The former reasoning quizzes are excluded; old quiz entries remain only as legacy draft data. Shortcuts begin at a lifestyle picture, income goal, or broad work family. All join the same sequence: interests → areas → career → preparation → salary lifestyle → three next steps → My Plan. Students can combine up to three interests and areas. Screens that would repeat a sole option are skipped. The hierarchy covers all 65 reviewed occupations. College and training entries filter the catalog; they do not change interest or ability interpretation.

One plan holds a primary career and two alternatives, preparation, education budget references or saved budgets, salary stages, Austin budget, and editable next steps. Previous careers, actions, financial plans, and assessment answers are preserved. Custom income survives revisiting the guide. Drafts stay browser-local. Export excludes personal budgets unless selected; full-draft backups retain all entries.

## Salary presentation

Entry-level pay is the headline. Four tiles show entry, 5, 10, and 20 years. Display rounding is nearest $1K under $50K, $5K below $100K, and $10K at or above $100K. Calculations retain raw amounts. Years begin with the first qualified job, after preparation.

64 careers use explicitly labeled planning estimates anchored to local occupation pay and editorial occupation-family factors. They are not observed earnings by experience. Teaching uses an Austin ISD new-hire schedule example. Quartiles are source distribution detail, never experience-year labels. See [the salary methodology](salary-progression.md). Austin remains the main geography; the psychiatric-aide exact-occupation fallback uses Dallas and discloses it.

## Presentation

Large cards, short sentences, 16px minimum visible text, and expandable detail replace dense entry screens. Non-degree routes display “College can be a major plus.” Costs remain published institution benchmarks until a personal program budget is entered; grants reduce price, loans fund it. Lifestyle presets assume one adult without children and are editable. Deficits remain visible.

## Verification

Unit tests cover all six entries, reachability, all 65 × 4 salary/budget combinations, rounding boundaries, migration, custom income, model separation, exports, and idempotent actions. Browser QA completed the five-section journey and all six starting flows to My Plan; verified reload, custom pay, and download. Fourteen screens were checked at 390px with no horizontal overflow or visible text below 16px. See [browser QA](../validation/simplified-guide-browser-qa.json) and existing calibration results. These are implementation checks, not a psychometric validation of original reflection questions or empirical validation of modeled salary growth.

The current release adds direct lifestyle links for every salary stage, non-mutating previews, experience selection buttons, five-tick confidence sliders, and single-level prompts. See [the student flow review](student-flow-review.md) for the latest verification.
