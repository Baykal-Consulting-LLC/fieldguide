# Narrative-led fictional student models, 0.32

Authored October 18, 2026. Source file: [student-models-032.js](../calibration/student-models-032.js).

These **24 fictional high-school students** provide synthetic regression and review coverage across the 12 existing career families. They are not observations, a representative adolescent sample, a psychometric validation study, a norm group, or evidence of individual predictive accuracy. Their names do not imply a gender, ethnicity, disability, income background, or measured ability.

## Authoring and freeze

Each model begins with a narrative of enjoyed tasks, avoided tasks, actual exposure, future goals, education tolerance and lifestyle. Responses were then authored against the actual question wording. The official responses follow the 60-item API sequence and are saved explicitly under `onet-sf-01` through `onet-sf-60`. They were **not** generated from an occupation's interest vector, a target RIASEC score, a desired career result, existing fictional profile helpers, or recommendation outputs.

I read the current state/answer API and question sources without importing their runtime modules during authoring. In particular, profession choices were selected by the actual option text; the builder saves their stable option IDs. Model import itself has no app imports. No recommendation, score, correlation, family ranking, profession ranking or plan result was computed before the freeze. The only pre-freeze correction was a static identifier check: the nonexistent review target `middle-school-teacher` was replaced with the existing generic `teaching` ID. This changed no answer and followed no engine output.

**Frozen answer-and-target payload SHA-256:**

`9ca9ba4ca7af4b482fbbdad79a9d35b85dc8d936e9a25b43a2e712a702b607c6`

The JS metadata specifies the exact canonicalization and preserves hashes of the official, field, profession and lifestyle source files inspected. The hash includes review targets as well as all answer-bearing data, so changing an expectation after a failing run is detectable. After handoff, compare engine changes against this frozen fixture; record any subsequently discovered narrative or schema error as a versioned correction with its reason. Do not silently rewrite answers to obtain a favored profession.

## Why these variations are appropriate to examine

Developmental evidence motivates open, varied cases; it does not provide the fictional answers or validate this app:

- Hoff, Briley, Wee and Rounds aggregated 49 longitudinal studies with 20,639 participants and found age-related changes in interests across adolescence and young adulthood. This supports avoiding a permanent identity interpretation. The publication is a primary research synthesis, not a Fieldguide study. [Normative changes in interests from adolescence to adulthood, published online March 1, 2018; *Psychological Bulletin* April 2018](https://pubmed.ncbi.nlm.nih.gov/29494193/).
- Hirschi's primary studies included 210 eleventh graders and a one-year sample of 289 seventh-to-eighth graders, examining differentiated/elevated interests and exploration. This motivates examining low-differentiation and broadly positive patterns without inventing a precise winner. It does not establish a particular cutoff for our software. [Development and Criterion Validity of Differentiated and Elevated Vocational Interests in Adolescence, published online April 23, 2009](https://journals.sagepub.com/doi/10.1177/1069072709334237).
- Rogers and Creed's longitudinal study of 631 students in grades 10–12 distinguished self-efficacy, goals, supports, planning and exploration. We therefore retain confidence/exposure and goals as separate context rather than relabeling them aptitude. This observational study does not prove that changing a confidence response causes career success. [A longitudinal examination of adolescent career planning and exploration using a social cognitive career theory framework, published online January 27, 2010](https://onlinelibrary.wiley.com/doi/10.1016/j.adolescence.2009.12.010).

Sources were retrieved through official publisher/PubMed abstracts on October 18, 2026. The studies do not calibrate our synthetic students, demographic fairness or professional suitability. The existing official O*NET instrument/version is preserved; none of this work changes licensed wording, labels or scoring.

## Runnable schema and API

```js
import {
  studentModels,
  studentModelMetadata,
  studentModelInvariants,
  buildStudentModelState
} from '../calibration/student-models-032.js';

const spec = studentModels.find(s => s.id === 'm32-novice-care');
const state = await buildStudentModelState(spec); // Or pass spec.id.
// Review spec.reviewTargets independently of whatever the engine returns.
// A later harness may call its explicitly versioned recommendation functions.
```

`buildStudentModelState` is **async**. It imports `freshState` and `buildLifestyleInputs` only when explicitly called after the fixture has been frozen. It constructs a fresh, mutable state on every call. It does not call matching/scoring/recommendation functions, select a career, create a plan, or populate `suggestedFamilies` from targets. The app's `freshState` dependency graph includes matching definitions, which is why imports are deferred. All model objects, metadata and invariants are deeply frozen.

| Field | Meaning |
|---|---|
| `id`, `name`, `grade` | Stable fictional identity, descriptive label, high-school grade. |
| `narrative` | Likes, dislikes, current goal, education tolerance and envisioned lifestyle. |
| `observedContext` | Specific fictional exposure/history; not a performance-test result. |
| `unmeasuredLimits` | What the story does not establish. Nothing here is inferred by the engine. |
| `tags` | Developer coverage labels, never ranking inputs. |
| `officialAnswers` | Exactly 60 stable official IDs; integer 1–5 API response values. No `untried`. |
| `fieldPreferences` | All 36 original field questions by stable ID; 1–5 or `untried`. |
| `skills` | All 12 current experience levels: `new`, `supported`, `independent`, `teach`. These remain self-report. |
| `priorities` | Two or three actual priority IDs. |
| `context` | Actual company/rhythm options and setting/education arrays. |
| `depth` | Selected family's complete question-ID → selected option-ID arrays. Empty arrays are authored no-selection responses; selecting every option is deliberately indiscriminate in the broad-positive case. |
| `selectedFamily` | The branch the fictional student chose to explore, **not** an inferred recommended family. |
| `lifestyle` | `rent`/`own` plus all nine current choice IDs and zero-based option indexes. These describe a future planning picture, not current household spending or income. |
| `reviewTargets` | Nonexclusive acceptable families, roles to inspect, explicit route conflict if any, and `rankRequired:false`. These are not consumed in state construction. |

Only currently authored branch answers are available. Passing `{family}` to the builder requires that branch to exist in `spec.depth`; the builder never fabricates answers for another branch. A harness can clone a spec for a separately documented counterfactual while keeping the frozen baseline intact. There is deliberately no free-text scoring, hidden grade weighting, measured-ability parameter, target-income-to-career rule or outcome probability.

## Coverage fixed before outcomes

| Model ID | Distinct review purpose |
|---|---|
| `m32-medical-reasoning` | Diagnosis, long professional training, ordinary spending; physician/PA comparison. |
| `m32-dental-precision` | Oral treatment and careful craft context; dentistry distinguished from nursing/assisting. |
| `m32-novice-care` | Nursing interest with low exposure and modest confidence; no beginner exclusion. |
| `m32-care-route-tension` | Physician tasks but assisting route; expensive goals remain a financial conflict rather than changing interests. |
| `m32-visual-editor` | Layout/revision evidence; graphic and interface design alternatives. |
| `m32-quiet-writer` | Strong specific writing evidence without music, performance, sales or a mandated broad artistic profile. |
| `m32-biology-stories` | Science/creative mix; neither interest should erase the other. |
| `m32-web-maker` | Building/debugging a useful digital project. |
| `m32-tech-cautious` | Device troubleshooting and patient explanations despite cautious self-description. |
| `m32-budget-volunteer` | Financial records and accuracy rather than selling/investment excitement. |
| `m32-debate-law` | Evidence, rights and professional-study ambition; compare practical legal routes. |
| `m32-water-observer` | Outdoor evidence and repeated investigation without patient care. |
| `m32-bridge-testing` | Engineering design/safety constraints; future ownership has upfront implications. |
| `m32-circuit-learner` | Electrical task detail, paid learning, safe supervised introduction. |
| `m32-machine-repair` | Mechanical diagnosis and checking repairs. |
| `m32-food-without-sales` | Specific cooking/hygiene/timing interests without restaurant management or sales. |
| `m32-salon-listener` | Practical creative technique plus client consultation. |
| `m32-tutor-explainer` | Adapting explanations; peer tutoring is not teacher qualification. |
| `m32-emergency-team` | Approved immediate care/team response rather than general diagnosis. |
| `m32-stock-systems` | Practical inventory routines and safe handling. |
| `m32-route-organizer` | Routes and records without assumed commercial driving competence. |
| `m32-event-office` | Appointments/information accuracy in a service team. |
| `m32-still-exploring` | Uniform Unsure, all original field items untried, no selected profession details. |
| `m32-many-positive` | Uniform Like, all fields positive, all creative options selected; no manufactured precise winner. |

The writing and food cases are **broad-pattern contrast candidates** authored from specific task preferences. Their actual correlations have intentionally not been inspected. A particular correlation sign/threshold is not part of the fixture's expected result. If an engine produces a mismatch, record it and inspect the explanation rather than editing the official answers until the desired role wins.

## Invariants and review criteria

The ten exported invariants distinguish mechanical assertions from reviewer judgments. Before any engine evaluation:

1. Preserve the exact official IDs and integer response domain; original field answers remain separate.
2. Every authored profession option and lifestyle index must exist in the inspected source bank. New/retired IDs require a deliberate migration.
3. Changing only experience levels must not change official interests or turn low familiarity into an occupation ban. Experience can change suggested learning activities or the explanation of readiness.
4. Changing only lifestyle choices must not rewrite official scores or stated task interests. Financial gaps must remain visible, with context about training and upfront costs.
5. Clinical responsibility/preparation conflicts must be explained. Physician, nursing, PA, dentist, hygienist and assisting routes cannot be treated as substitutes with identical requirements.
6. All-Unsure/all-Like and indiscriminate depth cases must not produce a manufactured differentiated identity or force three supported careers.
7. Specific task evidence and broad-profile disagreement should both remain inspectable; the review does not prescribe one fixed rank.
8. No narrative trait, grade, skill label or synthetically authored expectation is a measured aptitude, admissions probability, success prediction or reference standard for real students.
9. An acceptable family/role is a discussion target, not a mandatory exact ranking. Evaluate relevance, alternative coverage, contradictory explanations and inappropriate exclusions separately.
10. Each constructed state must be independent; repeated calls, edits and reset must not mutate exported fixtures or another student's state.

For subsequent calibration, report results for each frozen model, explanation basis, education/lifestyle conflicts and invariant violations before changing rules. Reserve an independent human review and real-student formative study for claims about usefulness; do not call 1,440 authored official responses “1,440 student tests.”

## Verification performed

- JS syntax check passed.
- A data-only import and static source parsing verified **24 models, 1,440 official answers, 864 field answers, 12-family coverage**, 12 experience-level entries and nine lifestyle choices per model.
- Every profession question/option ID was checked against source text without running matching.
- Review-role identifiers were checked against the existing profession vocabulary; this found and corrected the single generic teaching target noted above.
- After the answer-and-target freeze, all 24 runtime states were constructed successfully with the deferred builder. Independent mutable copies were verified by editing one copy and checking the other and the frozen fixture. This imports the app dependency graph and runs state/lifestyle construction only. No score, matching, recommendation or plan-generation function was called or tuned by this author.
