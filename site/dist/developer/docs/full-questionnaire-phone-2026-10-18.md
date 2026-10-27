# Full questionnaire phone walkthrough · 0.31.15

A fresh fictional student completed the student UI from Start through lifestyle, the full official interest survey, focused follow-ups, experience, priorities, working life, health follow-ups, career selection and My Plan.

## What was completed

| Part | Questions or choices |
| --- | ---: |
| Lifestyle | 9 |
| Official O*NET interests | 60 |
| Focused everyday-work questions | 18 |
| Experience | 12 |
| Priorities | 1 screen, 3 selections |
| Work style & education | 4 |
| Health profession follow-ups | 11 |

The scripted student’s interest scores were R 11, I 31, A 12, S 32, E 11, C 26, each out of 40. Health and teaching were the supported pathways. Science appeared separately as work the student wanted to try. The refined result highlighted family medicine. The student chose it and received a plan that distinguished residency pay from qualified physician pay.

## Two issues fixed

1. **Introductions repeated during review.** After reading an introduction, Back showed it again, and moving forward over the boundary replayed it. Read introductions are now skipped on routine Back and forward navigation. An unread introduction still appears, and a pending introduction survives pause/resume.
2. **First questions repeated introduction copy as banners.** After acknowledging the everyday-work or experience introduction, the early question screens no longer repeat it. Optional How to decide remains on every question.

Back from the first official question now returns to the lifestyle summary after its introduction has been read. Back from the first profession question returns to pathways. An already visited profession field resumes directly.

These changes replace the initial Back behavior described in the earlier transition release records; those historical records remain available.

## Saved-work verification

- Paused and resumed during interests, before the experience introduction, after it, while priorities were selected before Next, during education choices, before profession follow-ups, and during profession questions.
- Revisited all five profile sections. The saved responses remained selected and introductions did not replay.
- Marked a plan step complete and saved a reflection. Revisited the questionnaire, returned to My Plan, and reloaded. The step, reflection, chosen career and residency salary stage remained.
- Used the app’s Export My Plan action. Compared all 60 official answers, 18 work choices, 12 experience responses, work/education responses and all 11 health follow-ups with the authored input choices. All matched. The completed step and reflection also matched.

## Checks and practical limits

109 relevant automated tests passed, including complete focused and all-question routes, repeat-boundary navigation, saved-state restoration, unchanged matching, question order, rendering, restart and all 12 profession introductions. Syntax checks passed. Developer link checks were rerun after this record was added.

The full browser route used a 390 × 844 phone viewport. Career matches, profile review and the saved-plan round trip were also checked at 320 × 740. Observed question screens had no horizontal overflow. The official question answers were entered before the fix; the same draft continued after rebuilding and every affected section boundary was rechecked.

This was a browser preview using isolated fictional data. No physical phone, real student account or production cloud-sync flow was tested. Assessment content, scoring and matching were unchanged.

[Observed route and answer-export checks](../validation/full-questionnaire-phone-2026-10-18.json)
