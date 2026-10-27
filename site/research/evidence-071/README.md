# Evidence repairs and targeted follow-ups · 0.71

Research-only replay of the same 1,000 public profiles. Production matching stays at 0.63; 0.69 is the preceding research comparator. The freeze manifest records source/input hashes and question-selection plans before outcomes. No outcome-based rule tuning followed the replay.

| Models with outcome | Live | Prior research 0.69 | Proposed 0.71 |
|---|---:|---:|---:|
| Supported Top |789|812|818|
| Bachelor/graduate Top |653|683|691|
| Graduate Top |120|152|158|
| Top covers lifestyle |236|250|258|
| Supported degree anywhere |—|748|758|

Bachelor/graduate means canonical college or graduate route; associate-only routes are excluded. Each model is counted once per outcome. Top remains capped at three using the existing correlation/evidence ordering, with no education or pay boost. There are 67 models with a supported degree option outside Top three; these are displayed separately and never counted as extra Top matches.

## What changed

16 question-to-evidence binding repairs reuse saved structured choices. 24 neutral activity items cover 12 legacy careers, two specialist context checks cover optometry/farm-animal research, and seven narrow evidence items distinguish unresolved responsibilities and contexts. The selector offers at most four new items using existing evidence and unresolved checks, without education, earnings, identity or cohort targeting. New items are authored hypotheses, not independently validated scales.

320 existing-answer mapping gaps were filled. 545 models received 992 new items: 320 grounded positive responses and 672 unfamiliar responses. Missing interests were kept unknown. One exact existing motion/experiment fact was encoded from original source fields with quote equality checks; original profiles and answers were not edited. There are no text/word-matching shortcuts.

Legacy professions still require both defining interests and two distinct activity domains; expanded professions retain three defining domains. General health does not establish vision-examination interest; animal care does not establish farm-animal nutrition, breeding or production research. These specialist guards are included in the proposed outcome, and previous answer records are retained.

## Tradeoffs and fixed cohorts

113 additional career claims qualify, while 44 prior claims across 44 models move to specialist confirmation. Compared with 0.69, nine models gain Top coverage and three lose it; 14 gain degree Top and six lose it. These are not a no-regression result. Among degree Top losses, some are ranking displacements rather than loss of every supported degree alternative; inspect model-level evidence in the chart.

| Fixed cohort | N | Top 0.69→0.71 | Degree Top | Graduate Top | Degree anywhere |
|---|---:|---:|---:|---:|---:|
| Development |758|611→614|512→516|107→112|564→570|
| Original holdout |30|26→27|21→22|4→6|21→22|
| Fresh holdout |12|11→11|11→11|4→5|11→11|
| Expanded holdout |200|164→166|139→142|37→35|152→155|

All holdouts remain separate. They have already been inspected and are diagnostic, not pristine validation. These synthetic cases are designed coverage probes, not a representative student sample or observed student outcomes. Gains do not establish the validity of the newly authored items or of every supported career claim. Independent human review and real student response validation remain necessary before production adoption.

## Reproduce and inspect

- `node scripts/benchmark-evidence-071.mjs` replays the frozen evidence rules.
- `node --test tests/evidence-071-rules.test.js tests/evidence-071-results.test.js` checks rule counterexamples, unknowns, caps, specialist guards, known answer preservation, counts and dashboard reconciliation.
- `results.json.gz` retains every question, selected answer, source reference, unresolved fact, prior/proposed supported option, reclassification, route and per-model earnings/budget comparison.
- `summary.json` contains separate cohort summaries and checks.
- `freeze-001.json` records the pre-outcome freeze.

Live weights, student question banks, source profiles, wage data and budgets remain unchanged. All 29,107 known answer records and 89 held records checked unchanged. The dashboard and chart expose current live results separately from the proposed research replay.

## Coverage losses to inspect

- **Charlie Bennett (scale056-0031; development)**: Pharmacy Technicians; Optometrists; Farmworkers & Laborers, Crop, Nursery, & Greenhouse → Pharmacy Technicians; Farmworkers & Laborers, Crop, Nursery, & Greenhouse; Landscaping & Groundskeeping Workers. Needs confirmation: Optometrists. Further supported degree alternatives: Social science research assistants.
- **Cameron Jones (scale056-0307; development)**: Animal Scientists → No supported Top. Needs confirmation: Animal Scientists. 
- **Alexis Reed (scale056-0576; holdout056)**: Hairdressers, Hairstylists, & Cosmetologists; Optometrists; Cooks, Restaurant → Hairdressers, Hairstylists, & Cosmetologists; Cooks, Restaurant; Carpenters. Needs confirmation: Optometrists. 
- **Cameron Singh (scale056-0595; development)**: Animal Scientists → No supported Top. Needs confirmation: Animal Scientists. 
- **Blair Singh (scale056-0603; development)**: Paralegals and Legal Assistants; Optometrists → Paralegals and Legal Assistants. Needs confirmation: Optometrists. 
- **Jamie Walker (scale056-0731; development)**: Animal Scientists → No supported Top. Needs confirmation: Animal Scientists. 
