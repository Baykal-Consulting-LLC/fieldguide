# Education and financial context implementation

Initial release 0.5.0 · Reviewed October 16, 2026

The current 0.6.0 catalog and Austin lifestyle expansion is documented in [catalog-and-lifestyle.md](catalog-and-lifestyle.md). Counts below describe the initial finance release; the generated coverage matrix now reflects the expanded catalog.

## Coverage

Every one of the eight current academic pathways and nine specific career examples has education routes, requirements, education costs/aid, and earnings context. Pathways are available from the direction cards, visual report, and comparison. Specific career pages link from their parent pathways. Tattooing is included under design and storytelling/culture. Student-nominated subjects without a reviewed occupation mapping receive an explicit four-part missing-context explanation.

Broad pathways have no scalar salary or tuition. Their career examples remain separate. Every specific career exposes typical entry education and occupational training separately from legal/licensure review. The application does not claim to determine eligibility for a regulated occupation. Illinois regulator references are available for teaching, professional engineering, and body-art establishments; they require the student's actual jurisdiction and route to be reviewed. Other locations stay explicitly unverified.

The generated [coverage matrix](../data-sources/finance-coverage.json) lists all 17 catalog entities. Tests fail if current pathway or occupation coverage is missing. Coverage includes an honest unavailable status, not a promise that every number is published.

## Sources and snapshots

Eight career pages use BLS OEWS May 2025 national annual wage medians and 25th/75th percentiles, checked through the official O*NET wage tables. Examples are in `dist/finance-data.js`, with occupation codes, currency/dollar year, population, source links, and checked date. The BLS national ZIP download was unavailable during preparation; the displayed figures were instead verified against the official O*NET tables, with medians also checked against BLS publications. No third-party salary estimates were substituted.

Employee wages exclude self-employment and employer benefits. The middle-half band is a distribution, not an experience ladder, starting salary, confidence interval, or personal forecast. Figures remain national; no local values are imputed. The chart uses a labeled zero-based currency scale. Teacher annual schedules are distinguished from the general annualization convention.

Tattoo Artist is an illustrative title in broader SOC 27-1019. No broader artist median is displayed as tattoo income. No experience-year earnings series is attached to any occupation in this release. Census PSEO is linked with an explanation that its years-after-graduation outcomes differ from years in an occupation; institution/program/cohort coverage must be matched before importing a series.

Published 2026–2027 college examples include University of Illinois Urbana-Champaign resident and nonresident undergraduate cost ranges, and Oakton's in-district dependent-student annual budget. These are examples, not a recommended college list or a claim that each school offers every suggested program. Tuition ranges, total annual costs, residency, living/enrollment scope, source URLs, and dates remain visible. Oakton's budget is not the cost of a full bachelor's route.

Legal sources, wage definitions, college sources, Federal Student Aid, and CFPB guidance link directly from the relevant panels. The research behind the presentation remains in [the research brief](../../research/07-education-finance-and-career-earnings.md) and [the data design](../../research/08-financial-module-data-design.md).

## Calculations

The college planner supports up to twelve plans and compares up to three. Every plan records college, program, academic year, residency, enrollment, living arrangement, period, evidence type, source reference, checked date, and assumptions. Itemized cost and source-total modes are mutually exclusive calculations; a source total cannot be added again to tuition. A blank is unknown; an explicit zero is retained. Amounts calculate in integer cents.

`net price = cost of attendance − grants and scholarships`

`unresolved funding = net price − planned cash − loan net proceeds − planned work earnings`

Pending aid is recorded but not included in either calculation. Loans finance the price and remain borrowing. Student, parent, and private borrowing remain separate inputs; principal/fees/interest are not inferred from net proceeds. A negative net price or funding balance is retained and flagged. Incomplete costs, grants, or funding block only dependent results. Comparison shows different years/periods without computing a misleading combined price or cross-plan difference.

The self-employment worksheet begins blank. It calculates paid appointments × collected revenue × working weeks, subtracting studio share, annual rent, per-appointment supplies, and other annual costs. The result is illustrative operating profit before personal taxes and benefit costs. It records unpaid hours without pricing them as paid labor, warns about simultaneous studio share and rent, and preserves losses. It supplies no empirical salary or take-home estimate.

## Privacy and interpretation

All personal entries remain in browser-local storage under the existing draft key. Earlier results and activities migrate without discarding answers. Full-draft export/restore includes financial entries. Personal financial plans and business assumptions are excluded from the visual report and report/financial exports unless the Education & money inclusion checkbox is selected. Public career facts and published college examples remain exportable. Fictional reports use a fresh state and do not include the family's saved financial entries.

Financial context is not an input to interest analysis, ability interpretation, or direction order. College benefits are described alongside cost, route, and credential limits. No salary-based ranking, aid-eligibility prediction, automatic return-on-investment score, or guaranteed degree outcome is generated.

## Validation and maintenance

The suite contains 41 software tests, including 17 finance tests for complete catalog coverage, exact source metadata, cost arithmetic, total/itemized exclusivity, blank versus zero, excess funding, comparison periods, missing tattoo wages, jurisdiction review, privacy, migration, business scenarios, escaping, and independence from assessment ranking.

Browser QA covers college-plan entry and live calculations, comparison, linking to a pathway and specific career, report opt-in, save/reload, financial export, Illinois references, the tattoo gap, and the business worksheet. Responsive and print checks accompany release QA. These checks establish software behavior, not validation of a counseling or financial prediction model.

Before updating data, review new BLS/O*NET releases, occupation-code mappings, official cost-year budgets, source notes, and legal references. Update the checked/reference dates and regenerate the matrix. Recheck aid explanations for the applicable award year. No maintenance automation, external credentials, or public sharing change was created by this release.
