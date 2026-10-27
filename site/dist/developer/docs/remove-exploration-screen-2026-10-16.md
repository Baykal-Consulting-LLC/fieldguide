# Remove the separate exploration-plan screen

User requested removal of the entire screen and every button leading to it.

- Removed the exploration-plan renderer and its entry buttons from assessment results, fields, specialties, tasks, and careers.
- Career fields are now immediately visible even with uncertain or blank questionnaire answers. There is no extra disclosure before choosing fields.
- Older saved exploration drafts opening My Plan resume at `#/guide/paths`. Home offers Resume rather than claiming an unfinished career plan is ready.
- Existing career plans and the full guided assessment remain available.
- Legacy action/interest data and export compatibility remain so removal does not delete earlier work. Earlier activities remain available after a career is chosen. Read-only uncertainty examples no longer embed the removed screen.

Verification: restored a fictional legacy draft through the browser, opened My Plan, verified direct career fields, continued to specialties, and compared a real full-draft export. Questionnaire, priorities, confidence, actions, notes, dates, evidence, reflection, and financial inputs were unchanged. No career was assigned. Regression checks cover all six entry points, legacy routing, and existing career plans.
