# Scoped bindings and targeted follow-ups 0.79

Research only. Production matcher 0.63, official interests, profile facts, earnings, catalog and education routes remain unchanged. This is further calibration following review of both original and Grok examples; none of these inspected cohorts is pristine unseen validation. No independent human assessment has validated this round.

Seven exact specific-question bindings change: electronics troubleshooting, validation documentation, adaptive kindergarten methods, instructional-material evaluation, environmental investigation, legal-file organization, and a stricter educator-coaching responsibility check. Each uses concrete activity/method/responsibility IDs. Explicit conflicts remain unknown. Documentation is distinct from safety sign-off; adaptive explanations are distinct from school leadership. Some previous unsupported transfers are withdrawn rather than protected to inflate counts. No words from biographies or prompts classify answers.

The corrected fixed bank has 15 short probes separating embedded activities, numerical modeling, consequential forecast communication, animal experiments, producer/grower advice, music composition/finished-work responsibility and audio editing. Existing partial-specific unresolved questions determine eligibility; a single deterministic inventory-order snapshot after scope corrections invites at most four per eligible typed profile with no Top or no bachelor/graduate Top. No adaptive retries chase a match. Remaining eligible probes are explicitly deferred. The fixed order favors six reviewed scope issues; future targeting should be assessed for information value, not tuned on held-out outcomes.

Probes are authored research decompositions of existing question constructs, not independently validated short scales or new measured student evidence. Responses come only from frozen typed facts. They can corroborate an equivalent scope repair, but audio editing never answers composition, and animal care never answers agricultural research/advising. All 172 narrative profiles keep authored answers; no prose-to-construct conversion or profile enrichment. New interests/purposes not in the profile remain unknown. The same conservative response engine can answer No on explicit opposed constructs.

| Cohort | Top before → after | Bachelor/graduate Top before → after |
|---|---:|---:|
| Original all 1000 |880 → 885|778 → 784|
| Original development 758 |661 → 664|584 → 587|
| Original holdout 30 |26 → 26|21 → 21|
| Earlier fresh holdout 12 |11 → 11|11 → 11|
| Expansion holdout 200 |182 → 184|162 → 165|
| Grok evaluation 1000 |746 → 751|624 → 631|

No model loses all Top coverage or all bachelor/graduate Top coverage. This does not mean every career claim is preserved: original profiles lose 41 supported claims and Grok loses 36. Career-level details are retained in `claim-audit-002.json`. Exact additions, withdrawals and rank displacement remain in the paired dataset and UI. The new validation binding requires explicit testing/detail evidence, which some old safety/quality-only profiles lacked. Broad-interest disagreement remains inspectable; gains alone do not establish fit.

Original: 176 probes across 83 models, 27 Yes, 2 No, 147 unknown. Grok: 549 across 234, 90 Yes, 3 No, 456 unknown. Scope fixes alone produce the final coverage totals. Short probes add no further Top or degree coverage; repeating known profile evidence does not establish missing interests.

Reproduce from the workspace root `site`:

1. Verify `calibration/simulator-079/freeze-002.json` source hashes. Do not regenerate a frozen file or retune this run after observing results.
2. `node scripts/simulator-079/replay-002.mjs` reconstructs every exact final078 offer from the immutable077 states plus078 transcript, asserts equality, applies only079 changes, and evaluates the same current matcher for both1000-profile cohorts.
3. Canonical full results are retained outside source publication at `../outputs/simulator-079-002/results.json.gz`. If the local078 canonical intermediate is absent, regenerate the same offers using `scripts/simulator-078/replay-002.mjs` and the frozen inputs documented in the078 README before replay; do not substitute a fresh current population. Generated timestamps may differ, but the before-offer equality assertions must still pass.
4. `node scripts/simulator-079/publish.mjs` generates the small lossless079 supplement, reusing unchanged hash-verified078 offer/budget pools. All six result categories before and after round-trip exactly. `dist/simulator-codec-079.js` hydrates; catalog, scores, budgets, evidence and unknowns are not discarded.
5. `scripts/performance-simulator-079.mjs` projects the six separate cohort summaries into the existing DataApp. The chart offers all2000 cases, full frozen profiles/answers, changed checks, exact probes, supported alternatives, unconfirmed candidates, education/earnings and field/career distribution. Live headline data remains separately labeled.

Tests cover source freeze, both populations/splits, unchanged narratives, exact fact references, unknowns/conflicts, bounded probes, immutable scores/pay/routes, before equality, after category roundtrip, caps, coverage attribution and withdrawals. Full website build and required current chart checks must pass before publication. Lossless gzip packaging of the older cohort matrix frees static space without changing its data; readers and tests decompress the exact payload.

## Remaining inventory gap

The audio probe confirms some recording/editing interests while composition stays unknown. Sound Engineering Technicians exists as `soundPreview056` and in the broad directory, but has no specific-question entry in the frozen077 inventory and no scored supported-offer representation in this benchmark. This is a real remaining inventory/question gap, not justification to relabel those profiles composers. A later version should add separately reviewed sound-production checks and entry-pay evidence; this frozen run does not manufacture them.

## Preserved first pass and responsibility correction

The original frozen pass remains in `bindings.mjs`, `replay.mjs`, `freeze.json`, `summary.json`, and the public `simulator-repair-079-first-pass.json.gz` supplement. It produced 885/784 original Top/degree Top and 755/651 Grok. An exact question audit after inspecting those totals found that the old instructional-coordinator responsibility binding equated course assessment with coaching educators/coordinating curriculum. The corrected `-002` freeze/rules/replay add a direct educator-coaching probe, require that distinct purpose, and target unresolved checks after scope repair. Nothing enriches frozen profiles with coaching interest. Final results are therefore explicitly post-outcome calibration.

Corrected graduate-only Top coverage is 235 → 231 original and 212 → 209 Grok. Those declines are reported, not hidden by improved combined bachelor/graduate coverage. Darius retains Preschool Teacher support, while Instructional Coordinator needs educator-coaching confirmation. Short probes still add no coverage beyond the scoped corrections. The extra source-audit safeguard is more important than retaining the preliminary college increase.

Validation completed: full `npm run build` exit0, 54 distinct focused tests passed, final six dashboard cohort summaries reconciled with chart data, and static payload guard passed at237.19MiB. Browser automation reported no available surfaces; localhost chart/dashboard returnedHTTP200, but visual rendering and interactions were not verified. See `validation.json`.
