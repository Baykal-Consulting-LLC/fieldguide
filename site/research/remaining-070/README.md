# Remaining match audit

This is a read-only review of the frozen 0.69 benchmark, not a new matching arm.

Run `node scripts/review-remaining-070.mjs` from the Site repository, followed by `python3 research/remaining-070/analyze.py`. The first command reconstructs the 317 target states, checks their frozen hashes and complete supported-career membership/order, and audits degree gates plus non-degree gates for the 188 without any Top. The second produces mutually exclusive review queues, the full findings, a 317-row CSV and a self-contained interactive HTML lookup under `outputs/`.

`audit.json.gz` retains all anchored model-career pairs, existing answers, missing/negative binding features, source references, holds and task contexts. `review.json` is a bounded display projection. It is not a match list. The 0.68 typed alternatives, 0.69 alternatives, nested AND-of-OR groups and the existing production quality alias are preserved.

The executed `outputs/remaining-match-review.ipynb` independently reconciles model counts and separate cohorts from the audit. `review.md` distinguishes systematic gate inspection from selected human-reviewed examples and lists primary occupational sources. Proposed question drafts are unvalidated and received no simulated answers. No profile, answer, matching rule, live-flow file or frozen result changed.
