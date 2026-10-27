# Exploring without a forced career · October 16, 2026

## What was missing

The questionnaire already withheld a differentiated winner for all-unknown and flat responses, and confidence did not affect interest ranking. But the guided flow still needed a chosen career to complete My Plan. It also allowed three high ratings in one interest theme, surrounded by 27 unknown or blank answers, to highlight a field. An older saved career could remain in state when starting again. Those behaviors were unsuitable for an undecided student.

## Changes

- Add an explicit, saved **exploration plan** that needs no profession, college major, salary, or tuition estimate. Students can reach it from the field, specialty, work-task, and career-list steps, as well as the optional assessment-summary screen.
- Retain original interest ratings, priorities, liked activities, and any fields the student explicitly chooses. Suggested fields are never silently converted into chosen fields or professions.
- Provide three concrete actions: try an accessible activity or two, notice what felt interesting/difficult, and discuss a next class/club/supervised experience with a teacher, counselor, or trusted adult. If two fields are chosen, there is a different sampler for each, then reflection/conversation. No paid course, internship placement, or professional access is assumed.
- Low self-reported confidence adds beginner support. It does not reduce interest connections, rank careers down, infer aptitude, or exclude college. Skipped confidence stays unknown.
- Withhold custom theme/field connections until there are at least three numeric activity ratings in each of the six themes. This is a conservative editorial completeness rule, not a reliability threshold or psychometric validation. Unknown answers do not become zeroes. Explicitly liked individual activities remain visible as clues. Official imported results retain their separate source/scale handling.
- Give distinct language to all-high, neutral, and all-low flat answers. All-high means broad enjoyment; all-low means these prompts have not connected. Neither produces a forced winner. All-low exploration suggests trying something different from the prompts.
- When there is no supported field, emphasize one exploration-plan action and tuck the full field list under an optional disclosure. No disabled “choose interests” continuation appears until a student actually chooses fields.
- Keep earlier careers, actions, and financial inputs intact. An exploration plan is an explicit mode: its displayed report and export do not reuse that older career or salary. Choosing a career later restores a normal career plan.
- Preserve student-edited steps, dates, and completion on reopening. If an earlier action list is already full, show/export the new guidance without broken editing controls or discarding old actions.

Questionnaire prompts remain version 2.0.0. Editorial matching method is now 2.2.0. No financial estimate was changed in this release.

## Three reproducible fictional students

Exact fixtures: `dist/uncertainty-examples.js`. Read-only public examples: `#/student-examples/mixed`, `#/student-examples/low-confidence`, `#/student-examples/not-sure`.

| Student | Evidence and outcome | Useful plan |
|---|---|---|
| Mixed interests | Enjoys creating, helping, and investigating; optional fields include design, health, and teaching. Explicitly chooses creative and health exploration. No profession is assigned. | Make a visual project; explore a health question; compare experiences with a trusted adult and choose a next class/activity. |
| Low confidence | Helping/science interests remain visible with four confidence ratings of 1/5 and little experience. The same interests with confidence 5/5 produce identical interest connections and career ordering. | Try a supported beginner health explanation; keep notes; discuss a next step. College and clinical-career exploration remain available. |
| Mostly not sure | Three creative likes; 27 unfamiliar responses. Confidence is skipped. No field is highlighted and no ability/confidence level is inferred. | Try two contrasting accessible activities; record what felt interesting or difficult; discuss a next class/club/experience and revisit afterward. |

Each ends with primaryCareer:null, salary:null, salaryStage:null in its actual browser-downloaded plan export. No family or career choice is required. The baseline fixtures and plan exports are saved in `validation/uncertainty-plan-examples-2026-10-16.json`; actual browser evidence is in `validation/uncertainty-browser-walkthroughs-2026-10-16.json`.

## Verification and limits

Three real browser UI journeys on separate local origins: 30 activity responses, priorities, confidence (or an explicit skip), project/reflection, optional field choices, exploration-plan completion, reopening, and actual exports. A mixed-interest action was also edited, dated, marked complete, and checked after reload.

Regression cases include all unfamiliar, all blank, all neutral, all high, all low, all five sections skipped, sparse concentrated likes, confidence-only changes, income/housing changes, an older saved career/budget, edited actions, resuming a career plan, and a full earlier action list. The previous four career-focused examples remain covered by their regression tests. Existing financial, official-scale, and arithmetic calibration groups were rerun unchanged.

These are synthetic usability, consistency, and regression checks. They do not establish validity, reliability, admission readiness, future earnings, or predictive career success. The original prompts are not the official [O*NET Interest Profiler](https://www.onetcenter.org/IP.html). Interest, self-reported confidence/experience, and measured ability evidence remain separate, consistent with the distinctions in the [O*NET content model](https://www.onetcenter.org/content.html).
