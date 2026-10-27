# Program performance dashboard

Audience: Fieldguide product owner deciding what to improve next.

Private authoring plan: the opening compares supported Top coverage, bachelor/graduate Top coverage and first-paid-stage lifestyle coverage using one selectable metric plus paired discovery comparison, followed by all four development/holdout populations together and an inspectable model map. The opportunities view shows all five education routes, field/career distributions, occupational earnings and exact career/model drilldowns. The improvement view distinguishes evidence specificity, pay/source availability and simulator coverage; presents Must/Should/Could work with explicit scope and measurable acceptance criteria. Real student validity is unavailable and is never replaced by software assertions or synthetic coverage. No historical trend is invented; all evidence is a single paired frozen snapshot.

Sources: current-cohort-data.json, paired onet-benchmark/report.json.gz, match-frequency-data.json, question-bindings.json. Build projection scripts/build-performance-snapshot.mjs verifies shared run IDs, exact public population, normalized bachelor/graduate route taxonomy and current totals. Source/copy/export actions retain filtered raw rows in the shared Data App runtime. Product-tracker reference supplied linked metric selection and model inspection; unrelated adoption/retention/fixture content was removed. Compact source dataset only: no copy of the 457-by-1000 score matrix.

Education taxonomy: benchmark normalized routes produce 618 current bachelor/graduate Top models, versus the old chart's degree flag of 628 (some associate/program routes). The dashboard uses the same normalized taxonomy for both approaches. All five routes are retained, and route counts overlap. 377 of 429 comparable occupations have a bachelor/graduate route, so degree discovery coverage is partly inventory composition.

Development: 758 profiles. Holdouts: 30 original, 12 fresh, 200 expanded. Never tune a rule against holdout flags; historical outcome inspection means these are fixed evaluation splits rather than pristine final validation. All 1,000 are designed fictional cases; 12 diagnostics and 6 private cases are excluded.

Rebuild: npm run build regenerates current sources, creates the dashboard snapshot, builds its unchanged protected shared runtime, and copies the verified split output into dist/developer/performance/. Source engine and simulated answers are unchanged. Tests validate aggregation, education overlap, null-pay partition, matched sources and population separation.

Hosting integration: the shared runtime reads /api/snapshot and /api/presentation on chatgpt.site. The static site build materializes read-only JSON files at those exact paths from the verified public snapshot; presentation writes remain unavailable. No protected Data App runtime code or student routes are modified.
