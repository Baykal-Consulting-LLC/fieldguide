# Approach 3: shortlist and follow-up experiment

This directory contains an isolated paired study. Neither Approach 1 nor Approach 2 is edited or published by these scripts. Input modules and public synthetic profiles are imported read-only. All generated results belong here.

`protocol.json` froze one candidate selector and the input hashes before the first replay. There was no outcome-based parameter search. `selector.mjs` receives observed answers, current evidence, career correlations, bank structure and prior development-only simulator availability. It receives no profile facts, cohort labels, earnings or future answers.

Both arms start from the frozen lifestyle assumptions and official 60 answers in `journeys-104.json.gz`. They discard every earlier field/profession/facet response. The unchanged structured simulator supplies each response only after selection. Unknowns count toward the maximum of 24 follow-up items.

The current arm is replayed, not copied from saved outcomes. Every model must reproduce the saved current-control question sequence and supported-career order exactly. Both arms are checked against canonical matching at question-count checkpoints.

Run from `site/`, with four independent workers:

```sh
A3_SHARDS=4 A3_SHARD=0 node ../outputs/a3-shortlist-study-2026-10-24/run.mjs
A3_SHARDS=4 A3_SHARD=1 node ../outputs/a3-shortlist-study-2026-10-24/run.mjs
A3_SHARDS=4 A3_SHARD=2 node ../outputs/a3-shortlist-study-2026-10-24/run.mjs
A3_SHARDS=4 A3_SHARD=3 node ../outputs/a3-shortlist-study-2026-10-24/run.mjs
```

Then, from the parent workspace:

```sh
python3 outputs/a3-shortlist-study-2026-10-24/summarize.py
```

Each `shard-N.json.gz` contains full paired traces and final career inventories for 500 public models. `summary.json` includes separate cohort/split metrics, student-level changes, every lost college career, ranking-only moves and lower-broad-alignment confirmed college connections retained by the display guard.

The shortlist screen is a display/review hypothesis: retain all confirmed careers; prioritize unconfirmed careers with some positive observed field/profession evidence, correlation at least 0.608 and no contrary answer. The broader pool remains browsable. It does not confer career support, and its threshold is not validated as a probability or quality cutoff.

Student wording in the report is **Strong match**, **Worth exploring**, and **Browse more careers**. Internal historical fields keep their original names so the audit remains reproducible.

The first 1,000 include 758 development profiles and three separately reported holdout splits of 30, 12 and 200. The Grok 1,000 remain a separately reported evaluation cohort. All have previously been inspected; none should be described as pristine unseen validation. These are synthetic response simulations, not measured student outcomes.
