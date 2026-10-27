# Approach 1 · evidence replay 0.89

Research-only continuation of the frozen 0.88 replay. Live student flow remains 0.87. Approach 2 and shared foundation 1.0.4 are unchanged.

## Changes

Twenty-eight exact question-scoped simulator bindings cover adaptive teaching, wood assembly, logistics, geographic observations and several engineering methods. Some bindings deliberately require a specialty that is not recorded: general mechanical activity cannot establish building maintenance, and helping children learn cannot establish willingness for routine childcare. Those answers remain unknown.

Follow-up targeting prioritizes existing specific evidence, then available question bindings, then fewer remaining checks, then broad interest correlation. It selects one fixed snapshot of at most three professions and six questions per eligible profile. The selector does not look at simulated answers before choosing, and does not retry until a desired match appears.

Frozen profiles, earlier answers, statistical scores, support thresholds, education definitions and Top-three order are preserved. New support fills available Top slots only; all supported bachelor/graduate options are counted separately from the Top-three cap. Associate routes are separate. No demographic, mental-health, opportunity or narrative features are converted into interests.

## Evaluation

Both 1,000-model cohorts are replayed. Development (758), original holdout (30), earlier fresh holdout (12), and expansion holdout (200) are reported separately. The Grok cohort is separate. Both sets have informed calibration and are no longer pristine blind validation.

`results.json.gz` retains the full before/after supported-career lists, Top lists, every new question, simulated answer and exact evidence reference. `summary.json` contains cohort totals. `validation.json` records source hashes and invariants. The public gzip transport is losslessly string-pooled; its reader shows each model and unresolved question.

Unknown responses are not reclassified as dislikes or interest. Broader candidate invitations do not confer supported Top status. A small increase is preferable to inventing professional responsibilities that were never measured.

## Explicit uncertainties found in case review

Seven manually reviewed questions retain unknown answers where narrative evidence explicitly leaves classroom scope or restaurant work unresolved. These are exact case/question review holds with preserved quotes, not a word classifier. They can only withhold new support; they cannot create a positive interest. Frozen profiles are not edited. See `prototypes/evidence-089/review-holds.json`.

## Final counts

| Cohort | Top before → after | Bachelor / graduate Top | Any supported degree option |
|---|---:|---:|---:|
| all (1000) | 892 → 894 | 788 → 790 | 838 → 841 |
| development (758) | 671 → 673 | 591 → 593 | 631 → 634 |
| holdout (30) | 26 → 26 | 21 → 21 | 21 → 21 |
| holdout049 (12) | 11 → 11 | 11 → 11 | 11 → 11 |
| holdout056 (200) | 184 → 184 | 165 → 165 | 175 → 175 |
| grok075 (1000) | 759 → 769 | 636 → 657 | 683 → 704 |

All previous supported careers and Top lists are retained. No-college Top coverage is unchanged (398 original; 250 Grok). Seven explicit uncertainties remain unknown after manual source-conflict review.
