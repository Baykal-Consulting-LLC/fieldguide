# Open career exploration · 0.53

The compulsory pathway funnel has been replaced by an open career explorer. The guide starts with lifestyle goals, then the unchanged official60-item interest assessment leads directly to careers. Students can also browse immediately. Field choice, strengths and detailed work surveys are optional. The budget highlights financially promising college and graduate routes without changing interest evidence or hiding other fits.

## What students can do

- Explore all457 canonical professions, across all12 fields, with search, education filters, raw-correlation sorting, saved favorites and pagination. The first12 are a window, not the only eligible options.
- See other fields and actual leading professions in each. Health surveys return only reviewed Health professions, with no unrelated global fallback. A cross-field career remains available by choosing another field or All fields.
- Take an optional field survey of8–12 existing useful work questions, then clarify a profession through independent defining-interest questions. All relevant earlier work responses and the unchanged broad profile count. No route selection is treated as an exclusive occupational interest.
- Reflect on24 original underlying-interest prompts, in three saved rounds of8, or on12 strength/exposure prompts. These reflections are not a validated scale, inferred aptitude or an extra official interest score. Original reflections remain context while occupation-link validity is studied; they do not artificially raise correlations or confirm professions.
- Read raw broad correlation separately from profession-specific supporting answers, contrary interests, unanswered questions and simulated-answer provenance. No match probability is claimed. A strong broad connection is an invitation; specific support has independent evidence requirements.
- Save careers freely, create an exploration plan without further mandatory field questions, retain notes and completed steps, and investigate preparation, costs and lifestyle when ready.

## Evidence and ranking

All original records, biographies and earlier question IDs remain intact. New answers live in a separate additive state with before/after history. A revised exact question supersedes the old response for current matching without overwriting that original response.

A guided profession needs two distinct task contexts plus both defining-interest answers. An expanded profession needs subject, method and distinctive responsibility, independently supported. A broad-profile cutoff cannot veto such specific evidence or remove access. A generic Love response or hobby cannot alone establish a profession. Unknown and unfamiliar remain open; an essential No prevents a supported-interest claim while leaving the career accessible.

Default order places specifically supported careers first, then meaningful partial evidence and broad correlation. Meaningful partial evidence needs a defining-interest answer or at least two task contexts. Browser testing caught and corrected an earlier version where one general Health checkbox displaced much stronger engineering-oriented broad connections. Raw broad-correlation order is separately selectable. There is no degree, salary, demographic, mental-health or present-skill bonus in interest eligibility.

The broad60-item instrument, frozen older engines and0.52 history are preserved. The new explorer is the active student experience; the older rendering remains explicitly versioned for historical regression checks. The Developer chart distinguishes first offers, historical0.52 results and current0.53 discovery/support, with exact follow-up questions and interactive model copies.

## Final public model replay

This is a saved-answer simulation, not a new round of student behavior. No new profile answers were invented. A blinded independent development review added16 uncertainty holds across13 offers in9 models; original inferred Yes responses and rationale remain preserved, and direct student clarification can supersede a hold. Four original-holdout offer concerns remain documented evaluation limitations, without tuning from their outcomes. Fresh holdout and diagnostic variants remain separate.

Among172 base models, any specifically supported Top option changed from148 to153; college/graduate Top coverage changed from126 to132. Both use at most three supported offers. The full explorer retains401 supported model–career appearances beyond the displayed limit. These are evidence-rule outcomes, not accuracy estimates.

| Cohort | Models | Any supported Top, old → new | Degree Top, old → new | Current Top covers budget |
|---|---:|---:|---:|---:|
| development | 70 | 64 → 63 | 58 → 58 | 26 |
| supplement | 24 | 21 → 21 | 15 → 15 | 7 |
| legacy | 24 | 21 → 21 | 16 → 16 | 12 |
| holdout | 30 | 25 → 26 | 20 → 21 | 10 |
| development049 | 12 | 9 → 11 | 9 → 11 | 5 |
| diagnostic049 | 12 | 9 → 11 | 9 → 11 | 5 |
| holdout049 | 12 | 8 → 11 | 8 → 11 | 3 |

63 base models have a supported Top option covering the stated budget at its assessed first-paid stage, versus61 in the preserved0.52 chart. Looking across every specifically supported option gives70; this larger pool is a different denominator/list cap. No affordability claim is made for unknown pay. All172 have at least one degree discovery in the first12; that does not mean a degree profession is specifically supported for all of them.

## Testing evidence and its limits

The comprehensive program is in testing-program-053.md. The new suite checks every activated profession’s evidence sensitivity, all457 detail renders, strict field scope, data/history preservation, low-correlation specific support, unknown/No behavior, direct-answer overrides, demographic/financial invariance and model denominators. The existing full regression suite retains the old engines and explicitly historical UI assertions. Current UI and model-preview tests use the new shared renderer.

Independent external arithmetic checked77,220 correlations across184 public synthetic profiles with no errors above1e-10; maximum absolute error5.53e-14. Eighteen fresh live official O*NET comparisons agreed on all six scores and exact60 item content/order.724/726 returned fit categories agreed. The two discrepancies are borderline Coaches and Scouts results, retained rather than tuned away. Flat inputs are separately documented. These are interoperability checks against the same interest-model family, not independent proof of recommendation quality. No commercial-vendor agreement has been measured.

A separate reviewer froze biography-only expectations before seeing outputs, then reviewed288 first-window career appearances across18 development and6 original-holdout cases, without scores, salary or old/new labels. The review identified branch-specific over-inferences and limited first-page variety. Full-catalog inspection found all12 checked apparently missing roles were present, with no independent positive profession-specific answers. Their absence from page one does not establish an inventory gap, nor justify inventing a confirmed match. The complete review and residual holdout concerns are published.

A second deployed-service comparison used CareerOneStop’s30-item assessment with two contrasting frozen synthetic profiles. All30 shared items were exact matches, copied unchanged; all12 observed theme scores and41 shared occupation labels agreed. The complete76 returned careers are retained. Both services use O*NET, so this is still one measurement family. Full60 versus30-item strong-set overlap ranged from0.846 to0.143 despite high local rank correlation, reinforcing the limits of cutoff gates. Thirteen strong external occupations are absent from the457 matching inventory, mostly performing arts and experienced roles; these are a content-review backlog, not automatic personal matches.

Real-student comprehension, reliability, counselor-panel agreement and longitudinal outcomes remain to be measured. Neither model coverage, service agreement nor subjective synthetic review establishes predictive validity. Original and previously exercised holdouts should not be presented as newly unseen populations.

## Reproduction and refresh

`npm run build` prepares frozen memberships and review data, replays all184 public cases, rebuilds the current chart, frequency tables and cohort summary, and checks hosting size. The Interactive model match chart stays pinned first at Developer. The new review includes a college/graduate-only filter, per-model old/new lists, exact unresolved questions, links to profiles/student copies, current field/profession frequencies and zero-appearance professions. Earlier charts and source records remain accessible as history.

Use `npm test`, `npm run test:exploration`, `npm run test:external`, `npm run review:exploration`, and `node --test tests/model-match-chart.test.js`. This is build-time upkeep, not a scheduled monitoring task. Six owner-only models and actual account responses are never placed in public source, fixtures or external comparisons.
