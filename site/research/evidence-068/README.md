# Evidence rules full-cohort benchmark

Run `node scripts/benchmark-evidence-068.mjs` after the current production replay exists. The evaluator freezes its policy, shared 0.67 rules, old source annotations, engine files and 1,000 original state/profile hashes before outcomes. A rerun must match that freeze.

This comparison starts at production 0.63. It does not apply the per-question manual answers from experiment 0.66. All 1,000 models are actually rescored, including all three separate holdout groups. Diagnostics and owner-only records are excluded. Baseline Top IDs and all supported IDs must match the generated current chart before the new rules are applied.

The new rules stay under prototypes/. Only the developer chart and dashboard consume the research result. No new student question, production answer, threshold, salary, degree incentive or matching rule is activated. `scripts/build-developer.mjs` reruns this benchmark before building the dashboard, and a baseline-run mismatch blocks the comparison.

`results.json.gz` contains every paired Top list, every supported alternative, education routes, unchanged budget/pay assumptions, typed source ledger, retained answer, new decision and unresolved rule check. `summary.json` and `evaluation.md` describe the result. Interpretation is narrow: four profession rules, 92 profiles with relevant encoded facts, and no measured student outcomes. The holdouts have been inspected previously.

The earlier 0.64–0.67 experiments remain archived, including their exact then-current publication metadata hashes. The current benchmark validates the production replay by semantic run ID and exact per-model support membership, so refreshing publication timestamps does not invalidate this comparison.
