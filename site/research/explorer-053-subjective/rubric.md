# Explorer 0.53 independent subjective review rubric

Locked 2026-10-19 before this reviewer inspected current or 0.53 match outputs. Companion `expectations.json` contains 18 development and 6 original-holdout biographies, plus 6 explicitly synthetic counterexamples. No fresh holdout biography, real account, score, pay figure or match outcome was used to author expectations.

## Purpose and limits

Judge whether discovery results make defensible connections to a fictional student's interests while keeping uncertainty visible. This is an independent qualitative relevance review, not validation of predictive accuracy, aptitude, occupational success or a psychological instrument. A biography is incomplete evidence; hypothetical students cannot establish actual student comprehension or satisfaction. The 24 cases are purposively varied and cannot estimate cohort-wide failure rates.

The ledger names plausible exploration families, conditional possibilities and prohibited inferential shortcuts. It deliberately does **not** prescribe a single correct career or exact rank. A profession omitted from the ledger can still be reasonable if its explanation cites specific, relevant evidence. Do not count an unfamiliar profession as wrong solely because the reviewer did not expect it. Cross-disciplinary membership may overlap fields when documented.

Sample limitations must remain explicit: these biographies contain relatively little clear patient-care motivation. Biology curiosity, one's own health condition and family caregiving must not manufacture that motivation. Synthetic clinical/nonclinical health cases therefore supplement rather than impersonate the real cohort. They establish functional counterexamples, not cohort-level evidence of clinical matching quality.

## Blind review sequence

1. Preserve the SHA-256 manifest and original ledger. Do not edit expectations after opening outputs. Corrections are separate, dated amendments with reasons; they must not erase the original.
2. First score profession lists and explanations **without numerical correlations, salaries, coverage deltas, degree-route counts or old/new labels**. Those details can bias a reviewer toward a desired outcome.
3. Use stored biographies and actual prior answers as evidence only after the initial biography-only expectations are locked. Distinguish an explicit answer from a reviewer inference.
4. Score the first 12 displayed professions and separately inspect the entire candidate list for missed highly relevant families. A low-ranked exploratory career is not equivalent to a strong recommendation. Review field-survey main results separately from opt-in cross-field invitations.
5. Only after relevance decisions are frozen, unblind old/new labels and scores to describe improvements and regressions. Keep original holdout results in their own table and do not tune from them. Fresh holdout is a later evaluation under the same locked rubric, not a development set.
6. Review questionable cases with a second independent reviewer where feasible. Report raw agreement and weighted agreement for ordinal grades, along with adjudication counts. Do not silently replace independent judgments with a consensus that appears unanimous.

## Ratings per case

Each dimension uses 0–3 or **not assessable**. Record an evidence quotation/path and concrete explanation. Report dimensions separately; do not hide safety or validity failures behind an average.

| Dimension | 3 | 2 | 1 | 0 |
|---|---|---|---|---|
| Supported relevance | Most prominent careers have direct, coherent interest evidence; specificity matches evidence | Broadly plausible; some adjacent options appropriately qualified | Mostly weak generic links or unqualified specialization | Dominated by unrelated or contradictory careers |
| Opportunity coverage | At least one strong exploration direction from each clearly supported family is accessible and explained | Main directions accessible; one plausible branch underrepresented | Important supported family substantially buried or uninvited | Supported family absent or hard-gated despite relevant evidence |
| Calibration | Explicit, transferable and uncertain evidence distinguished; no false certainty | Generally calibrated with minor unclear labels | Several strong labels exceed evidence or unknowns treated negatively | Strong certainty rests on stereotypes, duties, diagnosis or contradictory answers |
| Breadth and student agency | Useful distinct directions; all careers/fields searchable; optional narrowing and revision | Useful alternatives with minor friction | Repetitive variants or pressure toward narrow choices | Forced funnel excludes relevant alternatives without student choice |
| Field-survey fidelity | Every main result belongs to the chosen field or documented overlap; other fields opt-in | One unclear membership/explanation requiring review | Multiple unrelated careers mixed into main results | Main results predominantly global fallback unrelated to chosen field |
| Explanation and answer responsiveness | Concrete prior/new evidence and unresolved questions explain rankings and changes | Mostly specific explanations with limited missing provenance | Generic rationales or added answers barely affect analysis | Explanations contradict answers or field survey ignores its specific evidence |

Field-survey fidelity and answer responsiveness are not assessable from a static global career list alone. A hypothetical counterexample does not prove live flow correctness without a replay or browser assertion.

## Per-profession relevance labels

- **Supported connection:** repeated or specific relevant interest evidence supports exploration at this specificity. Not a confirmed occupation or educational commitment.
- **Plausible adjacent connection:** coherent transferable evidence; identify the missing preference or experience.
- **Needs clarification:** evidence too sparse, mixed or unfamiliar; state a concrete resolving question rather than claim poor fit.
- **Unsupported stretch:** strong recommendation depends on tenuous links, demography, diagnosis, access, status preference or ordinary duty, or conflicts with explicit disinterest.
- **Scope mismatch:** outside the chosen field without documented cross-disciplinary membership, in the field-survey main results.

Generic profession labels should not be given stronger relevance merely because they match more biography keywords. An exploratory invitation can reasonably precede strong evidence; the label must communicate that status.

## Critical failures and decision rules

Always report these individually, regardless of aggregate grades:

- A diagnosis, demographic trait, family income or need for accommodation generates or vetoes occupational interest without explicit relevant evidence.
- A field-specific survey's main results contain unrelated global fallback professions. Overlap careers are allowed only with reviewed membership and an understandable explanation.
- Broad correlation hard-vetoes a coherent specifically supported profession, without an honest conflicting-evidence explanation and accessible exploration.
- Unknown or unfamiliar work is silently converted to dislike.
- New specific answers are ignored, or a counterfactual replacing a positive answer with a negative leaves **all relevant evidence/ranking/explanation outputs** identical. An unchanged numerical broad correlation is expected when that metric remains a separately preserved broad-assessment result.
- Two generic positive field answers are promoted to strong fit across all specialties, or hobby/obligation/skill is treated as career motivation by itself.

Suggested prototype release decision: no confirmed critical failures in replay tests; no new unsupported strong recommendation or missing directly supported family relative to the locked baseline; all case concerns visible with resolving questions. This is a qualitative gate, not a statistically validated threshold. Do not tune scores to pass this sample.

## Counterfactual and sensitivity checks

For engineering, vary manual-repair enjoyment independently of analytical design/modeling; verify that college engineering can remain available, while engineering specialties still require branch-specific evidence. Separate unfamiliar mathematics from explicit dislike of it.

For health, vary clinical patient care independently of laboratory, community, research and population-analysis interests. Review health/engineering and health/data overlaps explicitly. A single negative preference for an invasive procedure must not reject unrelated health roles.

For question burden, compare supported directions and uncertainty before/after 0, 4, 8, 12 and all available optional answers. Additional questions need not improve every rank, but should add identifiable evidence or resolve uncertainty. Monitor irrelevant/repetitive questions and unanswered specialties.

For access, motivation and identity, use controlled copies that change only a background trait while leaving interests and explicit work constraints identical. Interest-based recommendations and strength explanations should not change; practical support notes may appropriately change where explicitly relevant. This test does not require publishing private traits or using real accounts.

## Reporting

Keep development (18), original holdout (6), fresh holdout (later), synthetic tests and diagnostic variants separate. Report case IDs, review dimensions, first-12 precision by relevance label, unsupported-strong counts, missed directly supported families, field-scope leakage and concrete examples. Use a diversity-sensitive metric that counts distinct families, not twelve nearly identical specializations as twelve directions.

Do not describe the original holdout as pristine: it has been replayed in earlier project iterations. Do not describe service-to-service agreement as ground truth. External proprietary tests can differ in construct, question wording, inventory, norming and output labels. Agreement with equivalent official public scoring can verify implementation; agreement with other services is exploratory convergent evidence only, requiring licensed/authorized access and documented equivalent inputs.
