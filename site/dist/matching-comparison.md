# How career matching compares

Reviewed 17 October 2026. Comparison of the current Fieldguide source code and primary provider documentation. These are established examples, not a verified ranking by popularity. Commercial descriptions are attributed to their providers; this review did not independently validate their accuracy claims or take every live assessment end to end.

Fieldguide release 0.25.0; profile schema 6.0.0.

## Current Fieldguide question counts

60 official interest + 36 field-work + 12 experience + 1 values + 4 context = 113 profile screens. Add 9 lifestyle choices and 8 follow-ups for the first chosen pathway: 130 screens total. Values are one selection of up to three of eight priorities, rather than a ranked multi-item inventory. The catalog contains 117 reviewed careers.

## Fieldguide · current

**Number & burden:** 113 profile screens + 8 follow-ups per field; health has 11. Lifestyle adds 9 choices.

**What students answer:** 60 official O*NET Short Form activity-interest ratings; 36 field-work ratings; 12 experience choices; one values selection; four work/education preference prompts. Follow-ups allow multiple task choices.

**How matching works:** Full six-dimensional Pearson comparison establishes career alignment. Field-work preferences refine pathway presentation within alignment categories. Eight task questions refine professions; health adds two role tasks and one preparation question.

**What comes back:** Up to three supported pathways, profession suggestions, Austin lifestyle comparison, education costs, earnings stages, and an editable personal plan.

**Evidence & limits:** Official interest instrument with published validation. Exact local scores checked against the official scorer for twelve fictional profiles. Field grouping, custom follow-ups and the combined experience still need student validation. No measured aptitude score.

[O*NET career-return method](https://www.onetcenter.org/dl_files/IP_Career_Returns.pdf) · [O*NET technical manual](https://www.onetcenter.org/reports/IP_Manual.html)

## O*NET / My Next Move

**Number & burden:** 30 items in Mini-IP: five per RIASEC scale. The Short Form has 60: ten per scale.

**What students answer:** Five-point ratings of enjoyment of work activities.

**How matching works:** Six interest scores form a complete pattern. Pearson profile correlation compares that pattern with occupational interest profiles; preparation information supports exploration.

**What comes back:** Interest profile and careers to explore. Interest similarity does not establish ability or admission eligibility.

**Evidence & limits:** Public technical manual and occupational-linkage method. The evidence applies to its instrument and implementation; it does not validate a separate custom guidance layer.

[O*NET career-return method](https://www.onetcenter.org/dl_files/IP_Career_Returns.pdf) · [O*NET technical manual](https://www.onetcenter.org/reports/IP_Manual.html)

## CareerOneStop

**Number & burden:** Separate tools: 30 interest questions; 40 skill/knowledge self-ratings; 20 ranked work-value statements. They are not one combined 90-question assessment.

**What students answer:** Activity preferences, anchored skill-level ratings, and a values card sort.

**How matching works:** Each tool returns its own matching careers. Skills are compared with occupational requirements; values are compared with occupation-level values ratings.

**What comes back:** Separate interest, skill, and values results plus occupation, pay and training information.

**Evidence & limits:** O*NET-based resources with publicly described methods. Self-reported skills remain different from demonstrated ability.

[CareerOneStop interest assessment overview](https://cloudfront.careeronestop.org/Toolkit/Careers/careers.aspx) · [CareerOneStop skills assessment guide](https://cloudfront.careeronestop.org/TridionMultimedia/tcm24-50399_PDF_changeoccupationuserguideACC.pdf) · [CareerOneStop values method](https://cloudfront.careeronestop.org/Toolkit/Careers/work-values-matcher-help.aspx) · [CareerOneStop skills matching API](https://api.careeronestop.org/api-explorer/home/index/SkillsMatcher_Submit_SKA)

## Truity · Career Personality Profiler

**Number & burden:** 94 questions; approximately 10–15 minutes, according to its FAQ.

**What students answer:** Self-reported Holland/RIASEC interests and Big Five personality traits.

**How matching works:** Combines interest and personality scores to recommend careers. Exact ranking weights are not disclosed on the reviewed product page.

**What comes back:** Profile summary and career recommendations; an optional fuller report.

**Evidence & limits:** Provider states reliability/validity research. This review did not independently audit that research or reproduce its algorithm. The described format is self-report, despite the aptitude label.

[Truity Career Personality Profiler](https://www.truity.com/test/career-personality-profiler-test)

## CareerExplorer

**Number & burden:** Five sections; approximately 30 minutes. A current fixed question total was not confirmed in its public method. Advertised 140+/150+ traits are not a question count.

**What students answer:** Interests, personality, workplace preferences, goals, and work/education history; career-interest and past-satisfaction information.

**How matching works:** Provider describes comparing personal and career profiles using machine learning and user satisfaction data. Exact model parameters and scoring weights are proprietary.

**What comes back:** Career and degree matches, personality insights, and career information.

**Evidence & limits:** Provider describes psychometric development and model training. This is a documentation comparison, not an independent audit of predictive accuracy.

[CareerExplorer assessment method](https://www.careerexplorer.com/career-test/)

## YouScience · Discovery

**Number & burden:** Provider describes 11 exercises, each 4–15 minutes; about 90 minutes total. It lists nine aptitude domains and five optional additional games. Exercises and domains are different counts.

**What students answer:** Performance exercises plus interests, rather than a preference questionnaire alone.

**How matching works:** Proprietary matching compares assessed aptitudes and interests with career profiles using occupational data and expert input.

**What comes back:** Aptitude and interest results, careers, and education routes.

**Evidence & limits:** Provider describes adaptation of Ball Aptitude Battery measures. We have not independently audited its validation evidence. Performance results still need interpretation in context.

[YouScience Discovery FAQ](https://www.youscience.com/discovery-faqs/)

## Exact current Fieldguide method

1. **Use the official Short Form:** All 60 original item texts, response labels, and question sequence are preserved. Ten items contribute to each RIASEC dimension. Responses 1–5 are scored as response minus one, producing six raw totals from 0 to 40. Every answer is required; no missing value is imputed.

2. **Compare the complete profile:** Pearson correlation compares all six raw totals with all six direct occupational values. High and low themes both matter. Strong and very strong categories use the documented Short Form thresholds .608 and .729. These categories describe interest-pattern similarity, not career-success probabilities.

3. **Group careers into pathways:** A field display score averages its three closest distinct occupational profiles, where available. Fields need strong mean alignment and at least two endorsed work preferences to be featured. Conflicting fields stay available with a clear caution; there is no filler third card. Within the same category, confirmed field-work preferences and fewer concerns refine presentation, followed by correlation. This aggregation is a custom navigation rule, not a validated new scale.

4. **Refine professions with tasks:** All follow-ups must be answered or explicitly marked unsure. Eight task questions are standard; health adds two role-specific tasks and a separate preparation preference. Each distinct question supporting a career counts once. Suggestions need strong profile alignment and three task questions, or nonnegative overlap with six task questions, three refinements and four focused selections. Actual interest labels stay unchanged. The seven compared clinical roles also need both role-specific task choices; preparation conflict is flagged. Specific role evidence and task support come first; correlation breaks otherwise equal ties. Tied evidence is not arbitrarily cut to three, and selecting every option does not force a recommendation.

5. **Handle uncertainty honestly:** Incomplete profiles do not produce comparisons. Flat or weakly differentiated profiles do not produce featured matches. Close raw totals or fewer than three non-modal answers trigger a conservative custom caution. Of 117 catalog careers, 116 have direct complete occupational profiles. Tattoo work remains available without a fabricated comparison.

6. **Preserve context and choice:** Experience, values, education openness and Austin lifestyle do not alter official scores. Earlier custom interests, notes, completed actions and plans stay saved. Students answer the new official items themselves; old answers are never relabeled. An explicit career choice remains possible even when the interest pattern differs.

## Recommended next changes

- Study comprehension, completion burden, stability and usefulness with actual high-school students. Published evidence for the official instrument does not establish validity of our complete application.
- Test whether our custom field and task follow-ups add useful discrimination beyond the official interest profile. Keep counselor review and student experiences in the evaluation.
- Keep interest alignment, experience, values, training requirements and lifestyle feasibility visibly separate. Avoid a single percentage implying a probability of success.
- Evaluate with actual high-school students: comprehension, completion burden, repeatability, sensitivity to order, and agreement with unmodified established tools. Agreement alone is not predictive validation.
- Use a properly administered external performance assessment when measured aptitude is needed. Four-choice experience answers cannot supply that measurement.

Official content and sequence are preserved. The assessment has published validation evidence; our separate custom follow-ups and complete application have not been independently validated with students.
