# Fieldguide testing and calibration plan

**Owner:** product maintainer, with a qualified high school counselor reviewing assessment interpretation.  
**Reference household:** one adult living alone in Austin, Texas.  
**Baseline:** `41a238b2f78aab2decf3f1c097fa2a46ae141bf0`, audited October 16, 2026.  
**Run:** `node scripts/calibration-runner.mjs`, then `npm test` and `npm run check`.

This plan separates software correctness, source agreement, and evidence that an assessment supports its intended interpretation. Passing software tests does not validate a new aptitude test.

## What the assessment can say

Fieldguide's original questions summarize curiosity, priorities, confidence, experience, and four exploratory challenges. They do not establish aptitude, a percentile, admission chances, or career suitability. Imported O*NET results describe **interests**. Separately imported ability results remain attributed to the instrument, form, administration, comparison group, and source.

The [O*NET Interest Profiler manual](https://www.onetcenter.org/dl_files/IP_Manual.pdf), scoring chapter, page 32, distinguishes online Short Form scores (0–40), online Mini scores (0–20), and paper Short Form counts (0–10). The [current formats page](https://www.onetcenter.org/IP.html) is the release reference. Do not transform between forms by rescaling a six-number profile. Do not silently treat a provider's transformed scores as official raw sums.

Fieldguide uses its own editorial connection from the top two distinct interest-score levels to broad exploration pathways. The official profiler's occupation matching uses a different method. Exact occupation-list or rank agreement with My Next Move is **not** a validity requirement for this editorial feature. A counselor must review whether its labels clearly describe that difference. If official occupational matching is added, its algorithm, current occupational profiles, license, version, and tie behavior require a separate oracle and validation.

The [ASCA career-development position](https://www.schoolcounselor.org/Standards-Positions/Position-Statements/ASCA-Position-Statements/The-School-Counselor-and-Career-Development) supports placing assessment inside wider career and educational exploration. A student's interests, experience, preparation, priorities, and own nominations remain visible; earnings do not determine interest routing.

## Executable coverage

The runner imports the real application modules. It records counts, failures, sample counterexamples, Git HEAD, execution time, and SHA-256 hashes in `validation/calibration-results.json`. `validation/question-path-matrix.csv` lists question-level equivalence classes and expected behavior. Re-run after application or data changes; an old green result is not a current release result.

| Area | Enumeration or independent oracle | Expected result |
|---|---|---|
| Paper interest scores | All **1,771,561** profiles, each score 0–10 | Two highest distinct levels, all ties retained; flat profiles do not route |
| Full analysis | All **4,683** weak order patterns of six dimensions | Each pathway occurs once; editorial themes determine interest reasons; agenda and remaining cards partition the catalog |
| Curiosity | Every question × blank, 1–5, untried, including erase | Blank is unknown; untried is unfamiliar; only 4/5 enter liked-activity summary |
| Priorities | All **401** ordered selections of 0–3 of eight | Order survives save/restore; moving first upward has no effect |
| Confidence/exposure | All **331,776** combined states, including partial entries | Complete only when both fields exist; confidence and experience stay separate |
| Challenges | All **625** blank/answer combinations | Zero-index answers survive; keyed feedback only; no combined aptitude score |
| Pathway lanes | **160 contexts per pathway** | Student choice, preparation, experience and interest precedence; set-aside items remain accessible |
| Result editing | Every six-score field plus scale, source, date; all form switches | Editing invalidates verification; switching form clears incompatible scores |
| External result guards | Valid, incompatible scale, fractional sum, out-of-range; malformed ability dates | Unverified/incompatible data cannot generate source-checked interpretation |
| Narrative and privacy | Blank, 4/5-character boundary, Unicode, long text, markup; note opt-in/out | Safe text, correct completion, personal details excluded by default, example isolated |
| College calculator | **6,561** cents-based cost/grant/loan combinations; blank and total modes | Net price = cost − grants; loans/work finance it; pending aid is not awarded aid |
| Income tax | Independent IRS closed-form schedule; thresholds below/at/above; SSA cap | Federal, Social Security, Medicare, retirement and take-home agree to half a cent |
| Financing | Independent discounted-payment present value across zero, near-zero and ordinary rates | Finite, continuous payment; principal conserved |
| Lifestyle | **192** income/housing/transport/take-home mode combinations | All categories reconcile; negative balances visible; manual net does not depend on gross |
| Austin colleges | Independently transcribed official 2026–27 UT Austin and ACC fixtures, all displayed cost fields | Exact source values and year; low/high housing endpoints reconcile |
| Catalog | Every pathway, major and career | Four education/financial coverage states; finite ordered available wage quartiles; every sourced career wage has Austin scope |

The overall cross-product is not exhaustively enumerable. Twelve curiosity questions alone have 7^12 = 13.8 billion states. Free text, continuous money values, event order, and future source changes are unbounded. Use the enumerations above plus risk-based pairwise browser journeys, boundary tests, and invariants. Do not label this as “all possible user journeys tested.”

## Browser journeys required before release

Run on a clean local draft and a restored older draft at desktop, 390-pixel mobile, keyboard-only, and 200% zoom. Use synthetic data. Confirm actual DOM state, not only string-rendered HTML.

1. Start blank. Answer, change, erase, skip, resume and reload each question type. Back and forward navigation preserve state. Show progress decreasing after an answer is removed.
2. Enter an official-form fixture; change each score and its form; verify dependent reasons disappear until rechecked. Test ties, six zeroes, a flat profile, near-flat online sums, wrong scales, whitespace, invalid dates, incomplete profiles, and unconfirmed provider forms.
3. Add one supported and one unsupported ability result. A low score cannot exclude a pathway. Two dimensions sharing one battery do not count as independent confirmations.
4. For each routing lane, save, reorder, set aside and restore a pathway. Follow a nominated major with no assessment connection. All catalog entries stay reachable.
5. Open each unique page template (pathway, major, college career, non-college career, regulated career, posting-estimate wage) and follow its education, tuition, aid, requirements, skills, source, lifestyle and back links. Automated full-catalog render tests supplement these journeys.
6. Connect a college plan to a pathway, major and career. Compare two years/periods, zero grants, pending aid, excess grants, missing fields, grants above costs, and borrowing changes. A loan cannot lower net price.
7. Select low/middle/high wage, custom gross and manual net. Exercise rent/own and all transport modes. Test a shortfall, zero income, zero interest, near-zero interest, mortgage upfront cash gap, high retirement, and zero denominator for trips/items. No NaN, Infinity, clipped shortfall or automatic debt-to-income approval.
8. Export with notes/financial details off and on. Import a full backup, malformed JSON, an old draft, unknown IDs and long malicious strings. Confirm example reports never read personal data. Confirm reload works on deep links.
9. Check every visible text element at final computed size: **16 px minimum**, with **18 px or larger** recommended for body and expanded explanations. Large key numbers, clear short sentences, meaningful chart labels and keyboard-operable “More info” disclosures. Test contrast, focus, touch targets, horizontal overflow and print/PDF. Long essential eligibility information cannot be hidden without an obvious label.

## External financial calibration

Every numeric record needs geography, period, population, unit, source, retrieval date and status: observed benchmark, published policy, derived estimate, or editable assumption. “Austin” refers to the named metro when metro wages are used; Travis County spending is a distinct geographic scope. Do not claim city precision from county/metro data.

### Earnings: every career

Primary target: Austin–Round Rock–San Marcos OEWS occupation data, preserving SOC, reference period, employee scope, suppressed values and annual/hourly basis. Compare to [BLS OEWS metro releases](https://www.bls.gov/oes/current/oes_12420.htm) and [Texas Workforce Commission labor-market resources](https://www.twc.texas.gov/data-reports/texas-labor-market-information). O*NET/CareerOneStop can independently test ingestion and mapping, but often redistribute the **same BLS source**; agreement is not a second independent wage survey.

For every career: exact occupation lookup, title/SOC review, source value match to published rounding, lower/median/upper ordering, and all salary-to-lifestyle links using the selected Austin value. Do not call quartiles “entry,” “five years,” or “experienced.” Only publish experience bands when the source actually measures tenure/experience with a suitable local sample. Annual teacher pay is not twelve months of identical work time. Apprenticeship wages need a specific program schedule. Employee wages exclude self-employment; tattoo artist profit requires an expense-aware scenario rather than borrowing fine-artist wages.

**Missing local wage:** resolve alternate official Austin views first, then Dallas/Houston occupation data or clearly labeled posting estimates. The active catalog has 61 exact Austin employee distributions and one tattoo posting estimate with both peer cities. Never fabricate a missing percentile or call a posting mean a median. Never silently relabel national wages as Austin observations, multiply all careers by a general cost-of-living factor, or substitute a broader occupation without stating it. The site should supply available Texas/Austin facts itself and minimize “check locally” instructions.

**Release gate:** 100% of displayed numeric wages reconcile to the named source and scope; every nonobserved estimate is labeled; no fabricated median for a suppressed/missing occupation. Flag a changed median above 10% or quartile above 15% for human review. These flags trigger investigation, not automatic reversion.

The baseline national wage audit re-read 61 sourced records and matched their original O*NET values. It is a source-transcription audit, not independent regional calibration. See `wage-source-audit.json`. Replacing the national snapshot requires a fresh Austin audit.

### Austin spending: one adult living alone

Use at least two appropriately matched sources for high-impact categories. Compare definitions before comparing numbers: gross rent versus base rent plus utilities, medical premium versus total medical costs, vehicle ownership versus transit, city versus metro, and household versus per-person spending.

| Component | Primary reference and cross-check | Rule and tolerance |
|---|---|---|
| Rental housing | [HUD FMR](https://www.huduser.gov/portal/datasets/fmr.html); recent Austin rental-market sample | Match FY, metro, bedroom and included utilities exactly. HUD FMR is a program benchmark, not current asking-rent mean. Never add included utilities twice. Sample rents within ±15% of displayed scenario or label the neighborhood/quality assumption. |
| Core living budget | [MIT Travis County calculator](https://livingwage.mit.edu/counties/48453) and methodology; category-specific sources below | Compare the one-adult/no-child case. Basic-needs budget is not a restaurant/travel lifestyle forecast. Investigate mapped essentials >15% apart and explain scope. Do not copy/rehost its full dataset. |
| Food at home | [USDA monthly food plans](https://www.fns.usda.gov/cnpp/usda-food-plans-cost-food-monthly-reports), with one-person adjustment | State food plan, date, age assumptions and adjustment. A grocery preset >15% outside its stated plan needs a reason. |
| Transport | [CapMetro fares](https://www.capmetro.org/fares); [AAA driving costs](https://newsroom.aaa.com/auto/your-driving-costs/) and actual vehicle/insurance quotes | Separate loan, insurance, fuel, upkeep, fees and parking. AAA is a cross-check, not an Austin quote or an appropriate used-car price by itself. No invented model affordability threshold. |
| Purchase housing | Current local sale/listing evidence, [Freddie Mac mortgage survey](https://www.freddiemac.com/pmms), [Travis tax office](https://tax-office.traviscountytx.gov/properties/taxes) | Include principal/interest, property tax, insurance, upkeep, HOA and closing cash. Label rate, down payment and effective-tax assumptions; do not imply loan approval. |
| Restaurants | Dated Austin menus across quick-service, casual and occasion dining | At least three comparable menus per tier; include stated tax/tip convention. Median observed basket ±15%, or explicitly a custom scenario. Budget shows frequency, never guarantees a venue. |
| Clothing | Dated direct retailer baskets across budget/midrange/premium tiers | Brands are optional examples; use dated item prices including applicable tax. Do not assign status or a fixed brand to a career. ±15% to basket or relabel custom. |
| Travel/recreation | Dated flight/hotel/activity baskets with dates and duration | Show saving rate and trip basket. Round affordable trips down for count examples; fraction represents progress toward a trip. Missing trip prices remain assumptions. |
| Health/insurance | Actual payroll premium scenario and [HealthCare.gov](https://www.healthcare.gov/see-plans/) where applicable | Premium is not total healthcare. Include or disclose deductible/copay/out-of-pocket reserve; no broad claim of eligibility or subsidies. |

**Reviewed cross-check, October 16, 2026:** MIT's February 15, 2026 Travis County one-adult/no-child case reports $49,279 gross annual basic-needs income and $42,042 after tax. Its food, housing and transport categories are approximately $347, $1,518 and $705 monthly. These are reference definitions, not personalized promises. The baseline planner's $400 groceries is about 15% above that food category; $1,830 rent plus utilities was about 21% above that housing category. Phone/internet $125 is close to MIT's approximately $123. Medical $250 monthly is near MIT's approximately $256 aggregate, but equating an employee premium with all medical costs would be misleading.

**Recalibrated housing default:** $1,350 base rent + $180 utilities = the cited HUD FY 2027 Austin one-bedroom gross-rent benchmark of $1,530. This avoids adding utilities twice. It is a transparent benchmark-matched scenario, not an asking-rent average or a guarantee of an available apartment. Grocery, premium, insurance, dining, clothing and travel inputs still require their own scope labels and price-basket evidence; matching housing alone does not calibrate a complete lifestyle.

Do not rate the default whole lifestyle against MIT's whole total without removing discretionary travel, dining, retirement, savings and debt differences. Do not sum overlapping medical or housing categories. Editable prices are **assumptions**, even when plausible; “calibrated” requires dated comparator baskets in an evidence log.

### Tuition, aid and entry requirements

Use named programs at UT Austin, Austin Community College and appropriate Texas training providers; record exact 2026–27 year, Texas/district residency, credit load, length, mandatory fees, books/equipment, living arrangement and program supplements. Program length and whole-program cost cannot be inferred by multiplying a generic annual budget without modeling completion time and cost scope.

Compare official [UT Austin cost of attendance](https://onestop.utexas.edu/managing-costs/cost-tuition-rates/cost-of-attendance/) and [ACC tuition/aid](https://admissions.austincc.edu/tuition/) to [College Navigator](https://nces.ed.gov/collegenavigator/) or [College Scorecard](https://collegescorecard.ed.gov/), aligning cohort and year. A lagged federal institutional average does not override a current official program budget. Public tuition must match the applicable rate to published rounding; totals must reconcile within $1. Baseline UIUC/Oakton examples matched official 2026–27 publications but are not Austin calibration and should not serve as Austin defaults.

Aid must distinguish grants/scholarships, conditional or pending aid, work, student borrowing and family borrowing. Compare examples to [Federal Student Aid net-price guidance](https://studentaid.gov/complete-aid-process/comparing-aid-offers) and the institution's official calculator. Program/institution eligibility, annual and aggregate limits, renewal, and enrollment affect aid. No family-specific eligibility conclusion without its required inputs. Award offers take priority over illustrative averages.

**Reviewed October 16, 2026:** the current UT Austin resident undergraduate fall/spring budget is $32,508–$35,386, including tuition of $10,858–$13,576. Its housing/food range must be included in both total endpoints. The ACC in-district 30-credit fall/spring budget is $27,398 living away from parents or $17,958 living with parents, including $2,550 tuition/fees. The executable fixture independently records every displayed component from those official pages; these are published budgets before aid, not program-specific bills or a personal aid determination.

Texas licensing is a separate review: source the relevant state board and exact scope for each regulated career, distinguish common employer preferences from legal minimums, and include fees/exams/supervised practice where known. A current state requirement should be shown directly; a vague “check local requirements” is not a substitute for this work. Cross-check regulated roles quarterly and after policy changes.

### Tax and financing scope

The independent tax oracle uses [IRS 2026 rate schedules](https://www.irs.gov/publications/p505), the $16,100 single standard deduction, [SSA 2026 Social Security rules](https://www.ssa.gov/news/en/press/releases/2025-10-24.html), and [Additional Medicare rules](https://www.irs.gov/taxtopics/tc560). Test only the declared single-employee scenario: not self-employment, married taxes, dependents, itemization, credits, qualified tips/overtime deductions, investment income or future tax years. Estimated annual tax is not a payroll-withholding prediction. Retirement is traditional employee deferral, with the application's stated limit; a Roth contribution requires different treatment.

Require < $0.005 arithmetic difference per tested annual tax component and < $0.01 monthly payment difference. Large real-world tax differences may reflect omitted circumstances rather than bad arithmetic; show the short scope label and allow manual take-home. Re-run after every annual tax update.

## Human calibration and pilot

1. **Days 1–2: correctness and content.** Maintainer runs the finite-path suites and source audit. Counselor reviews all original questions, challenge rationales, distinction between interests and aptitude, and five deliberately conflicting evidence profiles. Fix all unsafe routing, source, privacy, infinite-value, and material financial errors before release.
2. **Days 3–5: usability.** Five to eight high school students plus two parents/counselors complete representative journeys with consent/assent and synthetic financial data. Observe whether they can explain interest versus ability, typical versus required education, median versus starting pay, net price versus borrowing, and a monthly shortfall. Proposed gate: at least 80% answer each critical comprehension question correctly; no participant leaves believing a career is ruled out by one score. Any serious misunderstanding triggers redesign and another round.
3. **Next 2–4 weeks: exploratory pilot.** Recruit a varied high school group rather than only this family. Predefine questions and outcomes; obtain appropriate consent and minimize data. Use an official appropriate-form assessment unchanged. Compare imported six scores and labels to the original report with 100% transcription agreement. Have two counselors independently review the site's interpretations and disagreeing examples, resolving all materially misleading claims.
4. **If creating a scored assessment later:** commission a qualified psychometrician to preregister the construct, item development, sampling/power, reliability, factor/structural evidence, convergent/discriminant validity, differential item functioning, accommodations, and subgroup fairness plan. Report uncertainty and limits. A small convenience/family pilot is usability research, not a norming or validation cohort. Do not borrow the published O*NET instrument's validity evidence for original Fieldguide questions or the editorial matching algorithm.
5. **Follow-up:** ask what classes, conversations or experiments students tried and what changed. Measure useful exploration and comprehension, not agreement with the app or income-maximizing choices. Revisit after 2–4 weeks; interest change is not necessarily test failure.

## Release gates and maintenance

| Gate | Required evidence | Owner |
|---|---|---|
| Calculation/routing | Runner has zero unresolved critical failures; standard tests and syntax checks pass | Maintainer |
| Austin facts | Every career has a local median or explicitly labeled posting estimate; every shown number reconciles; suppressed data retained | Data reviewer |
| Education/aid/legal | Program/year/residency stated; typical and legal minimum separated; Texas evidence complete or clear specific gap | Content reviewer |
| Readability | 16 px absolute minimum; 18 px body-text target; short visible copy; progressive disclosure; mobile/zoom/keyboard checks | Designer/maintainer |
| Interpretation | Counselor signs off on labels and conflicting cases; no unsupported aptitude/fit claim | Qualified counselor |
| Privacy | Opt-in exports and fictional isolation verified; no real student data in test artifacts | Maintainer |

Refresh wage data at each BLS/TWC release and re-audit all careers. Check tuition/aid every academic year and before application-season use; rents quarterly; current menus/product/travel baskets every three months; loan rates monthly; tax rules annually or after relevant law changes. Display the snapshot date; a future student's graduating salary cannot be predicted from today's prices. Keep a change log of old value, new value, reason and source. Re-run affected tests plus the full routing/finance suite after source migrations.

`calibration-results.json` is the authoritative record of what executed. This document includes planned work; an unexecuted pilot, browser journey or independent price basket must stay labeled pending. No single “validated” badge should combine these different levels of evidence.

## Initial findings and regression record

The first run against the baseline found **23 failing assertions** across three defects: online Short/Mini raw-score scale and integer guards (4); malformed ability dates treated as source checked (4); and unstable loan arithmetic near zero interest, including Infinity (15). The other baseline assertions passed. These findings were sent to the app maintainer for correction. Each is retained under `baselineRegressionFindings` with its **current** test status after reruns. That status is evidence of a software fix, not assessment validity.

Austin wage and college source gates were added after this initial run. They do not retroactively describe the national baseline. Human counselor review, a student comprehension pilot, and full clothing/travel price baskets remain pending. Official Austin restaurant spot checks are recorded in docs/austin-calibration.md; they do not validate every basket.

**Rerun after fixes:** all **2,121,161 assertions in 18 groups passed**, including the 23 regression cases, all 62 career-localization states and 42 Austin college-source assertions. See the machine-readable timestamp and file hashes. Browser execution and scope are recorded separately in browser-qa.json. The final runner refreshes deployed source hashes. No human psychometric, counselor or pilot validation is claimed.
