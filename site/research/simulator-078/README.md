# Structured simulator repair 0.78

Research only. The production student flow, matcher 0.63, catalog, earnings, education taxonomy, official interest answers, context and per-profile question exposure are unchanged. Original and Grok-authored populations each contain 1,000 public synthetic profiles. Original development (758), original holdout (30), earlier fresh holdout (12), and expansion holdout (200) remain separate. Historical holdouts have already been inspected; none of this establishes real student usefulness or population accuracy.

## Blinded review

A fixed diagnostic sample contains 192 profiles and 384 disagreements (two per profile). A fresh Grok 4.7 CLI session saw each anonymized profile, the actual multiple-choice question/options, and independently shuffled A/B answer labels. Executor identities, career outcomes, match scores and prior review notes were withheld. The reviewer is the same provider as one executor; this is executor-label-blinded AI review, not independent human validation. The sample is stratified among changed-result profiles, not representative accuracy sampling.

All accepted judgments have mechanically verified profile quotations and JSON pointers. Citation schema hardening retained the first two valid batches and did not change judgment criteria, sample, A/B mapping or frozen profile facts. Format/quotation failures and interrupted in-flight calls were excluded; valid results were never retried based on their preferred executor. Raw CLI hidden reasoning remains outside publication. See `calibration/simulator-078/citation-format-amendment.json`, review protocol/seal, and `blinded-review.json`.

Only the first available 82 development judgments from 41 profiles informed authoring. All remaining development and evaluation judgments stayed uninspected through the final correction freeze. Later judgments include both/neither/unresolved, unchanged narrative concerns and repaired answers that differ from both reviewed A/B options; a third answer is explicitly unreviewed.

## Repairs and preserved first pass

64 exact profession-question and 100 exact activity-option bindings use typed frozen feature IDs. They repair whole-career conjunctions imposed on individual questions, contained activity methods, literal alternatives and omitted subject requirements. They also stop general health, safety, customer-help and sound-recording interests from automatically establishing dental treatment, dangerous rescue, property/insurance advice or composition/finished-work responsibility. No biography or prompt substring classifier is used, and no profile is enriched with missing specialty preferences.

The first rules froze in `calibration/simulator-078/rule-freeze.json`. After preliminary outcome totals were inspected, an exact-question scope audit found that the plant-method and supplier-comparison repairs introduced an extra generic precision prerequisite. `bindings-002.mjs` removes that extra requirement while preserving explicit negative/detail conflicts as unknown. The second freeze documents this post-outcome calibration. No evaluation review judgments informed it. Both passes and their hashes remain available; do not describe the final totals as pristine holdout validation.

| Cohort | Existing Top | Final Top | Existing bachelor/graduate Top | Final bachelor/graduate Top |
|---|---:|---:|---:|---:|
| Original all | 789 | 880 | 653 | 778 |
| Original development | 594 | 661 | 490 | 584 |
| Original holdout | 26 | 26 | 21 | 21 |
| Earlier fresh holdout | 11 | 11 | 11 | 11 |
| Expansion holdout | 158 | 182 | 131 | 162 |
| Grok-authored | 674 | 746 | 548 | 624 |

The 172 narrative profiles retain their authored answers. The 1,828 typed profiles can receive scoped repairs. Unchanged bindings and authored answers are not thereby independently validated. Counts reflect current matching-rule acceptance of simulated answers, not observed student confirmation. Original Top coverage gains 99 profiles and loses 8; Grok gains 102 and loses 30. Unsupported specialist transfers and explicit conflicts can withdraw a former claim. Degree losses also include Top-three ranking displacement; supported alternatives remain inspectable.

Broad and specific interest evidence can disagree. Original profiles with a negative broad-interest correlation in Top increase from 141 to 182; Grok from 11 to 26. The dashboard/chart flag these for review rather than claiming every increase is good. A negative Pearson value alone does not establish a poor fit; direct activity evidence and broad-pattern disagreement need interpretation before any production adoption.

## Reproduction and transport

- `scripts/simulator-078/prepare-blind.py` freezes the anonymous sample. Its map is never sent to the reviewer.
- `run-blind.py` executes the citation-validated review; `seal-review.py` verifies every accepted prompt, returned JSON, profile quote, model/call receipt and sample key.
- `freeze.mjs` preserves the pre-outcome first rules and available development judgments. Both freeze files are immutable; do not silently regenerate them.
- `replay.mjs` and `replay-002.mjs` replay all 2,000 models against the identical current matcher. Every original before-offer field reproduces executor 0.77 exactly. Every frozen baseline state remains untouched.
- `unblind.py` verifies final freeze hashes before revealing all 384 judgments.
- `publish.mjs --first-pass` and `publish.mjs` generate complete, lossless public case pools and a repeated-string dictionary. Every career category, numeric score, earnings object, unknown, question change and education route is checked against the canonical result.
- `archive-first-pass.mjs` stores the complete first pass as a lossless delta against the final dataset. `restore-first-pass.mjs` reconstructs and verifies its exact original JSON. The browser offers this same verified download.
- Canonical result files live outside source publication in `../outputs/simulator-078/` and `../outputs/simulator-078-002/`. Their hashes are in the publication receipts. The public full encoded dataset plus first-pass delta retain every corresponding field. `dist/simulator-codec-078.js` is transport only, with no scoring behavior.
- `scripts/performance-simulator-078.mjs` projects normalized IDs and source-backed metrics into the existing Data App. Career titles are joined from the existing career query. The live/current headline totals remain separate from this research benchmark.

The baseline 0.77 state intermediates remain locally retained/ignored for the source repository's receive-pack budget; see `../executor-077/REPRODUCIBILITY.md`. On a fresh checkout, regenerate and verify those frozen inputs before replay, or inspect the complete public datasets. Do not substitute a different current-state population.

Focused validation covers exact frozen hashes, all 2,000 cases/categories, original exposure, facts supporting added Yes answers, absence preservation, direct conflicts, narratives, unchanged correlations/earnings, cohort totals, list caps, education definitions, all blinded judgments, dashboard reconciliation and exact first-pass restoration. Browser-render and interaction QA were unavailable in this session; compilation/data checks do not replace them.
