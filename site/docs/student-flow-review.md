# Student walkthrough · 0.8.1

October 16, 2026

## Changes from the walkthrough

- Broad interests and subject areas allow up to three choices each. Their careers are combined without duplicates. Chosen areas appear in My Plan and its export.
- Career cards open the role immediately. Income and lifestyle presets advance immediately. Continue remains for multiple selections and typed income. When all choices lead to one role or one area, the redundant screen is skipped; Back returns to the screen actually used.
- Every displayed salary stage and headline has a “Lifestyle this salary supports” link. It carries an explicit career and stage to an Austin budget using the full-precision pay. Salary previews do not overwrite the plan. Students can go back, compare stages, or explicitly keep a salary.
- Preview calculations use employee tax estimates rather than a saved manual take-home override, so different salaries produce different budgets. Existing spending assumptions are retained. The modeled retirement deduction is capped to the employee limit. Shortfalls stay visible.
- Adding an alternative leaves the student on the career page. Making it the main career updates pay, preparation, and the three current-career actions. Prior actions remain editable under More saved steps.
- Experience dropdowns became three visible selection buttons. Confidence uses a keyboard-accessible slider with five labeled ticks. An untouched control remains unanswered; tapping the midpoint deliberately records 3. Existing answers survive migration and reload.
- Skill titles and pale explanations became one dark, readable prompt at the same size throughout.
- Reasoning quizzes were removed from the journey and reflection display. Five sections remain: interests, priorities, confidence/experience, real experience, and personal reflection. Old quiz links show the real-experience section. Old draft quiz answers are retained for data compatibility and never drive career recommendations.

## Verification

All six entries reached a personal plan containing preparation, pay, Austin lifestyle, next actions, and selected interests. The full five-section journey was completed through the browser using the new controls, without quiz questions. Non-college tattoo exploration retained the college-plus note and a visible budget shortfall; the income route retained its goal and selected later salary stage.

Browser checks covered back navigation, previewing without changing the plan, explicitly keeping a stage, saving an alternative without jumping pages, changing the primary career, reload, untouched sliders, midpoint taps, arrow keys, and saved values. Ten revised screens at 390px had no horizontal overflow or visible text below 16px. See [the browser record](../validation/student-flow-browser-qa.json).

Unit coverage adds combined interests, three-choice bounds, deduplication, route filtering, migration, all 65 careers × four salary previews, exact salary inputs, non-mutation, recovery links, preview return destinations, and skipping redundant screens. Existing calibration is regression coverage for finite score/input/financial spaces; it is not proof of psychometric validity or observed experience-specific salary growth. Underlying source figures and model factors are unchanged in this release.
