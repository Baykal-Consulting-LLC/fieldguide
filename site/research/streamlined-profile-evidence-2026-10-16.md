# Evidence for a simpler high-school career journey

Researched 16 October 2026. Intended use: an internal family exploration guide for high-school students, not admissions selection, diagnosis, or prediction of career success. The question wording and implementation rules below are design recommendations, not a validated new assessment. No proprietary assessment items are reproduced.

## Recommended journey

**Picture my Austin life → Build my profile → Consider three broad directions → Explore the work → Choose a career plan.**

One visible next step per screen, a persistent Back control, and editable earlier answers. Lifestyle is required as a learning activity but can start from safe defaults; students should not need to know mortgage costs or tax rules. Keep its financial estimate separate from interest matching. Three proposed directions are a manageable starting set, not a verdict. Other directions remain in clearly grouped cards below the three, reachable on the same screen.

Interest, skill, confidence, values, work preferences, and financial feasibility answer different questions. Store and explain them separately. A single opaque “match percentage” would imply precision the app does not have.

## What the established resources support

| Source | Finding relevant to this app | Practical implication |
| --- | --- | --- |
| [O*NET Interest Profiler](https://www.onetcenter.org/IP.html) | The tool measures six RIASEC interest areas. Its Mini-IP has 30 items; the Short Form has 60. It supports broad interests followed by occupation exploration. | Use balanced coverage of hands-on, inquiry, creative, helping, persuading, and organizing activities. Do not call preferences aptitude. |
| [Mini-IP development report, 2016](https://www.onetcenter.org/reports/Mini-IP.html) | A shorter instrument was developed and studied specifically for mobile use. | Shortening is an empirical instrument-development task. Thirty original questions do not acquire Mini-IP reliability merely by having the same length. |
| [Interest Profiler technical manual, 2021](https://www.onetcenter.org/reports/IP_Manual.html) | The manual covers development, reliability, validity, scoring, and occupational linkage; it describes educational planning and exploration uses. | Treat results as revisable career ideas. Retain earlier answers and experiences so students can revisit them as they learn. |
| [O*NET Content Model](https://www.onetcenter.org/content.html) | Interests, abilities, skills, knowledge, education, tasks, and work context are distinct categories. Skills develop through education and experience. | Give each profile dimension a specific question family and source tag; link profession follow-ups to actual tasks and contexts rather than stereotyped personalities. |
| [CareerOneStop Skills Matcher developer repository](https://github.com/CareerOneStop/Skills-Matcher) | Its API provides 40 skill statements for users to self-rate and returns occupational matches. | Self-rated skill can start reflection, but is not an objective performance test. For teenagers, interpret beginner skill as a development need rather than exclusion. |
| [CareerOneStop Work Values](https://www.careeronestop.org/ExploreCareers/Assessments/work-values.aspx) and [Work Values Matcher](https://www.careeronestop.org/Toolkit/Careers/work-values-matcher.aspx) | The matcher uses a 20-statement card sort around achievement, independence, recognition, relationships, support, and working conditions. | Ask what matters and allow several priorities. A role may fit interests while the employer or work arrangement determines values fit. |
| [O*NET Career Returns report, October 2025](https://www.onetcenter.org/reports/IP_Career_Returns.html) | Official career returns compare the shape of user and occupational interest profiles using a correlation coefficient. | Benchmark shape-based interest suggestions against official returns. Correlation is not a probability of satisfaction or success; a flat profile needs explicit handling. |
| [Standards for Educational and Psychological Testing, 2014](https://www.testingstandards.net/uploads/7/6/6/4/76643089/standards_2014edition.pdf), standards 1.0–1.3 | Validity concerns particular score interpretations and uses, for specified populations. Unsupported interpretations must be identified. | State what the app can infer. Pilot changed questions and scoring with high-school students before claiming validity or aptitude measurement. |
| [OECD, The State of Global Teenage Career Preparation, 2025](https://www.oecd.org/en/publications/the-state-of-global-teenage-career-preparation_d5f8e3f2-en.html) | Teenage ambitions are often narrow and shaped by background. Career conversations, workplace engagement, and experience are associated with stronger transitions. | Include familiar and less-visible related careers. End with one realistic activity and one conversation, not just a job label. Associations do not establish that this app causes improved earnings. |
| [OECD, Digital technologies in career guidance for youth, 2024](https://www.oecd.org/en/publications/digital-technologies-in-career-guidance-for-youth_c9ab23da-en.html) | Digital guidance offers access benefits but raises concerns about bias, accuracy, suitability, and fragmented navigation. | Use one journey, readable text, transparent reasons, and student override. Do not infer gender, wealth, or disability-based career limits. |

Some direct CareerOneStop pages returned 403 during retrieval; their official indexed content and the official Skills Matcher developer repository were available. No third-party descriptions were used as evidence for scoring.

## Question blueprint

These are original examples illustrating domains. They should be reviewed in student interviews before treating wording as final. Ask about one action at a time, use school/home/community examples, and avoid requiring access to clubs, expensive equipment, or paid work.

### 1. Lifestyle: a concrete starting picture

Nine components: home, transport, food at home, dinners out per week, travel, entertainment, recreation, clothing, and saving/cushion. Use friendly frugal-to-lavish choices without prices during selection. Show the final category tally, total spending, and gross income range together. Specify one adult in Austin and state whether loans and health-insurance assumptions are included.

Lifestyle should annotate suggested careers, never alter a student's interest answers. Distinguish “could cover this at entry,” “more plausible with experience,” and “likely requires changes or another income.” Do not describe these labels as statistical probabilities. Years of experience are scenarios, not guaranteed raises.

### 2. Broad interests: 30 balanced activity prompts

Use five original items per RIASEC area, spread across different settings and levels of familiarity. Example actions: investigate why something changed; make a visual explanation; teach someone a new skill; repair or assemble something; persuade a group to support an idea; organize information so people can find it.

Response scale: **Not for me / A little / Maybe / Sounds good / I'd love this / Not sure yet**. Separate neutral preference from insufficient familiarity. Do not use exam-style right/wrong feedback. Single selections can advance immediately with Back and a visible selected state; prevent double-clicks from answering the following item.

### 3. Skill, confidence, and opportunity: paired questions

For 6–8 transferable areas—explaining, interpreting information, numerical thinking, visual/spatial work, practical making, collaboration, organizing, and generating ideas—ask separately:

- “How much have you tried this?” **Not yet / A little / Several times / Often.**
- “How does it feel when you try?” A labelled five-tick confidence slider, with **Not sure yet** outside the numeric scale.
- Optional: “What have you made or done that shows this?” A short note or example.

Example prompt: “Look at information and explain what it means.” It needs no faded subtitle. Never turn “not yet” or low confidence into a low-ability score. A student can be highly interested, unpracticed, and unsure at the same time.

### 4. Values and work context: 6–10 focused choices

Values: helping, originality, independence, mastery/achievement, stability, growth/leadership, teamwork/support, and work–life boundaries. Ask students to pick several, then identify their top three rather than making all qualities equally “very important.”

Context examples: “Would you enjoy work that changes each day, a steady routine, or a mix?” “How do you feel about helping people who are worried or upset?” “Would you like to work mainly with people, information, ideas, physical things, or a mix?” Allow multiple choices where the options can coexist and retain “not sure.” Context dislikes should flag something to investigate, not diagnose incapacity.

### 5. Education and training openness

Ask “Which routes would you consider?” **College / Paid hands-on training / College plus graduate study / Still exploring**, with multiple selections. Explain the routes after a career is proposed. Do not confuse current confidence about college with eligibility, intelligence, or willingness after learning about aid. A degree can expand options without pretending it replaces a trade license or guarantees higher pay in every job.

## Broad fields before professions

Group the catalog into meaningful visual families, such as People & care; Science & technology; Design & communication; Business & organization; Making & practical work; Nature & community. Preserve multiple underlying fields within each family—medicine, dentistry, nursing, and counseling must remain discoverable without requiring the user to know RIASEC codes. Use consistent named glyphs with text labels; icons should identify work, not imply prestige or gender.

Offer three broad field cards. Each needs only: a glyph, a plain title, two recognizable example roles, one reason tied to an actual answer, and a lifestyle outlook. Keep the whole card actionable. A grouped “Other directions” area must permit replacement or comparison without starting over.

When evidence is weak, label the trio **Three directions to try**. Choose a varied starting set rather than converting “not sure” into fake preferences. Show “We need a little more experience to tell what fits” and give a concrete next activity while still allowing progression to any field. If only one or two fields have evidence, the additional cards must be labelled ideas, not ranked matches.

## Field-specific follow-up: 5–8 questions, then a short list

Use adaptive routing only after the balanced broad profile. Follow-ups are structured exploration questions, not a psychometrically calibrated adaptive test. Ask all relevant common contrasts before career-specific details; avoid choosing one famous job too early.

| Selected family | Useful contrasts | Example original prompt |
| --- | --- | --- |
| Health & care | diagnosis/research; precision procedures; ongoing patient support; mental health; rehabilitation; laboratory work | “Which would you most like to try: figure out what is wrong, do careful hands-on work, help someone recover, or study a sample?” |
| Health & care | public contact, emotional situations, clinical exposure, education duration | “Would years of study and supervised training feel worthwhile for work you care about?” Keep medicine available when the answer is uncertain. |
| Design & communication | visual problem solving; storytelling; product/spatial design; research; performance; repeated feedback | “Would you rather shape a visual idea, tell a story, or make a useful object? Pick any.” |
| Making & practical work | electrical/mechanical diagnosis; building; fine craft; field conditions; paid training; safety routines | “What sounds satisfying: finding a fault, building something solid, or making a precise finished piece?” |
| Science & technology | experiments; coding; systems; data; living things; physical processes; laboratory vs field | “Which problem would you choose to explore: a living system, a digital system, or how materials behave?” |
| Business & organization | persuading; planning; quantitative decisions; operations; people development; service | “Which part of a group project would you like to own: the idea, the plan, the numbers, or bringing people together?” |

Use task preferences to differentiate professions. Do not treat liking biology as sufficient for physician or enjoying drawing as sufficient for graphic design. Present ordinary duties and less attractive contexts as well as exciting tasks. Record willingness and uncertainty, not automatic exclusions. Give one low-risk, accessible activity to test each important uncertainty.

## Scoring and explanations: implementation guardrails

1. Version the question set, source mappings, scoring, and stored answers. Preserve old interests, notes, completed steps, and budgets when fields change. Recompute suggestions without rewriting history.
2. Maintain separate outputs for interests, stated priorities, self-rated skill, exposure, confidence, context, education openness, and lifestyle feasibility. No hidden universal “aptitude score.”
3. Require minimum evidence before describing an area as a supported interest; ignore unknown answers in means but expose coverage. Ties, all-high, all-low, and flat profiles must not produce arbitrary winners.
4. Use source-linked occupational activities and interests to build field mappings. Avoid simply choosing a field's most famous job or rewarding fields with larger catalogs. A broad-field aggregate should normalize its coverage.
5. Keep a deterministic explanation ledger: positive answer → relevant task → field/profession. Example: “You liked investigating causes and helping people. Medicine combines both. Try a clinical conversation next.” Never infer traits that were not asked.
6. State the main tradeoff alongside the positive reason: “Long study route”; “Often hands-on with anxious patients”; “Income can vary with projects.” Put detailed source/method notes behind More info.
7. Show financial context after interest reasons. A high lifestyle target must not cause the app to invent interest in high-income professions. Let the student knowingly revise lifestyle, timing, or career choice.
8. Preserve student override. Manual selection is a student choice, not evidence that the questionnaire identified a match. Revisit follow-ups after experience without invalidating earlier interests.

## Aptitude: what this flow can and cannot say

Questionnaires can ask what students enjoy, have tried, feel confident about, and want to learn. They cannot establish cognitive aptitude from confidence sliders. The [O*NET Ability Profiler was retired in 2021](https://www.onetcenter.org/AP.html); it should not be presented as a currently supported assessment. The [ASVAB Career Exploration Program](https://www.officialasvab.com/counselors-educators/asvab-career-exploration-program/) is an example of an established high-school program that includes actual aptitude testing, but has its own administration, interpretation, and data-sharing context. Do not reproduce its test or imply equivalence.

Given the user's explicit preference against exam-like screens, use optional real-world activities and observations as **strength clues**, not normed aptitude scores. If formal aptitude evidence is later desired, record the named instrument, date, score scale, and supported interpretation separately, with appropriately qualified guidance. The app should currently say “Interests, strengths & preferences,” not “Your proven aptitudes.”

## Calibration plan before making stronger claims

Perform student think-aloud interviews for comprehension and unfamiliarity; counselor review of item-to-domain mappings; balanced content review across college and non-college routes; accessibility checks; and counterfactual checks that identical answers produce identical suggestions regardless of names or demographic cues. Compare broad interest profiles with an unchanged official Mini-IP in a consented pilot, keeping its scores distinct from the custom instrument. Investigate disagreements rather than tuning every case to exact agreement.

Test medicine, dentistry, design, and trades, plus mixed, flat, all-high, all-low, and mostly-unknown answers; interested-but-unpracticed students; aversion to a work context; long-training uncertainty; and aspirational lifestyles beyond entry income. Verify every explanation against its source answers. Test field replacement, Back, reload, export/restore, and switching careers without losing notes or completed work. Automated routing tests prove consistency, not psychological validity or accurate future outcomes.

## Licensing boundary

The [O*NET Career Exploration Tools license](https://www.onetcenter.org/license_tools.html) distinguishes verbatim redistribution under CC BY-ND 4.0 from modified tools under its Developer License, which includes validation requirements. Occupational database content has a separate license. For this release, retain original reflection wording, cite the conceptual and occupational sources, and make no claim that the custom/adaptive questionnaires are validated O*NET assessments. If incorporating actual O*NET items later, use the appropriate license and follow its requirements; do not silently rewrite them for a conversational interface.
