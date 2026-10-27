# Historical questionnaire research

This document describes the original pre-0.22 questionnaire. Current official assessment and full-profile matching: [current method](./profile-method.html) and [current design](./profile-pattern-design.md).

# A deeper questionnaire, with a clear boundary around its claims

Updated October 16, 2026. Implemented in release 0.18.0, profile version 4.0.0.

## What established tools ask

O*NET's Interest Profiler asks how much a person would enjoy work activities across six RIASEC themes. Its 60-item Short Form and 30-item Mini-IP have their own development, reliability, validity, and occupational-linkage research. The manual describes item selection using coverage, response performance, and content/gender balance—not merely adding more similar questions. Its short and long forms are research products; a custom form does not acquire that evidence by using the same number of questions.

- [Official Interest Profiler formats](https://www.onetcenter.org/IP.html)
- [Technical manual, particularly chapters 3–7](https://www.onetcenter.org/dl_files/IP_Manual.pdf)
- [Official developer guidance on the 30-item versus 60-item form](https://services.onetcenter.org/reference/mpp/ip/ip_questions_30)

CareerOneStop's Skills Matcher uses 40 skill statements. Its Work Values Matcher separately sorts 20 workplace statements into importance categories and relates them to six work values. These are different questions from liking an activity. A teenager who has never had a chance to practise a task should not receive a low ability label because of limited exposure.

- [Official Skills Matcher project](https://github.com/CareerOneStop/Skills-Matcher)
- [Work Values Matcher method](https://cloudfront.careeronestop.org/Toolkit/Careers/work-values-matcher-help.aspx)
- [O*NET Content Model: interests, skills, abilities, work activities, context, education](https://www.onetcenter.org/content.html)

## What was implemented

The required lifestyle builder stays first. The profile now has **60 original interest activities**, ten per theme, covering a wider set of basic interests: physical construction, repair, outdoors, medical investigation, laboratory inquiry, computing, visual design, stories/performance, patient support, teaching, influence, customers, records, and organised systems.

Students answer likes/dislikes, neutral, or unfamiliar. Unfamiliar is excluded from averages; it is not a low rating. At least six numerical answers per theme are needed before treating the overall picture as sufficiently covered. A well-covered individual theme can still provide a starting clue when other themes are unfamiliar; the overall result stays labelled incomplete rather than erasing the known interest. A positive theme needs several liked activities, a mean of at least 3.5, and a non-flat overall pattern. These thresholds are provisional editorial rules, not validated cut scores.

Twelve practice/confidence pairs follow. Four new areas cover scientific evidence, precise handwork, collaboration, and independent learning. Practice and confidence remain separate. They do not change the interest ranking or close career doors. Values and four work/education prompts are retained. No free-text essay is required. Earlier notes remain saved, but no text analysis is implied.

Each of 12 pathway families now has **eight original multi-select follow-ups**. The first four remain stable for old drafts. Four additional questions ask about a problem to investigate, a work result, details to check, and a safe introductory experience. These are contextual variations across actual work—not intelligence questions, personality diagnoses, or questions about prestige and desired salary. The full bank contains 96 branching prompts. A student sees the eight relevant to the field they choose.

A profession needs selected connections from at least three different questions before joining the shortlist. Multiple choices on one question count once. Shared answers can support several professions; the guide says to compare them. No rule pretends to distinguish physician, PA, and NP purely from a general wish to diagnose and help people. Educational routes and legal scopes are shown for an explicit student choice.

## Calibration completed

1. Actual browser walkthroughs: medicine, visual creative work, and electrical trades. Each completed nine lifestyle choices, 60 interests, 12 practice/confidence pairs, values, four contexts, eight follow-ups, and an explicit plan choice. Full browser exports were compared with the analysis model.
2. Broad domain checks against the current O*NET occupational descriptor dataset for family medicine, graphic design, and electricians. This is a semantic sanity check, not proof of agreement with the official Interest Profiler's career algorithm.
3. Six canonical theme profiles; mixed A/I/S; all unknown; all disliked; uniform neutral; uniform high liking; modest confidence; income/education independence; one- and two-question profession clues; restoration and career switching.
4. Every reviewed career must be represented across at least three independent branch questions. All 117 remain accessible, including physician and dentist.
5. Fixes: related creative alternatives replace unrelated fillers; multi-theme field ordering reduces overly broad one-theme recommendations; organising-only profiles still reach office/business possibilities; one/two task clues no longer become suggested professions; training pay precedes qualified work; NP cards name the RN-to-graduate route; existing notes are preserved.

The medicine example yields Science & environment, Health & helping, and Technology & data. The creative example has one clear interest connection and two explicitly labelled related options. The trades example yields Trades, Transport & production, and Engineering & building. These are outputs of the disclosed fictional answers, not expected results for every student with the same career aspiration.

## What still requires real students

More questions can increase fatigue or repeat the same idea. Before claiming validated matching, conduct student cognitive interviews, test completion/drop-off and unclear wording, and pilot alongside an unmodified official O*NET assessment in a separate administration. Compare theme ordering and broad-field agreement, inspect disagreements, and obtain counselor review of the reasons shown. Do not require identical occupation lists because the methods differ.

With a sufficiently diverse sample, estimate reliability, retest stability, construct evidence, and item behavior across exposure levels and demographic groups. Use held-out cases when changing mappings or thresholds. Review whether inexperienced students receive narrower options, whether almost-identical prompts dominate a branch, and whether a single changed answer causes an implausible jump. Retire or rewrite weak items. Follow-up activity feedback can assess usefulness; career satisfaction, admission, employment, and income cannot be inferred from these synthetic checks.

This release is a research-informed guidance tool with behavioral calibration. It is **not a newly validated aptitude or predictive career assessment**.


---

# Earlier design research (historical blueprint)

The sections below describe the previous release. The current bank and method are above.

# A simpler Fieldguide: lifestyle, profile, pathways, professions

Researched October 16, 2026.

## Implemented question blueprint

- Required lifestyle builder: nine categories, with costs hidden during selection and a final monthly tally and gross-income target range. Austin, one adult; existing debt and needs are retained.
- Broad profile: 30 balanced original interest prompts (five per RIASEC theme), eight paired practice/confidence cards, one multi-select values card, four work-context/education questions, and one optional experience note. This is 44 prompt screens; single choices advance immediately.
- Three broad pathway candidates. Actual interest evidence explains suggestions. Flat, sparse, and unknown responses yield diverse starting ideas with an explicit uncertainty label. Grouped alternatives remain open.
- Four original, shared-task questions for each of 12 families (48 branching questions, 208 options). Multiple options may be chosen. An occupation earns at most one main contribution from each question. Additional specificity is only a tie-break; it is not a probability. Two different questions are needed before displaying multi-clue support. Unchecked/unknown gives no evidence, never negative evidence.
- Interest ordering remains separate from finances, confidence, education preferences, and current skill opportunity. Self-reported experience and values explain what to build on and investigate. Work preferences become a comparison checklist. None is a competence or admissions gate.
- Profession pages retain O*NET-derived work descriptions, tasks, skills, qualities, requirements, education, realistic pay, and Austin lifestyle comparisons. One action creates the current plan; earlier actions and notes stay.
- Separate career library: college and non-college sections, independent profiles and salary illustrations, saved reading, and reading notes. These do not modify the guided answers, recommendations, finance, or personal plan.

## Interpretation and quality limits

The custom questions and editorial mappings are research-informed exploration tools. They are not the O*NET Interest Profiler and do not inherit its reliability, validation, norms, or ability to predict outcomes. Aptitude is displayed as unmeasured unless a separate source-checked ability result has been recorded. Confidence is not a proxy for ability. The choice of three cards is a navigation decision, not a scientifically established number of best matches.

Before claiming a validated assessment, a separate empirical programme would need student cognitive interviews, readability/accessibility review, pilot data, reliability and dimensionality studies, test-retest evidence, subgroup fairness checks, and construct/criterion evidence. The current release is checked for understandable navigation, data preservation, source attribution, and sensible synthetic response patterns.

Financial labels retain their existing source scopes: regional entry-wage proxies, later illustrations, employer training examples, school-specific cost references, and editable spending baskets. The new research does not establish future salary or admission probabilities.


---

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

---

# From broad interests to professions: question design

Research checked October 16, 2026. Prepared for the new lifestyle-first guided flow. The question examples below are original editorial proposals, not items from a validated instrument. The matching rules and question counts are design recommendations requiring student usability work and calibration.

## What the research supports

O*NET separates interests and abilities from skills, knowledge, education, experience, tasks, and work context. Keep these dimensions separate in the student's profile. Occupational ability requirements describe work; they do not establish a student's ability. The app already has sourced O*NET 31.0 descriptors in `occupation-essentials.js`, so a new question bank should point to those descriptors rather than invent a personality-to-job lookup. [O*NET Content Model](https://www.onetcenter.org/content.html), [O*NET database](https://www.onetcenter.org/database.html).

The official Interest Profiler has 30- and 60-item forms and describes work-activity preferences across six RIASEC interests. It supports educational planning and exploration. Its reliability and validity evidence belongs to the instrument, not to any shortened, rewritten Fieldguide questionnaire. Using the official instrument unchanged is the clearest route to a validated interest component; keeping original conversational questions is possible if they are explicitly presented as reflection. [Interest Profiler overview](https://www.onetcenter.org/IP.html), [Interest Profiler Manual](https://www.onetcenter.org/dl_files/IP_Manual.pdf).

The manual discusses unsure answers as meaningful: they can identify unfamiliar activities to explore, rather than forcing a like/dislike decision. The interface should therefore retain an explicit unknown response and treat missing data separately. Interest scores can guide hands-on exploration; they should not become admission decisions or a claim of competence. [Interest Profiler Manual, chapters 3–4](https://www.onetcenter.org/dl_files/IP_Manual.pdf).

CareerOneStop presents interests, skills and work values as complementary sources for career ideas. A self-rating of a skill is useful evidence to discuss, but it is not a standardized demonstration of aptitude. [CareerOneStop career-ideas guide](https://cloudfront.careeronestop.org/HowTo/Findcareerideas/find-career-ideas.aspx), [Work values](https://cloudfront.careeronestop.org/ExploreCareers/Assessments/work-values.aspx).

If reproducing/adapting an O*NET assessment, follow its tool-specific license, attribution and adaptation conditions. Occupational database licensing and assessment-tool licensing are separate. Do not brand an original quiz as the O*NET Interest Profiler. [Career Exploration Tools license](https://www.onetcenter.org/license_tools.html).

## Existing app observations

The current app has 12 broad families, 34 fields, and occupation records with tasks, skills, abilities, specific interests, preparation, and regional pay. This is enough to build a coherent broad-to-specific flow without adding another competing navigation layer.

`matching.js` currently makes second-stage choices primarily from the first plain-language task of each occupation (`work:career-id`). This risks selecting a title indirectly from one attractive activity and losing the rest of a normal workday. It also makes a broad task serve as a near one-to-one title selector. Replace this with shared family task/context questions plus a short reality check. Several professions should link to each task, and each profession should require several distinct supporting clues before it is called a strong direction.

Current family themes can over-identify health with Social and science with Investigative. Dentistry has important Investigative, Realistic and Social connections; a student drawn to precise hands-on work should still reach it even without a dominant helping theme. Broad-family eligibility should use several independent activity clues and explicit student choices. [General dentistry profile](https://www.onetonline.org/link/details/29-1021.00).

A reachability audit also found `psychiatric-aide`, `psychiatric-technician`, and `clinical-psychologist` have empty `pathIds` in the current 117-occupation catalog. They do not enter any family's eligible list despite existing profile records. The proposed health question bank includes them, but the app owner must also attach their appropriate health/social-support paths so students can actually reach them. Do not treat JSON question coverage alone as guided-navigation coverage.

## One guided sequence

1. **Picture your life.** Required completion of the lifestyle builder. Show the tally after all categories, with an estimated gross-income range. Do not use this to exclude careers from the interest profile.
2. **Discover what draws you in.** A balanced broad-interest component, then a short skills/experience and values component. Show one short conversational prompt at a time. Clearly distinguish choosing an answer from having tried the activity.
3. **Three directions to explore.** Present three candidate family cards with two specific answer-based reasons each. Student can keep, replace, or add another field from related groups. With weak/flat/unknown evidence, label the cards “Starting points to try,” not “best matches.” Three cards are a product layout decision, not a research-based number of true matches.
4. **Find your kind of work.** Ask task/context questions only for the student's retained families. A mixed-interest student can answer a small balanced set across two or three families instead of doing three entire questionnaires.
5. **Explore professions.** Three suggested occupation cards, grouped by family, with other roles always reachable. Each card shows everyday work, why it connects, education route, early pay, lifestyle compatibility, and a specific open question to explore.
6. **My plan.** Pick a current focus and retain alternatives. Education, paid training, qualified pay, lifestyle, notes and completed steps remain in one plan. Revisions should update the current focus without erasing earlier work.

Back navigation must restore previous answers. A single-select response can advance immediately; multi-select questions need a clear “Next” action. Avoid forced choice between equally appealing activities. Never auto-advance a slider while it is moving.

## Separate the profile dimensions

| Dimension | Ask | Use | Do not infer |
| --- | --- | --- | --- |
| Interest | “Would you enjoy learning to do this?” | Broad families and shared task affinities | Skill or aptitude |
| Experience | “Have you tried something like this?” | Interpret uncertainty and suggest accessible activities | Disinterest from no opportunity |
| Skill evidence | “Which have you done?” and optional concrete example | Strengths to build on; preparation and support | Normed proficiency from confidence |
| Confidence | “How comfortable would you feel trying it with help?” | Encouragement, scaffolding, first steps | Eligibility for a profession |
| Values/context | People, setting, variety, predictable schedule, autonomy | Tradeoffs and questions to investigate | Permanent personality type |
| Aptitude evidence | Optional results from a suitable administered assessment; source/date/context | Discuss alongside school work and experience | Diagnostic labels from an original micro-task |
| Lifestyle | Chosen spending/savings picture and income band | Separate affordability comparison at career stages | Interest, status, ability or worth |

Suggested broad skill examples: explain a difficult idea; compare evidence; plan a small project; make and revise a visual idea; find and fix a practical problem; check a set of details. Use accessible school/home/community examples. Record “I haven't had a chance” separately from “I tried it and need support.”

Actual aptitude cannot be measured by asking whether a student is good at math or likes puzzles. If the user wants an aptitude component, select an age-appropriate established instrument with suitable administration and interpretation. Optional app activities can reveal learning preferences and generate notes, but should be labeled practice experiences, with no ability percentile or career rejection.

## Original family question examples

The implementation-ready companion is `research/profession-question-bank.json`: 12 family IDs, four original questions per family, 208 positive-evidence options. Every existing guided occupation is mapped to at least one option. All career IDs were checked against `occupation-data.js`; all families against `guide-state.js`. This is a structural/content coverage check, not validation of predictive accuracy.

Implementation rules for this bank:

- Questions are multi-select. Add one separate “Not sure yet” action that advances without awarding or subtracting occupation evidence. An unchecked option is unknown, not a dislike. If “Not sure yet” is selected after options, ask to replace the options or clear them consistently.
- Some options legitimately point to one distinct occupation; others point to shared work across several. Use positive evidence across distinct questions. Do not reward an occupation merely because it occurs in more options or because a student selects several overlapping options in one question. Cap each occupation's evidence at one contribution per question and compare against its applicable question count.
- Do not claim certainty from four questions. Use two or more independent clues for answer-based reasons. Present a tie as a tie; all-high/all-unknown patterns are broad/limited evidence.
- Keep an additive reason trace of selected option IDs and wording. Never infer a student has a skill from selecting an attractive task.
- Use per-family breadth and student choice to retain alternatives. Shorter education, higher pay and college status are separate context, not interest-ranking bonuses.
- Review body-art/studio and clinical questions as interest in future supervised learning. Do not generate activities that ask a teenager to perform regulated work.

Bank sources: task categories are original paraphrases informed by O*NET descriptors already in `occupation-essentials.js` and `career-language.js`. Profile URLs follow `https://www.onetonline.org/link/summary/{SOC}` using each mapped occupation's existing SOC. The Content Model supports the task/context distinction; it does not validate these original items. Profession-specific clinician, designer and electrician sources are linked below.

The table supplies three useful question types per family. Each row is a bank, not three mandatory screens. Ask the activity question first; use the discriminator/context question where it meaningfully separates the leading occupations. Every multi-select offers “Not sure yet.” Response choices below are abbreviated examples; each item needs its own versioned links to occupations and sources.

| Family / icon idea | Shared task question | Profession discriminator | Workday reality question |
| --- | --- | --- | --- |
| Design & creativity / pen nib | “What would you enjoy making: a visual message, a useful object, a story, or a performance?” | “Which revision sounds interesting: clearer type and layout, a better product model, stronger words, or a better-paced scene?” | “How do you feel about changing your idea after a client or teammate gives feedback?” |
| Technology & data / connected nodes | “Would you rather build an app, investigate data, protect information, or help someone fix a tech problem?” | “What sounds satisfying: finding a software bug, testing a security weakness, explaining a data pattern, or improving how systems connect?” | “Would you enjoy spending time testing small details when the first solution doesn't work?” |
| Health & helping / heart plus pulse | “Which work draws you in: investigating symptoms, hands-on procedures, ongoing patient care, movement and recovery, or emotional support?” | “Which would you like to learn about: diagnosing across the whole body, treating teeth and gums, using medical imaging, guiding rehabilitation, or counseling?” | “How would you feel about learning to work closely with patients, keeping careful records, and following infection-control procedures?” |
| Business & law / compass and briefcase | “Would you enjoy understanding a business, organizing a team, working with financial records, or making a case for someone?” | “Which problem would you explore first: costs that don't add up, a project running late, customers' needs, or a question about someone's rights?” | “How do you feel about explaining a recommendation when people disagree or the evidence is incomplete?” |
| Science & environment / leaf and flask | “Which would you investigate: living systems, materials, Earth and water, or how to care for land and plants?” | “Where would you like to gather evidence: a laboratory, a field site, a computer model, or a farm or natural area?” | “Would you enjoy repeating a procedure carefully and recording results even when the answer takes time?” |
| Engineering & building / structure and gear | “Would you enjoy designing a machine, an electrical system, a building, or roads and water systems?” | “Would you rather test a prototype, work through technical calculations, plan spaces for people, or coordinate how something gets built?” | “How do you feel about revising a design to meet safety rules, budgets, and real-world limits?” |
| Trades & technical repair / wrench | “Which systems would you like to understand: electrical, heating and cooling, water and pipes, vehicles, or wood structures?” | “What sounds satisfying: tracing a fault, installing a new system, measuring and building, or maintaining equipment before it fails?” | “How do you feel about learning detailed safety routines and doing practical work in changing locations?” |
| Food, hospitality & personal care / plate and spark | “Would you enjoy preparing food, welcoming guests, planning an event, helping with personal appearance, or caring for a place?” | “What would you like to improve: a recipe, a guest's experience, a haircut or style, or how a busy service team runs?” | “How do you feel about serving people during busy periods, including some evenings or weekends?” |
| Teaching & learning / open book | “Would you enjoy explaining ideas, planning learning activities, coaching a skill, or helping someone overcome a learning barrier?” | “Who would you like to work with: young children, school-age students, teenagers, adults, or a mix?” | “Would you enjoy trying a different explanation when someone doesn't understand the first one?” |
| Safety & emergency response / shield and beacon | “Would you enjoy responding to an emergency, preventing hazards, investigating an incident, or helping people follow safety rules?” | “Which team would you like to learn about: emergency medical care, fire response, public safety, or inspection and prevention?” | “How do you feel about learning to stay organized in urgent situations and carefully documenting what happened?” |
| Transport & production / route and cog | “Would you enjoy moving people or goods, operating equipment, making products, or checking quality?” | “Would you rather plan a route, keep deliveries organized, run a production process, or find why a product doesn't meet its requirements?” | “How do you feel about following safety checks and doing some repeated tasks accurately?” |
| Sales, office & customer support / speech and checklist | “Would you enjoy helping someone choose, solving a customer problem, organizing schedules, or keeping records accurate?” | “Which sounds satisfying: explaining options, calming a frustrated customer, coordinating appointments, or finding a missing detail?” | “Would you enjoy switching between people's requests while keeping a clear record of what you did?” |

The activity/context distinction comes from the O*NET Content Model; the wording, grouping, branching, and icon suggestions are original editorial design. Family mappings should be many-to-many. For example medical device engineering belongs under engineering and health-related technology; scientific illustration can connect creative work and science. Do not force every interest into a single industry.

## Important branches to get right

**Medicine and dentistry.** Family medicine centers on diagnosis, treatment, prevention, history and tests across stages of life. General dentistry combines oral diagnosis, procedures, fine hands-on work, prevention and patient communication. Show both from shared science/care interests; ask about the work rather than prestige, income, blood aversion or confidence as a gate. Student-facing “precise hands-on work” is interest in learning that activity, not evidence of dexterity. [Family medicine](https://www.onetonline.org/link/details/29-1215.00), [General dentistry](https://www.onetonline.org/link/details/29-1021.00).

**Creative work.** Graphic design needs visual communication and revision for an audience, not just enjoying drawing. Compare message/layout, product function, moving image, words and performance. Portfolio work generates evidence and a next step; a student without expensive software can start with paper or free tools. [Graphic designers](https://www.onetonline.org/link/summary/27-1024.00).

**Trades.** Compare systems and work processes: diagnosing, installing, maintaining and constructing. Safety, drawings and careful troubleshooting are part of electrical work. Do not conflate all practical interest with low college interest; retain engineering and technical-college bridges where relevant. A hands-on experiment for a teenager should use a safe model or observation rather than live electrical, clinical, vehicle-lifting or other regulated work. [Electricians](https://www.onetonline.org/link/summary/47-2111.00).

**Common jobs.** Sales, customer service, administration, food preparation, driving, warehousing and production need visible shared-task questions, not just a list hidden under “other.” Check service orientation, detail checking, schedules, practical systems and communication independently; these roles are not interchangeable. Use current O*NET tasks already stored in the app, with linked official profiles. [Retail sales](https://www.onetonline.org/link/summary/41-2031.00), [Customer service](https://www.onetonline.org/link/summary/43-4051.00), [Administrative support](https://www.onetonline.org/link/summary/43-6014.00).

## Transparent ranking proposal

This is a proposed editorial model, not a validated prediction. Keep a trace of the question IDs and response values that support every card.

- Broad stage: use balanced activity evidence to propose families. Do not let one RIASEC high point or one “helping” answer determine the family. Explicit student additions override a low or missing questionnaire link.
- Profession stage: compare shared task preferences plus relevant work-context preferences. Normalize for how many applicable questions each occupation receives. Otherwise a broad occupation with more mappings can win mechanically.
- Stronger evidence means agreement across several distinct prompts, not the same activity repeated with different wording. Unknown answers contribute no negative points.
- Show “Connects with your answers” when at least two independent task clues support an occupation. Use “Worth trying” for thin evidence. Avoid a precise match percentage or implied probability of career success.
- Show a counterpoint as “Something to explore”: e.g., “You enjoy visual problem-solving. This role also involves revising work for clients.” Do not describe an ordinary professional requirement as a student weakness without evidence.
- Confidence changes the recommended first activity, not the career ordering. Self-reported current skills create a preparation sidebar. A low academic result may justify support or discussion; it should not erase a profession.
- Compare each profession's paid training/entry/5/10/20-year scenarios with the saved lifestyle band separately. “May support this later” differs from “Supports this at entry.” Do not use lifestyle as a stealth interest score.
- If evidence is flat or mostly unknown, still show three editable starting points and an accessible next activity. No return of the removed separate exploration-plan screen is needed.

## Result-card copy patterns

**Physician:** “You chose investigating symptoms and explaining care. Family medicine combines both.” Open question: “Would you enjoy ongoing patient care as well as diagnosis?” Education: college → medical school → residency. Keep resident income distinct from qualified practice pay.

**Dentist:** “You chose careful hands-on work and patient care. Dentistry brings those together.” Open question: “Would you enjoy learning precise procedures in a close patient setting?” Do not imply liking drawing proves manual competence.

**Graphic designer:** “You enjoy making ideas clear through images and improving a draft.” Open question: “How do you feel about several rounds of client feedback?”

**Electrician:** “You chose tracing faults and understanding practical systems.” Open question: “Would you enjoy learning drawings, safety procedures and hands-on installation?”

**Mostly unsure student:** “These are three places to start. You can swap any of them.” Each card gets a short “Try this” activity and no best-match badge.

## Calibration and usability scenarios

1. Science + patient explanations + broad diagnosis → physician visible; dentist, nursing and allied-health comparisons reachable. No automatic preference for highest pay.
2. Health + precise procedures + oral-health curiosity → dentist visible. Fine-motor self-rating unknown must not suppress it.
3. Visual messages + revision + audience → graphic design rises; drawing alone should also leave visual art and design alternatives.
4. Practical faults + electrical systems + safety routines → electrician rises; engineering available as an alternative. College preference does not erase training routes.
5. Creative + health mixed → preserve both families and both sets of answers. Ask one discriminator from each rather than making the student repeat all broad prompts.
6. High interest + low confidence/no experience → same career visibility; gentler first activity and support option. No “poor fit” label.
7. All unknown → no winner, no fake aptitude findings. Three neutral editable starting points with explicit limited-evidence wording.
8. All low → do not label the least disliked profession a best match. Ask about an activity outside the supplied bank and retain all families.
9. All high/tied → use values and task differentiation; do not silently break ties by data order, salary, college status or career popularity.
10. Luxury lifestyle + artistic interests → preserve artistic recommendations and show separate financial tradeoffs. Switching lifestyle choices must not rewrite interest conclusions.
11. Customer requests + detail checking + organizing → customer service and administrative support appear, with retail and project coordination distinguished by tasks and preparation.
12. Student adds a nonrecommended family → it receives the same profession questions and full plan capability as a recommended family.
13. Graphic design → medicine switch → current education/pay/lifestyle context updates; earlier answers, notes, dates and completed activities persist.
14. Return after a practical activity → retain original answer history and record updated interest with a date. Avoid interpreting a single enjoyable task as proven professional aptitude.
15. Reorder card/source arrays → the same answer pattern must not change substantive candidate groups except disclosed tie handling.
16. Keyboard/screen reader/mobile checks → cards have text labels alongside glyphs, selected states are announced, sliders have meaningful labels, and single-selection advance has a working Back action.

Content validation needs counselor/occupation-expert review, student cognitive interviews, and comparison with an established assessment used appropriately. Code tests can verify branching, coverage, invariance, preservation and financial separation; they cannot establish psychometric validity. Record actual usability observations separately from synthetic persona checks.

## Recommended implementation priorities

1. One lifestyle-first step rail, one questionnaire, one three-direction review, one profession branch, one personal plan.
2. Shared source-linked task/context bank for all 12 families; never a one-question profession verdict.
3. Traceable answer-based reasons, explicit uncertainty and independent lifestyle compatibility.
4. Keep full catalog/search inside the grouped “Choose another field” view, avoiding parallel home flows.
5. Establish a content review ledger: prompt version, construct, mapped field/occupations, source URLs, reason template, unknown treatment and calibration cases.
