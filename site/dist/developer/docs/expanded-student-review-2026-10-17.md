# Expanded student review

Release 0.26.0. Matching engine 3.2.0 is unchanged.

## Access

Developer → Expanded student views opens a plain index of 54 calibration students and three guided walkthroughs. Each calibration card and walkthrough has its own Expanded view link. The view lists lifestyle choices, all 113 profile questions, all follow-ups asked for the selected field, six interest scores, all field comparisons, refined careers and their reasons, and the final plan or explicit absence of a plan.

Show all answer options reveals the available choices and marks every selected option. Section links stay visible while scrolling. Plain-text downloads include all questions, selected responses, available choices, intermediate comparisons and final-plan text. Print/save PDF expands detail sections for printing.

## Data provenance

Calibration generation captures the actual scripted state before creating the example plan. It does not infer answers from a desired career. The reports include shared lifestyle, experience, values and context defaults inherited by the authored fixtures; those shared defaults are explicitly labeled. They are not independent observations of students.

Final plans distinguish explicit scenario career choices from choices made by the test harness to exercise plan creation. Undecided cases do not receive a fabricated career plan. Earlier completed steps and notes are included.

## Validation

All 339 regression tests passed. New checks independently reconcile official question text and selected response labels with stored inputs, sum all six raw scores, reconcile every field preference and multi-select follow-up, verify actual salary and selected career against the original plan snapshot, check missing-plan cases and saved notes, reject broken template fragments, and verify navigation and downloadable files across all expanded pages. Browser checks sampled the summary-to-expanded link, answer-option toggle, intermediate-results jump, final plan, and full-plan text.

## Regeneration

Run `npm run review:students` to refresh the scenario data, independent correlation checks, summary cards, expanded pages, downloads, and Developer index. The expanded view does not change scoring, matching thresholds or student browser storage.
