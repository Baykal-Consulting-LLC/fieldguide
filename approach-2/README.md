# Fieldguide — Approach 2: College Pathways

Independent exploratory prototype, created October 22, 2026.

- **Approach 1: Career Explorer** remains in `../site`, with no edits or builds performed there.
- **Approach 2: College Pathways** lives entirely here, uses its own copied source data and has no runtime imports from Approach 1.
- Separate Sites project, URL and source repository. New publication remains owner-private.
- Current browser draft key: `fieldguide:approach-2:college-pathways:v3`; earlier v2 and v1 drafts require explicit adoption and remain untouched. No Firebase integration or shared student accounts. Source contains no private student records.

## Run independently

Node.js and Python 3. The v0.16 recording runtime uses the retained Sites Vinext starter under `runtime/`; install its locked dependencies with the Sites installation helper before the first build. A static-only preview (`npm run dev:static`) can browse the interface but cannot record shared activity.

```sh
npm run dev
```

Open http://127.0.0.1:4174. Approach 1 independently uses its existing development command and port 4173. Stopping, editing or rebuilding one app does not require the other to run.

```sh
npm run build
npm test
npm run verify:approach1
```

The last command verifies this app’s shared pin and runtime boundaries. It does not freeze Approach 1. The original separation archive remains historical evidence in `../outputs/approach-2-baseline-2026-10-22/`. For the lifestyle integration, the unchanged Approach 1 runtime modules and configuration were separately fingerprinted in `../outputs/approach-2-lifestyle-2026-10-22/approach1-before.json`.

## Current release 0.16.0 · suggestions and recorded choices

The same owner-private Sites project now runs a Vinext Worker with a D1 recording store. Existing static app assets and managed shared files remain under `dist/`; `runtime/public/`, `runtime/dist/`, and `dist/server`, `dist/client`, `dist/.openai` are generated outputs. The source hosting manifest is authoritative. No Approach 1 files, runtime, data or deployment are changed.

- `#/statistics` reads aggregate counts from `/api/statistics` on demand. Real journeys, fictional samples and QA are separate; the historical 2,000-profile study is never pooled with observed activity.
- Displayed suggestion lists, pathway opens, shortlist add/remove actions, program connections opened, career details opened, and explicit program/career Save to my plan actions are recorded. Imported existing options are baselines, not new actions or attributed conversions.
- An opaque draft journey ID is distinct from a verified person. The recording API authenticates writes with Sites request identity, stores its hash only for ownership, and accepts only known pathway/CIP/O*NET connections. It does not receive names, email, assessment answers, subject responses, budgets or notes. No connector or external analytics provider is involved.
- Revisioned current-choice states resist late offline events and removals/resets; event IDs deduplicate retries. A bounded browser outbox retains unacknowledged actions and reports offline, authentication and storage problems. A quota fallback remains in the tab and is not promised durable across reloads.
- New program/career choices are part of the protected v3 draft and full-draft export. Older v0.15 tabs continue writing only v2. The v1 fallback is adopted only when no v2 draft exists, and adoption refuses either earlier key changing during review.
- The statistics API returns aggregates only, relying on this Site's existing owner-private access boundary. Keep that audience when publishing this release. Local dev uses the starter's loopback-only test sign-in; production uses Sites authentication.

`npm run build` performs syntax checks, stages app assets, builds the nested Sites runtime, and copies its Worker/asset/migration artifact without deleting app source. `npm run dev` stages assets through the shared lease and then serves the runtime on port 4174. Apply each generated local migration once using the starter's local D1 command; production migrations are applied by Sites publication. Do not replay applied migrations or modify their history.

## Experience and scope

Six broad areas → 36 editorial study pathways → official CIP program categories → optional occupation examples. Shortlist up to three pathways, compare coursework and preparation, then create notes and actions without selecting a career. Includes the unchanged official 60-item O*NET Interest Profiler and clearly labeled fictional six-score demonstrations. No claim of aptitude or predictive validity.

All 1,016 O*NET occupation records retained, 923 with interest vectors. All 829 occupations meeting the disclosed college-exploration rule are grouped: 825 with official CIP connections and four with separate, explicit BLS-based editorial connections. All 8,501 official CIP–O*NET rows are covered; 187 other titles remain accessible in source lookup. Pathways overlap intentionally. This is complete coverage of a defined policy and pinned sources, not a claim that every possible college destination is known. Program categories within a pathway can require different degrees or credentials. Specific graduate, licensed and experienced destinations are called out, not represented as equivalent to an undergraduate degree.

Pathway ranking is an editorial weighted mean of the student's six interest scores. It does not depend on the count of linked occupations. Weights, incomplete/flat handling and limitations are disclosed in the About page and tested. Career illustrations are ordered for readability, not ranked as student career matches. A route's program filter only shows its own official links.

The prototype includes Approach 1’s nine-question lifestyle builder, editable monthly budget and income-target solver. It still omits named college programs, tuition calculations, verified jurisdiction-specific licensing and degree-specific graduate earnings. It is a test of exploration structure, not a replacement release. No Approach 1 cohort engine was rebuilt or historical benchmark changed. Full comparative student/cohort evaluation remains future work.

## Independent data snapshot

Copied O*NET 31.0 CSV source snapshot from October 16, 2026 in `.cache/onet31` (ignored by Git). Official education crosswalk downloaded October 22, 2026 from https://www.onetcenter.org/crosswalks/cip/Education_CIP_to_ONET_SOC.xlsx (July 2024 update, 2020 CIP / O*NET-SOC 2019).

`python3 scripts/build-data.py` uses **only this folder's cache**. It builds public descriptors and source hashes under `dist/data/`, and keeps full imported tasks, ratings, education, training and context locally in `.cache/occupations-full.json`. For a fresh clone, acquire the original source tables at the URLs in `dist/data/sources.json` and place them under `.cache/onet31` before regenerating. The deployed application already contains all data needed to run and does not need the cache.

O*NET database: CC BY 4.0, attributed to USDOL/ETA. Interest Profiler: CC BY-ND 4.0; original item wording, response labels and raw score calculations retained. Editorial program groupings and study suggestions are separate from official source data. Source data availability varies by occupation.


## Lifestyle release 0.2.0

The primary flow can begin with `#/lifestyle`, then the existing interest profiler, college pathways, comparison and a study plan. Browsing and the profiler remain accessible without completing a budget. All nine original questions and five-option baskets, including housing ownership, are preserved. A review step exposes the monthly assumptions, health budget, retirement, debts and ownership/vehicle upfront costs. Manual edits save as an unconfirmed draft until the user confirms again. Blank or invalid inputs do not become zero or a financial goal.

The confirmed goal appears alongside pathways, shortlists, comparisons and next steps. It does not enter pathway interest ranking or filter any pathway. No single wage is assigned to a major. A future-life goal is distinct from the cost of attending college. Whole-draft exports now explicitly identify that lifestyle data is included; no automatic transfer into Approach 1 or the interest interchange format occurs.

Public shared release **1.1.0** added the exact original `financial-math.js`, `lifestyle.js`, `lifestyle-builder.js`, their provenance, and the unchanged income-target function extracted without career dependencies. These are managed under `dist/shared-lifestyle/`; edit canonical source and adopt a new release rather than modifying them locally. Only Approach 2 adopted this additive release; its current pin is 1.2.0, which retains those exact bytes. **Approach 1 stays pinned to 1.0.4**, with no source edits, build or publication, because the user explicitly required it unchanged. This deliberate split is recorded in `../shared-foundation/validation/lifestyle-import-plan.json`; the coordinating Approach 1 session acknowledged it.

`lifestyle-state.js` and `lifestyle-ui.js` are Approach 2-owned adapters. Existing v1 answers, shortlist and notes migrate without replacement. Lifestyle inputs are stored only under the existing Approach 2 browser key and are included only in a user-selected full-draft export. The source model is a dated 2026 single-adult Austin planning illustration with editable spending assumptions, not current market quotes, personal tax advice or salary predictions.


## Earnings & lifestyle release 0.3.0

Every pathway has a financial lens in browsing, its detail page, shortlist comparison and next-step plan. No profession is selected. Selected examples show separate 2025 Austin metro lower-paid-worker averages (TWC entry wage = lowest-third mean) and all-worker medians. Their min/max spans are explicitly illustrative, not representative degree earnings, starting offers, a probability or a progression over time. A confirmed lifestyle goal adds budget coverage and 20% breathing-room counts. The Earnings & my lifestyle detail tab also shows monthly surplus/shortfall after the same tax, health, retirement, spending and cash-saving model; retirement caps and upfront ownership costs remain explicit. Editing a budget withholds comparisons until reconfirmed.

129 selected pathway examples across 110 unique wage groups are tied to exact CIP-linked base O*NET records and BLS typical preparation. BLS graduate/professional education, stricter existing reviewed credential notes (including RDN eligibility), and related-experience requirements put destinations into separate sections, excluded from qualifying-route spans. Different program/credential routes remain explicit. Eight selected examples lack Austin annual wages; zeros/missing figures remain unknown and there is no geographic fallback. Annual full-year employee wage scenarios do not model variable hours, self-employment, future wage growth, tuition, aid or future loan debt unless entered by the student.

`npm run data:earnings` reproducibly builds `dist/data/pathway-earnings.json` from the pinned public references and app-owned selection file. The output includes source fingerprints and method; `artifacts/earnings-data-audit.json` records bounded join, grain and missingness checks. The generator fails on missing exact program links, duplicate SOCs or missing detailed preparation. It does not change interest ranking, official assessment, stored answers or any Approach 1 files.

Additive shared release **1.2.0** contains BLS Table 1.2 typical education, experience and training metadata (831 detailed occupations plus 281 source summary rows), collected from the official HTML table on October 23, 2026. Only A2 adopts it: the user explicitly requires A1 unchanged. A1's owner acknowledged the exception; A1 stays on **1.0.4** and received no build, adoption or publication from this work. Source metadata is canonical under `../shared-foundation/source/education/bls-preparation-2025.json`; the generated A2 consumer is managed, never hand-edited.


## Sample student journey 0.4.0

Open `?v=0.4.0&journey=sample#/journey` for Jordan’s complete fictional replay: nine lifestyle choices, confirmed editable budget, all 60 invented O*NET responses and six calculated raw scores, live pathway suggestions, a three-pathway comparison and a next-step plan. Guide links open the actual lifestyle, profiler, pathway, comparison and plan screens. All steps are prefilled for a completed example; a visitor may inspect or change responses. A dedicated profiler summary exposes every response without making the visitor click all 60 questions.

The student story and selected shortlist are editorial fiction, not validation evidence or measured student outcomes. The initial shortlist includes software and electrical engineering plus a deliberately retained design alternative; it is not described as the engine’s top three. Suggested pathways, budgets and earnings summaries use the existing engines without shared-source edits or a new reference pin. Wages remain selected occupational examples and dated Austin illustrations.

Sample mode is explicitly labeled throughout and is memory-only. It does not read or write the normal Approach 2 localStorage key. A reload restores the original fictional draft; the exit link opens the visitor’s own draft. Exports explicitly mark fictionalSample and sampleStudent, and restarting the sample affects only the in-memory fixture. Existing personal drafts, normal storage behavior and Approach 1 remain unchanged.


## Optional subject reflection 0.7.0

The app-owned eight-question Fieldguide subject/course/project reflection lives at `#/subjects`. It is separate from the unchanged official O*NET instrument and is not a validated assessment. Students can select up to two choices, be unsure, skip, pause, review or clear only this reflection. Existing v1 drafts migrate without changing their other data.

Current choices separate language/history, law/public policy, business, creative work and religious study. At least two questions with current pathway-connected choices are required. Each connected question contributes at most one connection per pathway; broad-interest order breaks ties (alphabetically without a usable interest profile). Subject starting points require at least two question connections and may contain fewer than four pathways. A largest tie spanning more than four pathways defers subject ordering unless explicit mixed-area evidence supports a balanced set.

Mixed-area evidence requires at least two questions with paired current choices, each linked entirely to a different single study area. The two most-supported areas (area ID breaks ties) can each contribute up to two repeatedly connected pathways. This is a disclosed editorial exploration rule. Students can compare broad interests only and resume their subject lens without clearing answers. Earlier broad answers retain their exact IDs and labels for review, but are not silently interpreted as narrower choices. All 36 pathways stay available. Neither official interest scores, earnings, lifestyle nor the shortlist is changed. Every current editorial mapping is inspectable on About.

The paired fictional diagnostic replay is in `../outputs/approach-2-fictional-study-0.7.0/`: 13 frozen scenarios, separate exact-answer migration and explicitly clarified-choice replays, three additional authored checks, and all eight mixed-interest omission checks. These are authored diagnostics, not independent validation or observed student outcomes.

Pathway details and three-way comparison include actual selected-subject connections, illustrative course areas and a stretch to try. The Jordan sample has an explicit button to load new fictional subject choices; its original lifestyle, 60-item answers and story shortlist are preserved. Sample edits remain memory-only.

See [the small usability pilot guide](docs/subject-reflection-pilot.md). No real student pilot has been run for this release. Actual college program requirements, time and net costs remain a later phase.

## Expanded college exploration 0.5.0

The main screen starts with six broad areas and, after a complete differentiated interest profile, four suggested starting points. Opening an area reveals a manageable set of its 36 study pathways; the entire pathway list remains available on request. All previous pathway IDs, v1 browser drafts, shortlist, notes, lifestyle model and official assessment are preserved. Added pathways cover other engineering disciplines, applied technology, construction, transportation, public service, legal study, broader health services and professional care, human sciences, religious leadership and interdisciplinary study.

**Inclusion rule:** an exact official CIP education-program connection OR BLS typical entry education of some college, a postsecondary nondegree award, associate, bachelor’s, master’s or doctoral/professional degree. This inclusive editorial exploration policy covers college certificates and technical programs as well as academic degrees; some occupations also have noncollege routes. BLS is joined at the detailed six-digit SOC, with that broader mapping disclosed for specialties. Four occupations without direct CIP links receive reviewed editorial study connections: short-term substitute teachers, tutors, patient representatives and sales engineers. Their links are never inserted into a program’s official results. Unknown preparation remains unknown.

`scripts/pathway_coverage.py` owns policy, added study families and the four explicit fallback connections. `scripts/build-data.py` emits `dist/data/coverage.json`, which accounts for all 1,016 titles, all inclusion reasons, pathway assignments and source-only exclusions, plus source hashes. Every eligible occupation must have a pathway; all 8,501 official crosswalk pairs must survive. No shared source or release was modified. The public coverage method and full JSON are available from About.

Career possibilities initially show four examples, with 20 more on request and a preparation filter. Large program lists start with 12 choices. Residency and fellowship categories are separated as later professional training. Published occupation records now carry sourced typical-preparation metadata and explicit stage/basis labels, alongside selected O*NET descriptors. These are not licensing determinations. New pathways include selected local earnings examples: 168 pathway illustrations across 143 wage groups in total, with ten unavailable annual-wage examples retained as unknown. Existing 26-pathway earning selections and Jordan’s budget/shortlist outcomes are preserved.

Verification includes independent reconstruction of the CIP spreadsheet join, coverage reconciliation against the pinned BLS table, direct/editorial link separation, progressive disclosure, old-draft preservation, unknown values, earnings staging, official assessment and lifestyle regressions. Approach 1 was not edited, built, updated or deployed.

## Reliability release 0.8.0

One current directional subject answer now keeps every connected pathway visible as a separate, alphabetical clue collection. It does not change broad-interest starting points or lower the two-question subject-ordering guard. The page identifies the basis of its starting points and may offer one relevant unanswered question; opening it selects nothing. Unknown, general-reasoning and legacy broad options do not create narrow clues. Pausing the subject lens keeps answers and hides subject clues.

`#/subjects/review` derives a short review list only from selected retired broad choices. Each question retains its exact earlier label until explicitly edited. Students may keep an answer, continue later, replace it, or mark unsure/skipped. Only explicit actions change answers; there is no new saved-state schema or automatic preference conversion. Official answers/scores, lifestyle, shortlist, notes, financial evidence and grouping remain unchanged by this release.

The separate reproducible study is `../outputs/approach-2-fictional-study-0.8.0/`. All 13 full profiles, 82 single-answer omissions and three additional authored cases retain v0.7 ranked results. Nine of nine focused rubrics still show at least two expected directions, eight show every expected direction. These are authored diagnostic results, not student accuracy. All 64 current directional options selected alone retain all their mapped clues; 12 legacy-bearing questions across five fictional profiles can be explicitly reviewed without changing unrelated answers. The 66 regression checks include six new reliability tests. The existing local results board adds a separate v0.8 reliability view and keeps earlier comparisons.

## Question and mapping challenge 0.9.0

A frozen 50-case authored challenge now covers one focused case per pathway, eight mixed-interest cases and six behavioral cases. 38 cases were used for development; 12 were executed after the candidate source was frozen. Both sets were authored by the implementing agent and are not independent counselor validation. Results and reproducible notebook live in `../outputs/approach-2-pathway-challenge-0.9.0/`; previous study folders remain frozen.

The subject lens now also preserves distinct directions explicitly chosen together in at least two questions when the existing two-broad-area rule does not apply. The intersections must yield disjoint groups, and reserved pathways still need at least two connected questions. This fixes broad-area boundary losses without changing official scores, the sparse-answer guard or saved draft schema. Full ordering and deterministic tie rules are disclosed in About.

Two additional project choices cover designing a learning activity and comparing community-service access; one practice choice covers hospitality/service planning. These distinguish previously identical education/social and management/hospitality subject signatures. Existing choices stay intact; three explicit fictional new-answer replays are reported separately from same-answer comparisons. NCES education, social-work and hospitality descriptions informed the editorial distinctions; these are not official assessment questions.

Same-answer results: focused inclusion 36/36 remains unchanged; both mixed families 5/8 → 8/8; six behavior checks pass. Interest-pattern stress probes improve from 31/48 to 45/48, with three disclosed health/technology ambiguities where broad care/community choices favor learning or social study. Do not treat these counts as student accuracy. All original 13-profile and 82-omission ranked lists remain unchanged. The 72 regression tests pass. Counselor and student pilot worksheets are provided with no human results prefilled.

## Optional care detail 0.10.0

The broad explaining/listening/coaching practice choice now reveals three optional details: health communication, learning support and community services. An explicit click replaces only that care-family choice and preserves the other selected choice. Students can keep it broad, revert, pause, be unsure or skip. Saved tokens are never auto-narrowed. Details remain part of the same question, with no extra connection or score. Official O*NET wording/scoring, lifestyle and earnings calculations are unchanged.

The targeted diagnostic in `../outputs/approach-2-care-clarification-0.10.0/` preserves the earlier50 scenarios and48 stress outputs exactly. Broad-answer mixed-family visibility remains45/48. For the six health/technology interest substitutions, explicit health detail changes both-family visibility from3/6 to6/6, resolving the three previously disclosed A/S/E probes. Explicit learning/community alternatives each retain their own direction plus technology in6/6 probes. These add information and are not a same-answer code gain or student accuracy. The same implementing agent authored these targeted tests after seeing the misses; no independent new holdout or human validation is claimed.

All13 original full profiles and82 omissions retain their IDs;80 app checks pass. The existing results board adds a v0.10 care review tab while preserving all historical query rows. This app-only change does not edit, build or deploy Approach1 or adopt a new shared release.

## Fresh automated pathway study 0.11.0

The student experience is fully automatic; counselor participation is not part of the workflow. The previous unexecuted pilot is retired. No real-student success rate has been measured.

A new fixed study in `../outputs/approach-2-fresh-pathway-study-1/` covers 132 authored cases: 36 focused pathways, 36 two-answer derivatives, 36 one-answer derivatives, 12 mixed profiles and 12 behavior guards. Expectations were fixed before execution. Development used 88 cases; 44 reserved cases ran after candidate model/UI hashes were frozen. The implementing agent authored both partitions, so reserved execution is not independent validation. Sparse derivatives contain 34 unique two-answer patterns and 24 unique one-answer patterns.

Development exposed a five-way tie from two people/community answers. Strongest shared directions supported by at least two questions now remain visible alphabetically as separate unranked clues. Broad-interest ranking stays unchanged. Pausing hides the clues; unanswered, unsure and skipped answers are preserved. No question wording, mapping, official scoring, lifestyle or earnings calculation changes were justified by this study.

Focused inclusion is 36/36; both mixed directions remain ranked in 12/12. Two-answer target visibility increases from 35/36 to 36/36 through clues, while ranked inclusion remains 35/36. All 132 full ranked orders are unchanged. Separate related probes pass 144/144 omissions and 72/72 interest substitutions. The new mixed inputs are more explicit and do not replace the old 45/48 broad-answer stress result or its three remaining health/technology ambiguities. All 50 old challenge, 48 old stress, 18 care-detail, 13 original profile and 82 original omission outputs are preserved. The app suite passes 86 tests.

The existing results board adds nine source-backed queries, case filters, exact answer inspection, separate ranking/clue comparisons and the unresolved old cases; all 38 earlier query datasets remain unchanged. Approach 1 was not edited, built or deployed. Next: challenge less symmetric and contradictory mixed interests before changing questions or diversity policy, and audit earning/education-route completeness separately.

## Uneven mixed interests 0.12.0

The frozen study in `../outputs/approach-2-uneven-mixed-study-1/` tests 12 authored course-interest pairs in both dominant orientations, with three related variants: six theme choices plus two other choices, then one or two added third-interest choices. Whole pairs were assigned to 48 development and 24 reserved cases before execution. Reserved cases ran after candidate model/UI hashes were frozen; the implementer authored both partitions. Frequency is not intensity, aptitude or priority, and the questionnaire has no negative-interest response. Added positive interests do not cancel earlier ones.

The update preserves at least one globally strongest-connected pathway if the existing mixed-area/direction allocation would omit all of them. It replaces the weakest selected member of a group that retains another representative. All other paths with two or more distinct question connections remain available outside the ranked four, grouped by broad area in an initially closed disclosure. Their detail view identifies them as unranked connections. Pausing hides the collection while preserving answers. One-question evidence, unknowns and legacy choices cannot fabricate repeated connections. No question wording, mapping, official scoring, lifestyle or earnings calculations change.

Secondary visibility improves 10/24 to 24/24 in the uneven variant. Repeated-third visibility improves 7/24 to 24/24, but only 7/24 third families are ranked. Primary ranked inclusion improves 71/72 to 72/72 across all related cases; two ranked sets change and 70 remain identical. All 432 related interest substitutions pass their separate type-specific criteria. Optional collections contain 0–12 paths in the 72 base cases; expanded visibility is not proven student usefulness or ranking accuracy.

All earlier ranked outputs remain unchanged: 50 challenge, 48 broad stress, 18 explicit care-detail, 132 fresh base, 144 fresh omissions, 72 fresh stress, 13 original profiles and 82 original omissions. Extra unranked collections are added to 32 earlier fresh profiles. The old health/technology stress set stays45/48 by ranked inclusion and becomes48/48 including optional clues; no health intent is silently inferred. All94 app checks and the lease-wrapped build pass; shared pin1.2.0 is retained. The board adds an Uneven interests view while preserving all47 earlier query datasets. Approach1 is not edited, built or deployed.

Next: test changing, partial and four-direction answers plus a neutral optional priority question before allocating additional ranked slots. Self-guided discoverability of the closed collection remains unmeasured.

## Answer changes and broad ties 0.13.0

The fixed study in `../outputs/approach-2-answer-revision-study-1/` covers 20 authored journeys (eight four-direction and 12 revision stories) at 212 checkpoints. Fourteen journeys were used for development; six reserved journeys ran after candidate model/UI hashes were frozen. Another 120 related official-interest replays contain 1,272 checkpoints; 60 of these replays have applicable family criteria. These related observations are not independent students or measured matching accuracy.

Both versions rebuild current answer state correctly at all 212 base checkpoints. The observed gap was visibility during broad ties: weaker connections supported by two questions could disappear behind five equally connected business paths. When weaker repeated connections exist, an initially closed collection now preserves every pathway supported by at least two different questions, grouped by broad study area and explicitly unranked. Pure maximum ties keep their existing presentation. Changing support from two questions to one removes a repeated clue; restoring it brings the clue back. Pausing keeps answers and hides clues. Optional follow-up navigation selects nothing.

Smaller-interest visibility improves from 2/11 to 11/11 authored checkpoints across two broad-tie stories. All eight four-direction journeys retain their four predefined families at 32 complete/restored checkpoints. Every one of the 212 ranked orders stays unchanged. All prior ranked study receipts and earlier uneven clue outputs are preserved; 100/100 app tests and the lease-wrapped build pass with shared pin 1.2.0. No prompt, option mapping, official score, lifestyle, wage calculation or saved-state schema changes. Approach 1 was not edited, built or deployed.

Browser checks cover current answer/reason withdrawal and restoration, pause/resume, optional follow-up navigation, four-direction board checkpoints, reserved/kind filters, filtered source preview, plotted axes/legends and narrow layout. The local results board adds an Answer changes view, preserving all 55 historical query datasets. Next: challenge longer saved-draft histories and competing edits across tabs; self-guided understanding of ranked starting points versus unranked clues remains unmeasured.

## Saved drafts and competing tabs 0.14.0

The new study in `../outputs/approach-2-draft-history-study-1/` contains 12 fictional histories of 96 changes each (1,152 save checkpoints and 144 session reopenings) plus 18 competing-edit/failure cases. Whole cases were assigned to development (eight histories, 12 safety cases) and reserved execution (four histories, six safety cases) before implementation. Both partitions are implementer-authored software tests, not independent validation or student accuracy. One reserved reset fixture initially cleared an already empty draft; the corrected precondition, original evaluator and first output are retained. The candidate source/UI stayed frozen during that correction.

The baseline passes every long-history checkpoint but silently overwrites newer work when another tab saves a stale whole draft. The new app-owned draft session checks the exact saved baseline inside a same-origin Web Lock. Competing current-version tabs serialize their saves; the stale tab retains its local draft, displays a persistent notice that its answers/clues may be older, and can export its work. Loading the latest draft requires explicit inline keep/replace choices when local edits are unsaved. No preferences are silently merged. Queued typing snapshots each submitted edit. Storage/focus checks catch remote changes; unsaved work registers a beforeunload guard. Storage errors, unreadable/unsupported payloads or absent Web Locks disable saving and preserve durable data while exploration and export remain available.

All 12 histories still pass; safety cases improve 2/18 to 18/18. The app passes 112 tests (100 prior plus 12 draft-session tests) and the lease-wrapped build. Actual browser checks cover stale and simultaneous same-question saves, local export, inline keep/replace, resumed saving, reload, three longer note revisions, task retention and sample isolation. Native beforeunload dialog behavior itself was not exercised. The original native confirmation stalled browser controls and was replaced by verified inline controls. Questions, mappings, rankings, official scoring, lifestyle and earnings math remain unchanged; the v1 draft payload/key are retained. Shared pin 1.2.0 remains intact. Approach 1 was not edited, built or deployed.

The locking guarantee requires both tabs to run v0.14 on the same origin. Refresh older open tabs: old versions and noncooperating storage writers cannot be forced to honor this lock. Conflicts protect the whole draft, including independent field edits; there is no automatic field merge. The local results board adds a Saved drafts view and preserves all 64 previous query datasets exactly.

Next: an untouched challenge covering suspended tabs, mixed release versions and quota limits, then a separate review of whether a question-level comparison would make manual conflict resolution easier.

## Suspended tabs, mixed releases and storage limits 0.15.0

The fixed study in `../outputs/approach-2-storage-limits-study-1/` covers24 cases: eight suspension, eight mixed-release and eight storage-limit checks. Eighteen development and six reserved whole cases were assigned before implementation. Reserved execution followed candidate source/UI freeze and required no candidate changes. Browser scenarios overlap the authored design; the implementer authored both partitions, so these are software checks rather than independent validation or student accuracy.

Suspension checks improve4/8→8/8, mixed-release checks4/8→8/8, and storage-limit checks5/8→8/8. The prior30 persistence cases,1,152 save checkpoints and144 reopenings still pass.124 app tests and the lease-wrapped build pass with shared pin1.2.0. A new ordinary quota unit initially used a15ms timeout and returned busy under parallel load; the fixture was corrected to the production5000ms budget, leaving short injected deadlines only in intentional timeout tests. The original failed log is retained. Product source and the fixed24-case study were not changed by that correction.

Current storage uses an app-owned protected key endingv2, while its draft payload remains version1. Earlier releases keep the originalv1 key. An earlier draft can be previewed without writing, and copying it requires Save in updated version. Adoption checks both the protected baseline and the earlier source. Later older-version writes remain separate and cannot overwrite the protected copy. Existing protected content takes precedence; the same session never automatically reimports legacy work after seeing a protected draft disappear. No old copy is deleted or preferences silently merged. Approach1 and shared assets remain untouched.

Visibility and pageshow events recheck saved state. Queued lock requests have a5000ms active wait budget, an AbortSignal and an elapsed-time check before writing; timed-out saves cannot write later when the lock is released. Full storage gets a specific quota notice and an explicit Retry saving control. Retry still rejects a newer remote draft. Rapid autosaves coalesce into the latest requested snapshot with at most two pending payloads (active plus queued), rather than retaining every superseded note. A development browser check also found hidden recovery buttons overridden by button CSS; an app-scoped hidden rule and stylesheet cache revision correct that display.

Actual browser checks use a frozenv0.14 app and candidate on one isolated origin, real full-origin filler, a held current write lock and DevTools freeze/resume. The late old-version save left the protected answers intact. A quota failure preserved the earlier note; freeing only known filler keys and retrying saved the2720-character local note, retained after reload. A held lock timed out, retained the prior save after release, and saved only on explicit retry. A peer save during freeze produced a conflict on resume; loading latest showed current answers. Native beforeunload dialogs, multi-day suspension, OS termination and browser eviction are not claimed.

The local results board adds Storage limits with separate category/partition comparisons, exact assertions, queue behavior and actual browser evidence, retaining all72 earlier query datasets. Questions, mappings, official scoring, lifestyle and earnings rules are unchanged. No cloud backup or post-crash recovery guarantee is introduced. Next: a reviewed restore-from-export flow and browser-restart tests, followed by a clear comparison of older changes before considering any merge.
