# Questionnaire, planner, and persistence browser QA

Run date: 2026-10-16  
Target: `http://127.0.0.1:43211` served from `site/dist`  
Browser: Chrome, agent-created QA tab, separate localhost origin and storage from the public site.

## Covered

- Selected both Quick and Full exploration routes. The Full route was visibly selected before continuing. The questionnaire links to the external official 30-item Mini-IP and 60-item paper Short Form and provides the existing results route; no external assessment was submitted.
- Checked College and Certificate/training context routes and confirmed those route selections remained checked after navigating away and back.
- Nominated the exact occupation “Psychiatric Aide.” It appeared first with the student-choice label. Set Psychiatric Aides to “Explore this career,” Psychiatric Technicians to “I have questions,” and Clinical/Counseling Psychologists to “Set aside for now”; the selections persisted after navigation. The later choice was excluded from candidate slots.
- Opened the Psychiatric Aides reflection page. It showed six original prompts (three shared prompts and three role-linked prompts), with the work description and source links clearly separated from claims about the student.
- Entered all six prompt responses and exercised `answered`, `not-tried`, `unsure`, and `skipped` states. The task-preference prompt retained “not tried,” “New to me,” confidence 5, and its evidence note. The setting/schedule prompt retained “skipped.” All six response/status values, the low-exposure/high-confidence combination, and the evidence note remained after page reload.
- Clicked “Add experiment to my plan” on the Psychiatric Aides occupation page. The page confirmed “Experiment added to My plan,” and the plan displayed the sourced task “Explore one task safely.” Entered a due date (`2026-11-20`), support note, notice prompt, and all four reflection fields, then selected “Ask more questions.” Every field persisted after reload.
- Export control displayed “Your draft has been exported.” I could not verify the downloaded file path: the browser’s download event did not arrive before the 8-second timeout. To exercise the restore path independently, I created a synthetic Fieldguide backup fixture, selected it through the visible Restore draft control, confirmed the restore dialog, and verified the report showed “Restored synthetic experiment.” The planner then contained the fixture’s due date, support, notice, and reflection values.

## Responsive check and limitation

Applied the browser viewport capability with the requested `390 × 844` dimensions. The page continued to report `window.innerWidth × window.innerHeight` as `1200 × 784`, so a true 390-pixel mobile layout could not be verified in this Chrome extension tab. Reset the temporary viewport override afterward; the browser again reports `1200 × 784`.

The QA used only the synthetic `127.0.0.1:43211` origin for draft creation, replacement, and restore. No data on the public origin was cleared or changed.
