# External-method comparison protocol · overhaul 0.53

This work tests whether our implementation agrees with an external scoring method and whether different career services produce comparable suggestions. Agreement is not proof of career suitability, predictive accuracy, fairness, or validity of our added questions. We must examine disagreement as well as agreement. Results from a reference formula are explicitly separate from live service responses.

## Executed now

The reproducible package is `research/validation-053-external/`. It freezes 184 public fictional model answer histories: 172 base models and 12 diagnostic variants. The six owner-only cases and the real account reviewed earlier are excluded. Histories and underlying questions are not rewritten for this comparison.

Before seeing external outputs, the live panel was fixed as the first two lexicographic IDs within each of seven existing cohorts. This gives 12 base models, two related diagnostic variants, and four constructed edge inputs. The diagnostic variants are not counted as independent students. Original and fresh holdouts retain their own cohort labels. The four edge inputs are all-dislike, all-unsure, all-love, and one changed item in the first development profile. This is a small, deterministic interoperability panel, not a representative validation sample.

1. Freeze the app's exact official 60-item answers, six sums, 457 occupation vectors, and current broad correlations.
2. Independently recompute all scores and correlations in Python, using the sums/products identity rather than the application's centered-vector loop.
3. Send only synthetic answer strings to the public O*NET documentation demo, without authentication, credentials, registration, payment, acceptance of new terms, or real user data.
4. Capture official question, score, and career-return JSON with URL, timestamp and response-page SHA-256. Keep raw responses even when they disagree.
5. Compare exact O*NET-SOC identifiers, complete pagination and fit labels on the shared catalog. Do not silently merge occupations with similar titles or discard unavailable items.

Commands, from the site directory:

```sh
python3 -m unittest discover -s research/validation-053-external
python3 research/validation-053-external/compare.py
```

The second command uses immutable recorded live responses and regenerates the report offline. A new live capture requires a separately dated fixture directory; the script refuses to overwrite an existing live capture or input freeze.

The original capture command was `python3 research/validation-053-external/compare.py --live`. It made 37 public requests: one complete question list and score/career requests for 18 synthetic inputs. The separate Coaches and Scouts discrepancy investigation made one additional request. Existing repository code already used this documented public-demo pattern, but no credentials were sought or read.

### Results and discrepancies

See `results.json` and `summary.json` for exact counts and denominators. All 60 official question texts, order positions and RIASEC assignments agree. All 18 external six-score profiles agree, including the four edge inputs. The independent arithmetic check covers 77,220 available correlations across 184 models, with zero mismatches at tolerance 1e-10; maximum absolute difference is approximately 5.53e-14. Four cohort profiles are flat, so their correlations and rank metrics remain unavailable rather than fabricated as zero. Occupations lacking six-value vectors remain unavailable.

Two live fit-label disagreements refer to the same occupation and same six-score vector in a development parent and its diagnostic variant. Coaches and Scouts, SOC 27-2022.00, has local r = 0.6082862021. Fieldguide labels this Strong using the rounded published 0.608 threshold; the official server labels it Good. With six values, the exact one-tailed p = .10 boundary is r = 0.6083997887; the observed value gives p = .10005366. This is consistent with a rounding-boundary explanation, but the exact server implementation has not been confirmed. Do not modify our results to hide the discrepancy or infer meaningful suitability from such a tiny boundary difference.

For flat input profiles, the live careers endpoint returned all 923 occupations with Good labels. That is an API behavior, not an instruction to recommend every occupation. Fieldguide's explicit flat-profile guard remains justified as a presentation and inference safeguard. The six-score outputs still agree.

The service returns fit categories and alphabetic ordering within each category, not numerical correlations. Therefore we do **not** report Spearman, Kendall or correlation-ranked top-k overlap against that display order. Those metrics are computed only for our independent numeric reference versus app values. For live returns we compare fit categories, exact-SOC strong-set Jaccard, full paging, and catalog coverage. Unmatched official occupations are disclosed as outside our inventory rather than treated as ranking errors.

## Documented external references

- [O*NET Short Form Questions, API Version 2.0](https://services.onetcenter.org/reference/mnm/ip/ip_questions): official 60-item sequence and five response values. The 30-item Mini-IP is a different item set; matching six scores can be used to test linkage, but that does not establish item equivalence.
- [O*NET Results](https://services.onetcenter.org/reference/mnm/ip/ip_results): converts an answer string to six scores.
- [O*NET Matching careers](https://services.onetcenter.org/reference/mnm/ip/ip_careers): accepts answers or six scores, allows Job Zone filtering, returns paginated career fit categories.
- [Career Returns within O*NET Interest Profiler Tools, October 2025](https://www.onetcenter.org/dl_files/IP_Career_Returns.pdf): explains profile correlation and separate Short Form/Mini-IP presentation rules. Our original scenario evidence is an additional system, not an official O*NET score.
- [BigFuture quiz description](https://bigfuture.collegeboard.org/help-center/what-career-quiz): describes a 60-question O*NET-derived quiz with 30 career suggestions. This makes it a plausible next comparison partner, not evidence that we ran it or that its ranking is identical.
- [Xello interest assessment phases](https://help.xello.world/en-gb/Content/Get-Started/Educator/Learning-Modules/Student-Assessments/Student-Assess-Dig-In-Interests.htm): documents staged refinement. Its public documentation does not expose an executable scoring reference.
- [Strong Basic Interest Scales](https://strongsupplement.themyersbriggs.com/chapter3.html): documents narrower constructs and 32 scales. This is a construct-coverage comparison, not an interchangeable questionnaire or public algorithm.

No live BigFuture, Xello, Strong, Morrisby, YouScience or other commercial vendor runs have been performed. Public claims about their broad process are not substituted for observed results. This release must not claim such agreement.

## Next external testing tiers

### Tier A: identical items and responses

For an accessible service, first independently verify question wording, instrument/version, order and response labels. Preserve exact original answers; map positions by stable item identity rather than position alone. Reversed items must have a documented reversal. Compute exact item agreement, six-score absolute error and profile-type agreement. Report the matched-item numerator and both instruments' item-count denominators. Never count an unasked item as neutral or infer a new answer from a desired occupation. The executed O*NET panel belongs here.

### Tier B: equivalent constructs, different wording

Use only synthetic public cases and a preregistered response crosswalk. Two reviewers, blind to offered professions and desired improvement, classify pairs as exact, close construct, weak analogy or noncomparable. Resolve ambiguous mappings before the run. Only exact items enter exact-score agreement. Similar-question translations belong in a separate sensitivity analysis with confidence and alternative plausible answers; they do not establish scorer equivalence. Interests, skills confidence, values and aptitude must remain separate constructs. Do not map a student's biography to an aptitude-test score.

Freeze panel, item crosswalk, response conversion, occupation crosswalk and metrics before retrieving results. Include college and noncollege profiles, analytical engineering without mechanical hobbies, clinical versus nonclinical health interests, artistic/investigative combinations, flat/near-flat and conflicting evidence. Keep fresh holdouts out of crosswalk authoring and parameter changes. If holdout results guide fixes, relabel them diagnostic and obtain a genuinely untouched later panel.

### Tier C: compare career outputs

Store complete exports, selected filters, location, age scope, catalog version, dates and provider ordering rules. Align by exact SOC version first, then separately review documented crosswalks. Deduplicate identical SOCs; disclose specialty merges, missing occupations, and unmatched providers' coverage. Compute each metric both on the shared SOC universe and with full-catalog coverage disclosed.

When numeric scores or an explicit relevance ordering exist, report Spearman rho, Kendall tau-b, top-5/10/20/50 intersection, precision/recall of strong connections and Jaccard. Retain ties crossing k and show the effective list sizes. If only categorical bands exist, compare categories and tie-aware sets; do not invent continuous scores. If only an alphabetic display exists, do not interpret its position as relevance. Publish per-case disagreements, not just an average. A well-reasoned newly discovered profession can be useful even when services disagree.

No minimum vendor-overlap target should drive production weights. Use disagreements to nominate blind human review of potentially missed or unjustified choices. A comparison service is not ground truth.

### Tier D: human plausibility and observed student exploration

The app's new specific evidence is expected to depart from a broad-profile-only service. Review the reason for that departure. At least two independent reviewers should see biographies and answers with job titles and recommendation status blinded where feasible, propose plausible career families first, then rate offered careers for clear support, plausible exploration, needs clarification, or unsupported stretch. Record evidence passages and counterevidence, inter-rater agreement and adjudication; report college and graduate subsets and cohort separately. Include plausible careers omitted by our engine, not merely already offered outputs.

Synthetic profiles and subjective review establish useful regression evidence, not human predictive validity. A later consented student study should measure comprehension, discovery of unfamiliar options, informed interest after career exposure, completion burden and response stability; no job-placement or career-success claim follows from this synthetic program. Commercial access, licensed instruments or account/terms requirements require a separately authorized access arrangement; do not fabricate a result to fill that gap.


A second actual deployed-service comparison is now available in `careeronestop-comparison-053-2026-10-19.md`: two public synthetic profiles,30 exact shared items each,12/12 observed theme sums and41/41 shared occupation labels agreeing. This does not create a second independent measurement family: both services use O*NET. Thirteen external strong-label careers are absent from the457 matching inventory and remain a reviewed-content backlog, not automatic personal matches.
