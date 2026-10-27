# O*NET to Fieldguide transition · 0.31.12

A short screen now separates the 60 official O*NET items from Fieldguide's everyday-work follow-ups. It uses the approved wording:

> Let’s get more specific.
>
> You’ve finished the O*NET interest questions. Next, we’ll explore everyday work in more detail.
>
> The choices now run from “Really not for me” to “I’d love this.” Keep focusing on what you’d enjoy—not your skills, training, or pay.

## Behavior

- After the last official answer, Keep going opens the first required follow-up.
- Back returns to the final official question and preserves the answer. Back from the first follow-up returns to this explanation.
- Reloading on the transition keeps the transition. Continuing is saved, so reloading a follow-up does not repeat it.
- Existing drafts with follow-up answers resume without interruption.
- O*NET wording, labels, scores, question order and matching remain unchanged. This is a navigation and presentation update.

## Verification

40 relevant automated tests passed, covering the transition, questionnaire, encouragement, restart, student rendering and Developer links. Five new transition tests cover section boundaries, stored state, legacy drafts, incomplete profiles and approved copy.

An isolated fictional medicine student was tested in the browser from question 60 through the transition and first follow-up, including Back and reload. Viewports: 390 × 844 and 320 × 740. No horizontal overflow; body copy 18px; both actions visible. No real account or student data was modified.

Record: [Phone checks](../validation/followup-transition-phone-2026-10-18.json).
