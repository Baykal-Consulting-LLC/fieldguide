# Fresh-start unknown-answer audit · 0.96

Research only. The live questionnaire, official 60-item profiler, matching thresholds,
career inventory, education taxonomy and sibling application are unchanged.

## Inputs and comparisons

- Frozen 2,000 public model states: `research/executor-077/states.json.gz`.
- Unchanged typed preferences: `calibration/cohort-056/profiles.json` and
  `calibration/grok-075/profiles.json`. No prose classification or new profile facts.
- Exact prior fresh-start arm: `research/evidence-095/results.json.gz`.
- Every repaired run starts from `freshState`, retaining only lifestyle/finance and
  official profiler responses. All prior field, profession and history answers are withheld.
- Budgets: 0, 4, 8, 12, 16, 24, 36 and 60 additional question items. Unknowns cost one item.
- Canonical matching parity is checked at every repaired checkpoint (16,000 total).
- Original and fresh holdouts without typed facts are not evaluable; development,
  expansion holdout and Grok cohort remain separately reported. Earlier holdout
  results have been inspected, so this is not unseen prospective validation.

The same-question audit reanswers exactly the first up to 24 questions selected in
0.95. It separates dispatch repairs from changed question order in the new replay.
Reasons are exclusive: absent typed profile, review hold, absent binding, explicit
conflict, or unmeasured preference. Missing individual options are not counted as
separate answered question items.

## Reviewed repairs

`prototypes/evidence-096/answer.mjs` reconnects only reviewed catalog question IDs,
with an exact prompt and career-scope check. Existing valid answers and review holds
remain unchanged. Predicates cite actual structured preferences; no demographics,
education preference, salary, narrative wording or desired result grants a Yes.
The catalog predicates remain required, with reviewed specialty and responsibility
safeguards where a generic activity does not establish the question's purpose.
These are authored simulator assumptions, not new psychometrically validated scales.

A first replay is retained as `initial-results.json.gz`, `initial-summary.json` and
`initial-unknown-audit.json`. Subsequent sanity review found two overly broad positive
mappings: explicit opposition to explanation must not confirm a financial-recommendation
explanation question; explicit opposition to detailed checks must not confirm reliable
machinery maintenance. The final replay incorporates these conflict holds. Clinical
mental-health mapping separates actual clinical treatment interest from ordinary emotional
support and requires ongoing-care/safety responsibility where the question asks for it.

## Reproduce

From this checkout, preserving its own shared-foundation pin:

```sh
python3 scripts/shared-foundation.py run -- node scripts/prepare-evidence-096.mjs
npm run build
```

`prepare` reuses results only when the exact input/source fingerprint matches;
otherwise it reruns all models. The new public payload is a lossless patch over the
immutable 0.95 public directory, with matching directory hashes and append-only career
indices. Tests reconstruct every model and checkpoint. Historical numerical results
remain intact; identical repeated snapshot provenance is stored once with explicit
references from its duplicate query entries.

For the corrected replay, an unchanged question order can be reused only when the
common-input fingerprint matches and every observed answer's response, selections,
evidence references, missing-binding flag and review hold are unchanged. Every payload
is still recomputed from frozen facts and every model starts fresh; every published
prefix is rescored and checked against the canonical engine. Any changed answer triggers
a complete adaptive rerun from zero. Up to fourteen unchanged traces are also cross-checked
against complete adaptive replays. No accumulated state or cached matching decision is
used to generate an offer.
