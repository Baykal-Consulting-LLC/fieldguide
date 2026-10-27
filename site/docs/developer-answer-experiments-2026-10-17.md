# Editable developer student experiments

Release 0.28.0. Uses matching engine 3.2.0; no matching thresholds or assessment content changed.

## Using it

Open an Expanded view in Developer and select Edit answers. Change lifestyle choices, any of the 113 profile responses, and the current field's profession follow-ups. Choose Rerun matching to update the plain lists and the Original → rerun comparison. A second Rerun button stays in the scrolling section navigation.

The comparison shows all six scores, supported and work-interest pathways, career additions/removals, plan career, gross pay, monthly spending, and changed answers. Detailed results retain preference conflicts, task evidence, education, salary stages, the Austin budget, and next steps.

Switching fields exposes that field's own follow-ups. Unanswered questions are not silently filled; other fields' edited answers remain available when switching back. Not sure explicitly records an empty selection. Work values allow up to three choices.

Plan preview defaults to adapting the original plan. Unchanged matching inputs retain the case's explicit original choice, including originally explored careers outside recommendations. When matching inputs change, the original career stays only if it is still suggested; otherwise the first supported career may be previewed. If no career is supported or follow-ups are incomplete, there is no automatic new plan. The operator may explicitly keep the original career, select another career, or request no plan. Manual previews stay clearly labeled as explicit choices, never as recommendations.

Pay stage and housing tenure can also be adjusted. New career plans use the corresponding preparation and first paid training/entry stage; existing completed work and notes remain in the plan preview.

## Isolation and exports

The browser receives an embedded copy of the authored fictional case. It does not read or write the active student draft, saved guides, browser storage, or published calibration expectations. Edits live in memory and reset on reload. Reset to original restores both questions and results. Download experiment exports the original and edited states, both result sets, engine version, settings, and timestamp as JSON. The separate plain-text link always downloads the original case.

Changed answers mark prior results as outdated and disable experiment export and printing until rerun. Answer summaries and selected-option markers update together, including after editors are hidden or reset.

## Verification

All 360 regression tests passed.

Automated checks replay all 54 calibration cases and all three walkthroughs, compare exact totals and results, test one-question score changes, lifestyle-only effects, a design-to-medicine switch, preserved notes, flat/missing answers, incomplete field follow-ups, conflicting clinical preparation, explicit unsupported-career previews, pay-stage changes, input validation, escaped output, and original-state immutability. Source checks prohibit storage and network operations in the experiment modules.

Browser checks exercise editing, rerunning from the sticky button, an expensive-home budget change, contradictory physician/NP preferences with no forced plan, switching to unanswered trades follow-ups, downloading the resulting JSON, hiding editors, selected-choice markers, and resetting to original. All tests use authored fictional cases; this is software verification, not psychometric validation with real students.
