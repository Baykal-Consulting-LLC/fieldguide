# O*NET-led benchmark, 20 October 2026

Decision: evaluate broader interest-led discovery before changing live student matching. The frozen policy was written before the benchmark outcomes. No student matching rules, original profiles, answer bindings or holdout assignments are changed.

## Paired comparison

- Same 1,000 public base profiles; 12 diagnostic variants and six owner-only cases excluded.
- Current Top: exact lists from the current replay, fingerprint recorded in policy.json. Up to three specifically supported careers.
- Candidate: six original official Interest Profiler totals, Pearson whole-profile similarity, existing occupation vectors, published Best/Great/Good cutoffs and Job Zone selection. All Best/Great connections are retained; nonnegative Good results fill toward ten per zone. No income or degree preference supplies interest fit.
- Primary comparison retains the current near-flat guard to isolate the rule change. A separate complete-nonflat sensitivity relaxes only that guard.
- Current Other invitations and all specifically supported careers remain available in the per-model comparison. Combined coverage preserves current Top while adding statistical exploration; it does not convert exploration to confirmed Top.
- Source: O*NET Interest Profiler Manual, Chapter 7, printed pages 128–130, https://www.onetcenter.org/dl_files/IP_Manual.pdf.

## Important limits

The current catalog contains 457 careers, 429 with usable interest vectors/Job Zones. It is degree-heavy: more degree opportunities can raise any-degree coverage without establishing a stronger degree preference or better fit. Both sides use the same inventory. This reproduces the published selection process within that catalog; it is not the full official service queried for 1,000 users. The comparison notebook uses an independently written sums-of-products Pearson formula and independently reconstructs selection. Every computable correlation and every returned-set membership is checked.

The current chart's broad degree flag differs from the five-route taxonomy: it includes some associate routes and misses one doctoral profile. The benchmark uses the same catalog bachelor/graduate grouping on both sides; the unchanged live-chart count is disclosed separately. Some specialty education labels are broader BLS SOC mappings rather than verified specialist licensing requirements. This benchmark does not correct or endorse those source classifications.

Existing first-paid-stage/proxy figures and budget rules are reused unchanged. Additional occupational median and worker-group mean wages come from the already retained 2025 TWC API data, Austin with explicit statewide fallback. Means of the lowest-paid third and upper-paid two-thirds are not first-job wages or years-of-experience observations. Broader SOC specialty wages are flagged. Missing wages remain unavailable; occupational medians never establish lifestyle coverage.

Holdout groups remain separate: original 30, fresh 12 and expanded 200. Previous aggregate results have already been seen, so these are fixed-split checks rather than pristine final validation. No thresholds are tuned on the benchmark. The 828 expanded models use shared procedural answer assumptions and are not a representative sample of students.

## Interpretation and review

Greater statistical coverage does not establish better confirmed profession fit. Specific contrary answers are preserved as independent flags. The six purposively selected original development cases in development-review.json illustrate unresolved arts/social-to-therapy and explanation-to-college-teaching specificity. These are qualitative spot checks, not independent accuracy estimates; they did not change the frozen rules. No new holdout case review or calibration is performed.

The evidence favors benchmarking a hybrid: broad interest invitations plus retained specific evidence and explicit disagreements. It does not justify automatically replacing every current Top with a high six-score correlation, or boosting college professions to reach a target rate.

## Reproduce

1. Run `npm run build` from the source checkout. The benchmark is regenerated after the unchanged current chart replay; its recorded run ID and input fingerprints must match.
2. Run `node --test tests/onet-benchmark-057.test.js` and `python3 research/onet-benchmark-057/verify.py`.
3. Open `dist/developer/onet-benchmark.html` through the development server, or the published Developer benchmark. All five education routes, cohort filters, career frequency counts, earnings sources, per-model current/interest comparisons and CSV exports are available.
4. Download `reproduce.ipynb` and use the page's browser data-export button to obtain `reproduction.json.gz`. Put them together and run offline with the Python standard library. The browser export reuses the same report/chunks and avoids direct automated downloads, which the hosting service blocks. Source-checkout users can use the retained full offline dataset.
