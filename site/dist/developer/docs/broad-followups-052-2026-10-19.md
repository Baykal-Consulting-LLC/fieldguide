# Profile-based follow-up round — 0.52

This release answers the questions that the 0.51 routing-only evaluation left unasked. It does not claim that the earlier run removed pathways from the main journey or measured the effect of new student learning. The prior run added a reversible exploration pilot and reused exactly the same saved answers.

## Design locked before outcomes

The first-round queue from the 0.51 pilot was frozen for every public fictional profile before new answers were authored. One round contains at most 12 distinct, previously unasked question IDs. There are 1,077 authored responses across 117 base models. The other 55 have no new questions in that next round; their existing unsure, unfamiliar, declined and reviewed answers are preserved. No extra rounds were added to chase Top matches.

Three independent authors received full biographies and anonymous question/option packets. They did not receive the question-to-career mapping, scores, current Top matches, pay targets or matching outcomes. Original and fresh holdout responses were authored separately from development. Some biography details and the work described in prompts naturally identify a career area; anonymity does not make occupational context unknowable.

Positive answers need direct biography support for the specific interest and medium or high confidence. Each selected task option requires its own evidence and biography references. A demonstrated skill, broad desire to help, wealth, gender, race, disability or mental-health history does not by itself establish occupational interest. Existing hobbies and school/home activities can support an underlying interest without prior professional experience. Unfamiliarity is not dislike, and missing evidence remains uncertain.

Question sets, replay rules, original inputs and raw authored answers have separate hashes. All authors' files were frozen before the outcome replay. Any subsequent inference-quality holds are recorded separately, with raw authored answers preserved.

## Replay and comparison

The replay applies the exact first-round scheduler used by the live pilot. Exact question IDs already answered are never overwritten. Questions skipped after an earlier defining-interest decline remain in the record as authored but not applied. Inferred answers retain their source, confidence, rationale and biography references; they are not labeled as actual student responses.

The 172 public base models are the main denominator. Original development, additional and older profiles, new development, original holdout (30), and fresh 0.49 holdout (12) retain separate rows. Twelve diagnostic variants are excluded by default and reuse only exact matching parent response IDs; unshared questions stay unasked. Six owner-only records are not bundled or included in this public experiment.

Top eligibility, interest thresholds, task/role/clinical checks, education treatment, wage references and ranking are unchanged. New evidence may resolve a check, leave it incomplete, or reveal a conflict. Financial coverage remains a separate starting-pay assessment, with training funding and unknown pay handled as before.

The chart retains the earlier 0.51 routing-only comparison and adds **Before answers → after the new follow-up round**. The current main offer lists, student previews, cohort matrix and match-frequency views use the same updated replay. Per-model details show every applied or skipped answer, confidence, evidence and remaining defining-interest questions. Education filters retain the selected cohort denominator in the paired comparison, including models with no offer in that education group.

## Reviewed results

| Cohort | Models | Any Top | College / graduate Top | Sustaining Top | Changed Top lists |
| --- | ---: | ---: | ---: | ---: | ---: |
| Original development | 70 | 64 → 64 | 58 → 58 | 29 → 30 | 3 |
| New development | 12 | 9 → 9 | 8 → 8 | 3 → 3 | 0 |
| Additional profiles | 24 | 21 → 21 | 15 → 15 | 8 → 8 | 0 |
| Older profiles | 24 | 21 → 21 | 16 → 16 | 12 → 12 | 0 |
| Original holdout | 30 | 25 → 25 | 20 → 20 | 6 → 6 | 2 |
| Fresh 0.49 holdout | 12 | 8 → 8 | 8 → 8 | 2 → 2 | 0 |
| Public base total | 172 | 148 → 148 | 125 → 125 | 60 → 61 | 5 |

Degree-route Top offers remain 232; first-ranked sustaining matches remain 47. Three models gain a degree-route Top profession, but all already had a degree-route Top, and replacements elsewhere offset the additional offers. Five final Top lists change: life-005, life-012, life-085, life-060 and life-066.

The 1,077 applied responses contain 304 supported positive reflections, 771 unsure/unfamiliar responses, and 2 explicit declines. These are question counts, not independent students or additional confirmed professions. The 12 diagnostic variants remain separate and contribute no new independent response evidence.

Before the first outcome replay, seven inference reviews corrected two overextended early-childhood-teaching Yes answers and five overbroad No answers based only on avoidance of clinical care. Independent reviewers then assessed every newly added Top offer. They retained five offers and held three additional defining-question inferences about sustained longer-form writing and user-centered product design. Raw author responses remain unchanged; all ten held reflections are applied as uncertainty, with explicit follow-up questions. One supported graphic-design reflection was conservatively reduced from high to medium inference confidence.

The unreviewed first pass is retained in research/broad-followups-052/first-pass-before-final-review.json. The current chart uses the final quality-reviewed replay, not that preliminary result.

## Reading the results

The generated `broad-followups-052-data.json` chart dataset contains the authoritative paired results, per-cohort totals, added/removed Top offers and full answer trails. Its small validation summary links to that dataset rather than duplicating it in the hosted package.

A rise in Top coverage must be supported by the actual answers; more invitations do not count as new confirmed matches. A single round may distribute evidence across several possibilities without completing any one profession's requirements. No change can mean missing domain interest, remaining questions, unchanged ranking, or an unrealistic starting-pay lifestyle expectation. The per-profession status distinguishes those cases.

These are biography-based simulations, not observed student behavior, validated aptitude measures, learning effects, or a causal estimate of matching accuracy. Both holdout groups were inspected in earlier releases and are regression cohorts rather than untouched external validation. Real student responses may differ.

## Reproduction

1. `scripts/prepare-broad-followups-052.mjs` freezes the first-round queues and the 0.51 baseline before authoring. It refuses to regenerate a frozen question set.
2. The three `research/broad-followups-052/answers-*.json` files contain independently authored responses, with evidence and uncertainty.
3. `scripts/prepare-broad-followups-052-runtime.mjs` verifies question, response, biography and matching-file hashes and generates the public replay map.
4. `scripts/evaluate-broad-followups-052.mjs` reruns the full public cohort and writes paired results and career/response trails.
5. The normal build regenerates the chart, matrix, frequency view and student previews. Original histories remain intact.
