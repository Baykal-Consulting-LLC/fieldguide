# Comprehensive career-exploration testing program · 0.53

The testing program separates five questions: does the software implement its stated rules; are the underlying calculations interoperable; are the simulated inputs credible; do the careers seem relevant to an independent reviewer; and do actual students benefit? These are different claims. An externally agreeing score does not validate our new recommendation logic.

## 1. Reproducible inputs and provenance

Keep all original biographies and item IDs unchanged. Retain each answer's source, confidence, rationale and review hold. Save new student answers additively, including before/after history. Use medium/high-confidence biography inferences only with specific evidence; unknown work remains unknown. Never manufacture new answers merely to raise coverage.

Freeze questionnaire, memberships, eligibility rules, score implementation and independent review expectations before outcomes. Record justified amendments separately. Model results are simulated, not recorded student choices. Private account data and the six owner-only models must not enter static assets or external services.

Run the 172 base profiles as separate cohorts: original development70, supplement24, legacy24, original holdout30, new development12 and fresh holdout12. Report12 diagnostic variants separately. Repeated use means the original holdout is historical evaluation evidence, not a pristine unseen test set. Preserve fresh-holdout separation; do not tune from its outcomes. Recruit another unseen cohort before claiming out-of-sample performance.

## 2. Software and response-sensitivity tests

Required release gates:

- All457 canonical professions accessible with no assessment, field, degree or budget prerequisite; no duplicate IDs or fallback substitution.
- Every field filtered by reviewed membership before sorting, education selection and pagination; all12 fields remain reachable.
- Exact official60 item text, sequence, labels, encoding and theme totals; partial, flat and nearly flat inputs handled explicitly.
- Raw correlation does not change after optional preferences, strengths, demographics, health labels, education or finances.
- Independent specific interests can support a career despite lower broad correlation. Generic Love responses, related hobbies, one domain counted repeatedly or current skills cannot confirm a profession.
- Unknown, unfamiliar, missing, low-confidence inference and review-held evidence do not become positive evidence. Essential No keeps discovery open but blocks a supported-interest claim.
- Contrasting health cases separate patient care, medical investigation, emotional support, health data and biomedical design. Generic social interest cannot establish surgery. Engineering cases separate mechanical, electrical, biological, civil and software contexts.
- A saved legacy response is reused only for its exact question, not copied to another profession by domain label. Revised responses retain their prior version.
- Answer edits alter relevant evidence and ordering; unrelated career/field answers cannot leak. A field choice alone changes scope, not personal scores.
- No automatic career choice or arbitrary minimum of three matches. Favoriting is independent of confirmation; education filter changes visible professions, not denominators or support thresholds.
- Check pay availability, prior-experience roles, earlier paid preparation, debt assumptions and unknown costs separately. Unknown pay is not proof of affordability or unaffordability.
- Check empty results, invalid URLs, direct links, back/resume, reload, saved notes, plan actions, keyboard controls, narrow screens, source links and visible inference labels.

Run `node --test tests/open-explorer-053.test.js`, the existing model-chart regression suite and the full repository suite. Earlier numerical engines retain their historical tests. UI assertions for the retired mandatory funnel are versioned to historical rendering rather than used to force old gates into the new flow.

## 3. Independent external-service correlation

Implemented now: two actual deployed services (the official O*NET demo and CareerOneStop’s30-item assessment), with independent offline arithmetic. CareerOneStop used two contrasting development profiles and exact shared-item answers; it is the same O*NET measurement family. Its comparator is `research/validation-053-careeronestop/compare.py`. Thirteen external strong-career labels lack matching inventory entries; review occupation scope, student interest evidence and preparation before adding them.

`research/validation-053-external/compare.py` independently recomputes Pearson correlations and tie-aware ranking metrics from frozen public inputs. Recorded live official O*NET responses verify all60 item texts/order/themes and six raw scores for18 synthetic profiles. Preserve every response, input hash, retrieval timestamp and discrepancy. Re-run offline without network; a deliberately invoked refresh can collect new live fixtures.

For **identical instruments**, compare raw theme totals, item handling and common-SOC career returns. Report absolute errors, fit-category agreement, Spearman, Kendall tau-b and top-k Jaccard only where definitions and actual ordering are comparable. O*NET displays careers alphabetically within tiers; do not compute rank correlation against that display order. Flat profiles are a separate edge case.

For **similar but different questions**, first build a reviewed construct crosswalk: source item, wording, intended construct, response scale, applicable age/context and matching strength. Do not assume paraphrases are identical or convert Love into measured skill. Use the same synthetic personas, independently assign each service's actual items, and flag uncertain translations. Compare common constructs and occupation families, coverage, uncertainty and false positive/negative cases. Agreement is descriptive; neither vendor is ground truth.

Commercial comparison targets include CareerExplorer, CareerOneStop/My Next Move, ACT/SuperStrong where licensed, and other established student services with documented methods. Use official APIs or ordinary permitted public flows. Account/paywall/licensing dependencies stay explicit. No commercial runs have been performed in this release; it would be misleading to report vendor accuracy or agreement. Do not transmit actual student records without specific authorization.

## 4. Blinded subjective review

A separate reviewer first froze a biography-only ledger covering18 development and6 original-holdout cases, plus6 separate synthetic engineering/health counterexamples. Reviewers receive career names, claim labels, supporting/contrary answers and exact unresolved questions; no salaries, numerical scores, old/new labels or coverage targets. Preserve the original ledger and review output.

Judge relevance, independent support for the distinctive work, overclaiming, missing plausible directions, field scope, uncertainty and student agency. A plausible discovery is not automatically a supported Top. A hobby is an invitation to ask, not proof of a professional preference. Lack of professional experience is not a negative interest answer. Distinguish an inventory gap from a first-page omission or an inconsistent simulated answer.

For subsequent real-student work use at least two independent career counselors, blinded to algorithm version, with adjudication of disagreements. Measure inter-rater agreement, relevance at3/12, independently plausible career-family recall and unsupported strong-claim rate. Pre-register the sampling, coding and acceptance criteria before collecting outcomes. Do not present the one synthetic reviewer as a counselor panel or real-student validation.

## 5. Real-student pilot and validation

Not yet executed. Conduct cognitive interviews on wording and unfamiliar activities, then randomized/counterbalanced old versus open-flow sessions. Include students with mixed, uncertain, artistic, social, analytical and practical interests; variation in disability/access, school exposure, language, finances and educational ambition. Collect sensitive attributes voluntarily for fairness auditing, separately from interest eligibility.

Observe question comprehension, abandonment, saved/revisited careers, breadth explored, perceived relevance and whether students can explain evidence and uncertainty. Follow up after a meaningful activity or information interview, then after education/work choices. Interest change and better-informed rejection can be successful outcomes. Short-term favorites and salary attractiveness are not proof of long-term fit.

Validate the24 new reflections separately: comprehension, domain coverage, test–retest reliability, internal structure, redundancy, differential item functioning and convergence/discrimination against appropriate measures. Do not claim that two prompts per facet are a validated scale. Until occupation links and measurement properties are validated, they are reflection context and do not change statistical correlations or confirm professions.

## Regression and ongoing review

Every normal build reruns the public saved-answer cohort and rebuilds the chart. Pin the current review at Developer. Retain first matches and0.52 historical results; publish current supportedTop3 separately from all supported careers, first12 discovery and all457 accessible careers. Report education and budget outcomes separately, with per-cohort denominators. Recompute field/profession frequencies from those same displayed lists, deduplicating each model and preserving overlapping field membership and zero versus unasked distinctions.

Before each release examine unexpected additions/removals, low-evidence strong claims, high-income/degree presentation skew, field leakage, boundary sensitivity and missing-data rates. Record failures and review decisions; do not simply enlarge assertion counts. No automation or scheduled follow-up is implied by this build-time program.
