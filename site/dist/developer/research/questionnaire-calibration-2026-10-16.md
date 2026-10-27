# Questionnaire and guidance source review — October 16, 2026

This is a source and design audit. It does not establish that Fieldguide predicts aptitude, college success, occupational performance, or satisfaction. The accompanying reference cases are editorial acceptance cases, not a representative student validation sample.

## Recommendation

Keep the conversation short and let it lead to **broad fields → concrete kinds of work → a student-selected profession → one plan**. Present likes as preferences, experience as exposure, confidence as self-report, and documented ability results as separate evidence. Use “worth exploring” and “you liked…” rather than a fit percentage or a claim that someone should become a particular professional. Every career remains reachable through the complete tree.

Offer the unchanged official O*NET Interest Profiler as optional stronger interest evidence. Import its exact form, date, raw-score scale, and provider-returned careers. A custom Fieldguide prompt set can be useful, but must remain identified as Fieldguide’s own reflection; it does not inherit O*NET’s psychometric evidence.

## What the official resources establish

- The [O*NET Interest Profiler overview](https://www.onetcenter.org/IP.html) describes six vocational-interest dimensions, a 30-item Mini-IP and 60-item Short Form. It links broad interests to occupations, not a measured aptitude ranking. The current My Next Move interest link redirects to the standalone official profiler. Its Career Starter worksheet is designed for people starting education/training or lacking work experience.
- The [2021 technical manual](https://www.onetcenter.org/dl_files/IP_Manual.pdf), chapter 3, distinguishes online sums (Short Form 0–40; Mini-IP 0–20) from paper checked-item counts (0–10). It recommends care near/below age 14, discusses reading level and limited work exposure, and recognizes developing interests. Chapters 5–6 review reliability and validity evidence for the actual instruments. Those findings do not transfer automatically to new wording, fewer items, or a different scoring rule.
- The [Mini-IP development study](https://www.onetcenter.org/dl_files/Mini-IP.pdf), pp. 11–12 and table 9, reports alpha .70–.75 in its development sample and .74–.81 in a separate validation sample. The latter retained 575 adult respondents. These are scale-consistency results, not an individual student’s probability of success. Adult samples do not establish a local high-school outcome guarantee.
- The [October 2025 career-return report](https://www.onetcenter.org/dl_files/IP_Career_Returns.pdf) uses the full six-score pattern and occupational-interest-profile correlation. Short and Mini displays differ. Mini-IP fit cutoffs are .729/.608/.426; these are profile-correspondence categories, not career-success probabilities. Flat profiles do not produce fit-ranked careers, and additional interest exploration remains available. A selected job-preparation zone is a search preference, not a permanent limit on a teenager’s potential.
- [CareerOneStop’s Interest Assessment](https://cloudfront.careeronestop.org/Toolkit/Careers/interest-assessment.aspx) identifies itself as a 30-question O*NET-powered tool. Its [Skills Matcher](https://cloudfront.careeronestop.org/Toolkit/Skills/skills-matcher.aspx) asks users to rate 40 workplace skills; a self-rating is not a performance test. Its [career-ideas guide](https://cloudfront.careeronestop.org/HowTo/Findcareerideas/find-career-ideas.aspx) separately considers interests, skills and work values before narrowing choices. Its [work-values overview](https://cloudfront.careeronestop.org/ExploreCareers/Assessments/work-values.aspx) supplies six work-value categories; Fieldguide’s eight priorities are a different editorial set.
- [Tool licensing](https://www.onetcenter.org/license_tools.html) distinguishes verbatim redistribution from modification. Modified products require the developer-license conditions, attribution and validation. Linking to or embedding the unmodified official tool avoids representing rewritten prompts as the original instrument. A custom reflection should not be branded an official O*NET assessment.

## Current implementation audit

The findings below refer to the files inspected at the start of this audit; the main agent is making changes concurrently.

| Area | Observation | Bounded correction |
|---|---|---|
| `content.js` curiosity | Twelve custom school/project activities; two vaguely resemble each RIASEC area, but no validated scale is computed. | Keep custom status visible. Broaden the task contexts rather than claiming a six-scale test. |
| Coverage | Prototypes, datasets, community stories and school leadership dominate. Outdoor work, practical care, safety, repair, driving and performance receive little direct coverage. | Ensure student-friendly task choices represent every broad field, including noncollege work. |
| Wording | Several activities combine two or three actions: explaining/persuading, taking apart/investigating, making an event/leading people. | Ask about one main activity per selection. Avoid interpreting one response as endorsement of every component. |
| `guide-state.js` reflection links | Only ratings 4/5 create custom pathway links. Ratings 1/2 do not counterweight adjacent paths. Many-to-many links can favor heavily linked fields. | Explain direct likes; treat dislikes as context for a follow-up, never a universal career veto. Count an activity once per field and normalize for unequal question opportunities if producing an editorial ordering. |
| `analysis.js` imported scores | Form-specific integer/range guards, missing-score checks, raw/display separation and explicit flat handling are sensible. | Preserve them. Do not reconstruct raw totals from rounded provider displays. |
| Imported interpretation | Highest two distinct nonzero score levels are highlighted; a 5% scale-span cutoff marks a broad profile. These are editorial conventions. | Never label them official career-return matching or statistical significance. Prefer all six descriptive scores and supplied provider returns for official occupations. |
| Ties | Ties are retained, but top-two-distinct-level selection can promote a weak runner-up after a tied maximum. | Avoid forced winner/three-letter identity. Present tied broad options equally; a small third score is not automatically a strong second interest. |
| Empty/flat results | `analyze()` can still create a four-item agenda from catalog order when there is no differentiating evidence. | Label it broad browsing, not personalized top matches; use balanced fields rather than implying first-in-file superiority. |
| Confidence | Four analytic/design/communication/inquiry self-reports exclude hands-on care, physical/technical work and performance. All four currently require confidence + exposure. | Use only relevant follow-ups or permit explicit skipping. Low confidence with no experience should yield a safe try-it action. |
| Priorities | Exactly three are required, with an ordering UI; they do not affect current guidance. | Allow one to three, or explicit skip. Show chosen priorities as plan considerations; do not invent a quantitative career score. |
| Experience/reflection | A project and a reflection each need at least five characters to complete. Free text is recorded, not semantically scored. | Let “I’m still figuring that out” finish the step. Do not imply the text changed matches if no inference used it. |
| Skipping | `nextModule()` routes to any section not complete; merely bypassing a screen can create a return loop. | Store explicit answered/skipped status separate from unknown numerical values and accept it in progression logic. |
| Versioning | Saved curiosity answers use stable IDs without a questionnaire-content version. | If meanings change, add version/new IDs and preserve legacy responses as legacy; never silently reinterpret old selections. |
| Report copy | Reflection report says it generates no career recommendations, while guide highlights fields via reflection links. | Say “Your likes suggest fields to explore; they are not an aptitude score.” |
| Financial influence | Income/lifestyle routes intentionally order economic scenarios; interest analysis is separate. | Keep budget compatibility visibly separate from enjoyment/preparation. Changing salary goals must not change a student’s interest result. |

## Simple flow to implement now

1. **What catches your interest?** A short sequence of conversational task prompts. Single selection advances; Back is always available. Multi-interest fields use one “See these fields” action. An uncertainty option stays distinct from dislike.
2. **Here are a few fields to explore.** Show up to three equally readable field cards with one concrete reason each; mixed/flat profiles can choose from the full balanced set. No automatic profession decision.
3. **Which part sounds like you?** Within selected fields, choose concrete activities, such as supporting patients, explaining a lesson, fixing equipment, creating an interface or organizing deliveries. Multiple likes allowed. This distinguishes tasks within a broad field before showing job titles.
4. **Try a few careers.** Career cards show the daily task, preparation route and salary scope. Connect direct likes in plain language. Student choice establishes the main option; alternatives stay available.
5. **One personal plan.** Show broad interests, preferred tasks, a main possibility, an alternative, training/costs, a separate Austin lifestyle outlook and one safe next action. Confidence/evidence should change the next action or support, not declare ability.

Avoid an extra questionnaire for every career. Use one optional context question only when the selected field covers very different work: direct care vs lab research; teaching vs counseling; hands-on repair vs engineering design; visual design vs performance; public-safety response vs policy/advocacy. These are product recommendations, not tested psychometric classifications.

## Common-job task coverage

| Task cluster to include | Plausible exploration options; not automatic recommendations |
|---|---|
| Support someone’s health in person | RN, NP, PA, medicine, dentistry, allied health; distinguish credential and clinical tasks |
| Explain or teach a skill | Elementary, middle and high-school teaching; support/tutoring and technical training |
| Troubleshoot and repair | Computer support, automotive, electrical, HVAC and other trades |
| Keep people safe in urgent situations | Police, firefighting, EMT; discuss real duties and training without equating “helpful” with suitability |
| Build, join or shape materials | Welding, carpentry, fabrication and engineering/design alternatives |
| Move goods and keep deliveries organized | CDL driving, logistics and operations; separate hands-on driving from planning |
| Persuade, sell and negotiate | Real estate, business and sales; distinguish variable commission income |
| Plan spaces or digital experiences | Interior design, architecture, web/interface and industrial design |
| Investigate physical systems | Chemical/aerospace/mechanical engineering and science; distinguish process, flight and lab tasks |
| Make images or perform | Photography, music, acting and media; show irregular work/pay honestly |

Use the already-created common-career gap research file for exact SOC and Texas requirements. Do not infer professional competence from these task preferences.

## Calibration and testing plan

**Software/reference checks now:** assert scoring bounds, blank vs zero, form identity, raw vs provider display, all-equal/near-tie behavior, ties, legacy-version preservation, explicit skipping, user overrides, and income-independence. For each domain, ensure at least one direct concrete task and a route to every contained career. Every highlighted field needs a traceable positive answer or user choice. Test full journeys with contrasting and mixed fixtures in the JSON file; check that college and noncollege routes remain available where relevant.

**Reference comparison:** obtain original official-tool scores and provider returns for consenting adult/synthetic walkthroughs; compare form-preserving import/display exactly. Compare broad themes qualitatively, not exact job ranks across different questionnaires. Any future attempt to reproduce official matching needs the current full occupational profiles, named algorithm/version, flat-profile rules and separate parity cases.

**Human review:** have an independent school counselor review the broad-field and task mappings, identify stereotypes and missing alternatives, and review at least 10–15 varied synthetic cases. Then use a small consented teen usability pilot for comprehension, accessibility and whether students can explain why a field was suggested. These are formative checks, not norming or prediction validation.

**Psychometric claims later:** if a scored custom instrument is desired, commission a defined validation study with appropriate adolescent sampling, response processes, test–retest stability, scale structure, convergent/discriminant evidence and subgroup fairness. Do not turn the count of generated software combinations into evidence of real-world accuracy.

## Release language

Front: “A few directions to explore, based on what you told us.”

More info: “Fieldguide’s conversation is a custom reflection. It is not a standardized aptitude test. Official interest results, when added, keep their original instrument and scale. Career connections are exploration suggestions; you choose what to try.”
