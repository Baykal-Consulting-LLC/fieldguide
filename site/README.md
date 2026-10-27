# Fieldguide

Current release: **0.30.0** replaces email-code sign-in with Google sign-in and private Firebase Spark saves. The project is owned by a personal Google account, with no organization or billing account linked. See [migration and verification](docs/firebase-migration-2026-10-17.md). Historical notes below describe earlier releases.

The latest [source and coverage review](docs/financial-and-coverage-review.md) replaces unsupported starting-pay multipliers with official TWC proxies, separates professional-school costs, corrects credit/PMI assumptions, and adds physician/dentist profiles. The [career tree](docs/career-tree.md) lists all 67 current guided profiles; the catalog is a starter collection, with omissions explicitly inventoried.

A public college-exploration website with browser-local drafts and optional private account saves. The conversational guide keeps five reflection sections and five shortcut starting points, all leading to My Plan. Reasoning quizzes have been removed from the student journey. The new mix-and-match lifestyle builder, salary outlooks, and expanded color palette are described in [the conversational lifestyle release](docs/conversational-lifestyle.md). See [the student flow review](docs/student-flow-review.md). See [the guided-flow release](docs/simplified-guide.md). The My Next Move-inspired release adds score-representation checks, three starting paths, 65 reviewed occupational profiles, a 923-entry official directory, optional career reflections, and student/counselor report views. Read [the release notes](docs/mynextmove-release.md), [the original assessment blueprint](docs/assessment-blueprint.md), and [stage 4 implementation notes](docs/stage-4-implementation.md).

The education and financial context extension is implemented. All 26 pathways, 79 college fields of study, and 62 specific careers expose education routes, entry requirements, named college-cost examples and aid guidance, and realistic earnings or an explicit unavailable-data explanation. Read [the Austin calibration notes](docs/austin-calibration.md) and [testing plan](validation/testing-and-calibration-plan.md) for current scope and evidence; [the finance notes](docs/finance-implementation.md) describe the original finance release.

## Keep the model match chart current

The **Interactive model match chart** is pinned at the top of `/developer`. Run `npm run build` before publication. This builds the student app, replays every frozen public model through the current matching and lifestyle logic, rebuilds the chart bundle, and regenerates the Developer page and its refresh date. `npm run build:student`, `npm run build:developer`, and the developer/model review commands also refresh the chart.

After changing profiles, matching, careers, pay, or lifestyle calculations, review the chart and run `node --test tests/model-match-chart.test.js`. Public rows are build snapshots; owner-only cases continue to load and replay through authenticated storage. Never add their raw histories or answers to static output. Dated case reviews remain historical; the chart’s current validation summary is `validation/model-match-chart-current.json`.

## Run locally

Node.js and Python 3 run the static app. Run `npm ci` to install the locked authentication, backend and build dependencies.

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. Use HTTP rather than opening the HTML directly, because the application uses JavaScript modules.

```sh
npm run check
npm test
npm run calibrate
```

## What works

Four-step results entry (official interest scores, optional external ability evidence, personal context, review), form/source/scale checks, six-score chart, source-attributed ability results, an explained exploration agenda, 26 editorial study and training directions with college subjects and linked career examples, student nominations and reordering, experiments saved to an action planner, a fictional example report, and printing.

The five reflection sections cover interests, priorities, confidence and exposure, projects, and personal reflections. Prior reasoning answers remain in backups; exam-style exercises are no longer in the student journey. Browser drafts migrate without discarding stage 2 answers. Full draft backup and restore are available in Data & privacy; report export is separate and omits personal notes unless the student selects their inclusion. Printing uses the current report, with open evidence panels included.

Anonymous drafts stay in the browser. Students who sign in and choose to save send their guide to their private Firebase-backed account for cross-device access. Answers are not sent to an AI service. The public website does not publish student guides. External assessment and source links open services with their own data practices. Font assets are served with the site.

## Interpretation and future work

Assessments are administered externally; users manually enter source results. Raw totals, provider-derived displays, and unknown representations stay distinct; existing drafts without a confirmed representation require review. No proprietary test items are reproduced. The report's interest-to-direction rules are editorial and explicit, not an implementation of official O*NET occupational ranking or a calculated CIP–SOC crosswalk. Ability results remain discussion evidence. No career-fit percentage, invented percentile, or admission forecast is generated. The 5% near-flat display threshold and selection of up to two distinct score levels above the raw scale minimum are editorial heuristics, not psychometric significance criteria. Zero scores remain recorded without being treated as secondary interests.

Further work includes counselor and student review, continued source refresh, additional college-specific program mappings, and graduate outcomes where source coverage permits. Financial context uses reviewed snapshots rather than a live salary or college database.

Education & money now supports up to twelve browser-local college plans, three-plan comparison, itemized or source-total cost entry, grants, separate financing, pending-aid notes, renewal conditions, and links to pathways, fields of study, and careers. An optional self-employment worksheet distinguishes business revenue, expenses, and before-tax operating profit. Personal financial information is excluded from report exports unless selected for inclusion; full-draft backups include it.

The searchable catalog includes graduate/professional careers and non-college routes such as electrical/plumbing apprenticeships, HVAC, carpentry, automotive repair, EMT, culinary work, and dental assisting. All careers link to official O*NET tasks, knowledge, skills, abilities and interests, and to the Austin lifestyle planner.

Life in Austin converts a selected entry-level, 5/10/20-year planning estimate, published employer schedule example, or custom income into an editable monthly budget: tax/retirement/health deductions, rent or ownership, transport, essentials, debt, saving, meals, travel, recreation, and clothing. It preserves shortfalls. Rent and home benchmarks are sourced; other price baskets remain editable assumptions. Texas requirements and source detail are available on each career. Manual take-home supports other tax/household circumstances. Lifestyle amounts stay out of general reports; explicit lifestyle exports and full backups include them.

The static application lives in `dist/`. `content.js` contains original activity content and editorial directions; `model.js` handles saved state; `analysis.js` implements deterministic evidence routing and source checks; `results-ui.js` renders entry and reports; `app.js` integrates routes/interactions; `styles.css` and `results.css` define the visual system. The 16px text floor and visual cards are defined in readability.css. No secrets or real student data belong in these files.
