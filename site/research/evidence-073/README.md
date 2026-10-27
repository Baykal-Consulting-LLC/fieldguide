# Frozen evidence benchmark 0.73

Research only. Run `node scripts/benchmark-evidence-073.mjs` from the site root. The normal build also runs it after 0.71. It asserts unchanged frozen profiles and exact reproduction of previous support before comparing binding-only, wired-prior-response and newly targeted-question stages. Full results are in results.json.gz; summary.json omits per-model rows.

The first replay's freeze and script are retained as freeze-001-original.json and benchmark-original.mjs.txt. reporting-amendment.json records a caption-only correction from eleven to ten binding rules, with no rule, targeting policy, answer or outcome changes. freeze-001.json contains the identical rules and profiles with corrected caption/script hashes.

See docs/evidence-073-2026-10-21.md for all cohort totals, attribution, inspection of every new claim, broad-interest disagreement and limitations. Unit fixtures cover seven previously ignored answer types, unknowns, No/Unsure/holds, scoped technical safety, curriculum/coaching separation, unique source roots, concrete-context bindings and answer-blind four-question targeting. Results tests reconcile every cohort and stage, preservation and dashboard projections.

Positive simulated responses reuse exact frozen facts, not new observations. All holdouts were inspected previously and remain diagnostic. No real student outcome validation or live-flow adoption is claimed.
