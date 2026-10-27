# Exploration → career plan: preservation walkthrough

A fictional student from the earlier mixed-interest browser walkthrough completed a visual biology project and a health explanation. They recorded what they noticed, retained an edited instruction and November 1 target date, narrowed their active focus from creative + health to design, chose graphic design, completed preparation and a salary/lifestyle preview, and reopened/exported the final career plan.

## Verified in the browser

- Two completed activities remain complete; a third, unfinished conversation step remains unfinished.
- Edited instructions and the target date are unchanged.
- Both activity notes remain available in the career plan’s explicit **My earlier exploration** section.
- A 1,620-character note survives reload and career transition intact.
- Real before/after plan exports preserve all prior activity objects exactly, including IDs, notes, instructions, dates and done status.
- All 30 original questionnaire responses match the earlier fictional student fixture.
- Creative and health interests remain in history while the active career focus becomes design.

Actual exported evidence: `validation/plan-transition-browser-2026-10-16.json`. Read-only demonstration: `#/student-examples/next-step`. Its concise notes illustrate the same flow; the longer stress-test note remains in the validation evidence.

## Bugs corrected

1. Plan exports previously omitted observation/support fields and action IDs. They now carry the complete supported action record and a separate earlier-exploration section.
2. Existing interfaces accepted 2,000-character observations but draft sanitization shortened them to 1,000 on reload. Accepted notes now retain up to 2,000 characters consistently.
3. Earlier chosen fields, areas and work interests could be pruned or cleared when narrowing/restarting. A bounded, ID-checked exploration history now retains them, along with earlier liked activities and priorities. These historical clues are not presented as current match scores.
4. Current plan cards now have a distinct **What I noticed** disclosure. Observations stay separate from editable action instructions. Previously entered learning/enjoyment/difficulty/surprise/support fields stay visible and editable.
5. Earlier exploration steps have an explicit place in the career plan rather than disappearing into a generic saved-step list. The current career still has three relevant next actions; history does not create duplicate editor IDs.
6. Legacy exploration drafts acquire history before choices are narrowed. Existing action records remain intact. Historical choices already lost before this release cannot be reconstructed; no new history is invented for them.
7. An exploration plan does not reapply an earlier career’s salary during startup.
8. Release asset URLs are stamped consistently so an existing browser loads the updated model, state and interface together. The initial cached browser reproduced the old truncation behavior; the same draft passed after loading the complete new release.

## Regression coverage

Exploration → career → reload/export/restore; 2,000-character notes in every supported observation field; homepage restart; refocusing fields; changing careers and returning without duplicate actions; returning to exploration without adopting old pay; legacy migration; bounded malformed history; escaping note content; existing uncertain and four career-focused journeys.

No questionnaire scoring, financial amounts, career requirements or aptitude interpretation changed. Written notes are retained, not automatically interpreted into a career recommendation. Browser testing used a fictional localhost draft; the user’s production draft was not edited.
