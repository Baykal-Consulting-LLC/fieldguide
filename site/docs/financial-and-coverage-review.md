# Source and career-coverage review · 0.10.0

Reviewed October 16, 2026. This is a source agreement and model-scope audit. It is not validation of individual career predictions, experience-specific salary growth, college admission, or psychometric aptitude.

## Material findings and fixes

| Finding | Evidence | Change |
| --- | --- | --- |
| Starting pay used unsupported family multipliers | 23 prior entry illustrations exceeded the official TWC entry proxy by more than 10% | Use TWC entry proxies for 65 career profiles; the data file also keeps a teacher proxy for reference, while AISD retains its actual employer schedule. Tattoo remains a visibly low-confidence posting illustration. |
| Wage anchors themselves were accurately transcribed | All 64 existing official occupation anchors matched freshly read O*NET May 2025 geographic tables; new physician/dentist benchmarks were separately checked | Retain those anchors. Distinguish entry proxy, median, and later-stage illustration. |
| Experience pay looked more established than its evidence allowed | No observed 5/10/20-year wage series supports the generic curves | Label later stages “Illustration” visibly and explain their assumptions. Rename lifestyle outlooks as conditional budget comparisons; remove probability-like “likely” wording. |
| Physician and dentist did not exist in the guided catalog | Neither ID appeared among 65 profiles | Add family medicine physician and general dentist, with preparation, Texas requirements, local pay, relevant professional cost examples, and plan routes. |
| Physician attending pay could hide the lower-paid training years | Dell Med 2026–27 PGY-1 published salary is $69,528 | Show residency before practice pay, with its own lifestyle preview and saved plan stage. Practice years begin after residency. |
| Undergraduate tuition appeared as the only cost reference for graduate careers | UT/ACC examples are undergraduate budgets | Show professional/graduate examples separately in career preparation and My Plan, retaining undergraduate foundation costs as a separate stage. |
| Used-car credit was optimistic | Experian Q2 2026 national average used APR is 11.19%; new APR 6.35% | New defaults/builder choices use those APRs. Vehicle type, purchase price, insurance, and running costs remain scenarios, not quotes. Existing manually entered assumptions are retained. |
| Home calculations omitted PMI below 20% down | CFPB and Freddie Mac explain low-down-payment mortgage insurance | Add editable PMI, default 0.6% of loan/year, equivalent to Freddie Mac’s broad midpoint of $50/month per $100,000. Include medical costs in the six-month reserve. |
| One-time car cash was easy to miss | Financed scenarios assume down payments | Show car down payment separately from monthly tally. No double-counting in monthly spending. |
| Frugal groceries were below the local basic-needs reference | MIT Travis County 2026 food reference about $347/month | Raise frugal choice from $300 to $350. Higher food choices remain preference baskets, not local quantiles. |
| A paid-off car implied no replacement reserve | Ownership still requires future replacement | Add $100/month replacement allowance to that choice and explain it. |
| Student debt could be mistaken for free professional education | No financing decision or individual aid award is known | Keep user debt at zero until entered, but visibly flag professional-career lifestyle previews and plans as excluding student-loan payments. |

## Sources checked and scope retained

- **Wages:** BLS OEWS May 2025 via O*NET local wage tables, TWC 2025 annual MSA wages, AISD 2026–27 new-hire teacher schedule, and Dell Med 2026–27 resident schedule. TWC entry means average of the lowest-paid third; it is not observed pay at zero experience. Dallas is the psychiatric-aide fallback. Austin living costs still apply.
- **College:** UT Austin and ACC 2026–27 undergraduate figures match their official tables; no correction to those numbers was needed. UT Texas Advance Commitment and ACC free-tuition eligibility are conditional and are not assumed awards.
- **Professional education:** Dell MD tuition/fees, UTHealth Houston DDS attendance budgets by program year, UT Law attendance budgets, UT PharmD semester rates, UTMB PA/OT/DPT examples, UT Psychology funding, and Texas Tech DVM examples. Each amount states its coverage. UTMB OT is based on 2025–26 rates and has an internal source-total inconsistency, so annual rows are retained instead of silently choosing a total. PA and Texas Tech DVM estimates have no explicit price year. The generic graduate reference is expressly not a program quote. The source receipt preserves all limitations.
- **Aid:** Current Federal Student Aid rules distinguish grants from loans, undergraduate Pell from graduate study, July 2026 Grad PLUS changes, loan caps, legacy exceptions, and unsettled program classification. No award or approval is assumed.
- **Living costs:** HUD FY 2027 Austin one-/two-bedroom gross rents ($1,530/$1,817), Unlock MLS September 2026 metro sales/rent, Freddie Mac October 15 mortgage benchmark (7.40%), CapMetro’s current local/commuter fares, MIT Travis County food/health/other basic needs, IRS/SSA 2026 tax constants, and Experian credit averages. Local and national scopes stay labeled.

Housing price levels, insurance, utilities split, maintenance, property tax, restaurant prices, leisure, travel, and clothing remain editable estimates. Broad benchmarks do not establish a specific home, car, restaurant, brand, or vacation. The income range covers chosen costs at its lower end and leaves 20% of modeled take-home unallocated at its upper end. It is not a confidence interval or maximum income. Spending sources use different years and are not inflation-adjusted into a future graduation forecast.

## Career coverage audit

The revised catalog has 67 guided profiles. Of those, 66 match exact titles in the 923-title O*NET 31.0 directory; tattoo is an editorial title within a broader SOC category. There are 857 directory-only titles. Comparing all records by exact SOC exposes eight major groups with no guided profiles: protective services; building/grounds maintenance; personal care; sales; office/administration; farming/forestry; production; and transportation.

The [included tree](career-tree.md) lists all 67. The website’s coverage page and downloadable missing-title inventory show the boundary. A missing title means the profile is not yet built; it does not mean the student is unsuited to the work.

First-wave research covers 20 common missing options: police, firefighter, truck driver, welder, computer support, nurse practitioner, elementary teacher, high-school teacher, web/interface design, interior design, chemical engineering, aerospace engineering, real-estate sales, photography, acting, music, commercial pilot, hairdressing, medical assisting, and mental-health counseling. Another 48 candidates and the complete 857-title inventory are recorded. They are not misrepresented as complete guided profiles. Actors and musicians require an hourly/irregular-work model; annualizing their hourly data by 2,080 would be misleading. Practice ownership, business revenue, management progression, specialty training, and protected Texas titles need separate treatment.

## Review artifacts

- `validation/wage-source-review-2026-10-16.json`: row-by-row fresh source comparisons, hashes, entry-proxy differences, new clinical benchmarks, employer schedules.
- `validation/education-source-review-2026-10-16.json`: program costs, academic/price years, definitions, aid, requirements, source conflicts.
- `validation/career-catalog-gap-audit-2026-10-16.json`: all 23 occupational groups, all 857 directory-only titles, 68 priority candidates and their wage evidence.
- `validation/common-career-gap-candidates-2026-10-16.json`: Texas requirements and training research for 18 common omitted careers.
- `data-sources/financial-source-review.json`: lifestyle benchmarks and professional-education evidence.
- `tests/source-review.test.js`: source fixtures, complete tree reachability, coverage reconciliation, medical training stage, debt disclosures, and PMI/upfront arithmetic.

Tests check implementation and source fixtures. Their count is not evidence that a student’s career outcome or future salary is validated.
