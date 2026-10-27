# Reporting alignment 0.61

This is a reporting change. The frozen profiles, matching engine, structured-answer policy, Top evidence requirements, budgets and Top order are unchanged. The current cohort run remains `e37edc53f50f37e1d316ab467e9051c1480e95eaa9c3a9dcb95d68c7608933a0`.

## Shared definitions

`analytics/performance/src/content/shared/system-match-metrics.js` is canonical and copied byte-for-byte to `dist/system-match-metrics.js` before chart bundling. Both reporting surfaces use catalog `educationRoutesFor` routes. A bachelor/graduate match has at least one college or graduate route; associate/specialist programs are separate. Routes can overlap and are not verified minimum entry requirements.

The headline population is exactly 1,000 public base profiles: development 758, original holdout 30, fresh holdout 12 and expanded holdout 200. Twelve diagnostic variants and authenticated owner-only records are excluded. Owner-only records require explicit cohort selection in the chart and remain outside the public source and static data.

## Current system versus reference comparison

`scripts/build-system-performance-061.mjs` replays the existing production `explorerResults` and `explorationRows059` functions against the frozen inputs. It verifies Top IDs against the unchanged current replay. Exploration candidate membership excludes every specifically supported career, including supported careers below the Top-three limit. Unknown and conflicting answers remain visible. Model-level Top and candidate membership may overlap; candidate counts are never added to supported Top coverage.

The resulting public report is `dist/developer/system-performance-061.json.gz`. The dashboard's legacy internal `strong`, `strongIds` and related column names now refer to these actual current production candidates. The old independent-reference membership is retained only in the separate benchmark report; it is not relabeled as current production output. Its bachelor/graduate reference coverage was 949 models, whereas actual unconfirmed production candidates reach 948 after supported careers are excluded.

The dashboard defaults to all 1,000 and keeps full-cohort totals visible when a subgroup is selected. The chart uses the same full-cohort totals, four separate cohort rows, normalized education filters and filtered CSV. The existing first-12 Other window stays intact; additional unconfirmed candidates from the full matrix are separately expandable and labeled. A candidate drill-down links to the actual model's profession evidence and earnings.

## Reproduce

Run `npm run build`. This regenerates the frozen replay, current frequency view, method benchmark, current-system report and dashboard. `scripts/build-performance-snapshot.mjs` invokes the current-system replay before projection. Build/verify preserves the Data App runtime, identity and source actions.

Run `node --test tests/model-match-chart.test.js tests/current-match-chart.test.js tests/program-performance.test.js tests/structured-cohort-056.test.js tests/coverage-059.test.js tests/coverage-060.test.js tests/onet-benchmark-057.test.js tests/reporting-061.test.js`.

These are synthetic replay and implementation checks, not measured student outcome validity. Earlier holdout aggregates have been seen; no holdout-specific rules or profiles were changed.
