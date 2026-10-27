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
