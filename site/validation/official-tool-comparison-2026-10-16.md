# Live official-tool comparison — 16 October 2026

Status: **two synthetic profiles completed in the live CareerOneStop Interest Assessment UI**. Actual career results and the rendered theme charts were inspected. This is a qualitative reference comparison, not validation of Fieldguide.

## Tool and isolation

- Form: CareerOneStop Interest Assessment, **30 activities**, five response choices, three pages of ten; the tool identifies itself as based on the O*NET Interest Profiler.
- Entry: <https://www.careeronestop.org/Toolkit/Careers/interest-assessment.aspx>
- No name, age, location, account, student answers or personal information was supplied. All ratings below are fictional.
- The in-app browser was unavailable, and the connected Chrome provider does not support hidden tabs. A separate agent-created Chrome tab was used and closed afterward. Existing tabs were not changed.
- A separate visit to the direct O*NET tool displayed a previously saved profile. Its restart/continue controls were **not** used; that new tab was closed. CareerOneStop was used to avoid overwriting the existing profile.
- Answers were entered with the visible activity controls, not by injecting scores, modifying storage or calling an undocumented API. Results were read at the site's default **Match: High to Low** sort with no education filter.

## Case A — hands-on work with investigative interest

Response scale for reproducibility: 1 Strongly Dislike, 2 Dislike, 3 Unsure, 4 Like, 5 Strongly Like. The site's result chart uses a different zero-based sum scale; do not copy the response digits as raw totals.

Activity ratings in displayed order:

```text
1–10:  5 4 2 2 2 4 5 4 2 2
11–20: 2 3 5 4 2 2 2 2 5 4
21–30: 2 2 2 3 5 4 2 2 2 2
Answer string: 542224542223542222542223542222
```

The fictional student preferred practical building/repair and scientific investigation; computer installation was also liked. Most people-facing, creative and sales activities were disliked.

**Actual visible chart:** Realistic **20**, Investigative **15**, Artistic **5**, Social **5**, Enterprising **5**, Conventional **9**. The page named Realistic, Investigative, Conventional as the strongest areas. [Replay score details](https://www.careeronestop.org/Toolkit/Careers/interest-assessment-riasec-scores.aspx?answers=542224542223542222542223542222).

**Actual visible career results:** **413** careers. The first screen labeled all ten displayed rows **Best**. Examples included Aerospace Engineers; Aerospace Engineering & Operations Technologists & Technicians; Agricultural Engineers; Agricultural Technicians; Aircraft Mechanics & Service Technicians. The initial rows were alphabetically arranged within the visible category, not evidence that the first occupation was uniquely best. [Replay results](https://www.careeronestop.org/Toolkit/Careers/interest-assessment-results.aspx?answers=542224542223542222542223542222).

**Fieldguide comparison principle:** practical/technical and investigative directions should be readily discoverable, with both degree and technical-training routes. Subsequent explicit day-task choices should distinguish building, machinery, engineering and investigation. This does not imply every Realistic field is equally suitable.

## Case B — helping people with investigative interest

```text
1–10:  2 4 2 5 2 2 2 4 2 5
11–20: 2 2 2 4 2 5 2 2 2 4
21–30: 2 5 2 2 2 4 2 5 2 2
Answer string: 242522242522242522242522242522
```

The fictional student strongly preferred helping, guidance, rehabilitation and teaching; liked scientific investigation; and disliked the other activities.

**Actual visible chart:** Realistic **5**, Investigative **15**, Artistic **5**, Social **20**, Enterprising **5**, Conventional **5**. The page named Social, Investigative, Realistic. The third label comes from a four-way low-score tie and is not evidence of a distinctive Realistic preference. [Replay score details](https://www.careeronestop.org/Toolkit/Careers/interest-assessment-riasec-scores.aspx?answers=242522242522242522242522242522).

**Actual visible career results:** **136** careers. Initial **Best** rows included Acute Care Nurses; Adapted Physical Education Specialists; Adult Basic Education / Adult Secondary Education / ESL Instructors; Allergists & Immunologists; and several postsecondary teaching occupations. [Replay results](https://www.careeronestop.org/Toolkit/Careers/interest-assessment-results.aspx?answers=242522242522242522242522242522).

**Fieldguide comparison principle:** healthcare, teaching and social support should be easy to reach. Medical science interest alone cannot choose physician versus dentist, pharmacist, therapist or nurse. Concrete work preferences and preparation details must perform that next step.

## Implications and limits

1. Contrasting answers changed both theme emphasis and the actual occupational return set. Fieldguide should show a similarly sensible directional shift; identical rankings across these cases would be a defect.
2. These are **different questionnaires**. Fieldguide's original conversational questions cannot inherit this tool's validation, numeric cutoffs or exact career ranking. No score-equivalence or accuracy percentage is established by two fictional cases.
3. A third-place theme may be a low-score tie. Do not force three positive-interest labels or treat an arbitrary tied theme as a preference.
4. Official results span several preparation levels. Preserve access to technical and degree routes; do not make salary, college preference or low confidence silently overwrite interest evidence.
5. Do not copy displayed occupation metadata wholesale. For example, the visible Advanced Practice Psychiatric Nurses row used the RN-parent bachelor's education/wage category; that display is not sufficient for Texas APRN qualification. Fieldguide's graduate-training/licensing evidence must remain role-specific.
6. Career counts and occupations may change with the source release. Replay URLs reproduce the synthetic answers, not an immutable historical snapshot.
7. These checks concern interests and exploration, **not aptitude, ability, admissions eligibility, clinical competence or future success**. The live run did not validate Austin salary, tuition or lifestyle calculations.
8. The official [Interest Profiler overview](https://www.onetcenter.org/IP.html) and [career-return methodology](https://www.onetcenter.org/dl_files/IP_Career_Returns.pdf) remain the methodological references. The manual describes full-profile comparison; Fieldguide's literal task connections should be presented as editorial exploration links.

Verification method: live browser accessibility snapshots for activity controls and career results; visual screenshot inspection for chart labels and six numeric bars. The exact charts above were observed, not inferred from the response strings. No app files were edited.
