# Developer section and student-screen cleanup

Release 0.25.0. Matching engine 3.2.0 and profile schema 6.0.0 remain unchanged.

## Access

Open Developer in the student app footer, or /developer.html. Current matching reviews, question banks, walkthroughs, financial evidence, and catalog coverage are grouped at the top. Search the archive for retained research, source audits, and implementation notes. Reports link back to Developer; source and coverage pages also keep their original URLs.

The section is public, like the existing site. It contains authored research and fictional development records, not the user's local saved draft. No account or authorization system was added.

## Student screens

- Replace raw correlations, occupational vectors, aggregation formulas, and task-count diagnostics with a brief explanation of the whole profile and work choices.
- Keep personal reasons and preference conflicts visible. Official interest scores and all matching calculations are unchanged.
- Replace wage-proxy and internal evidence labels with estimated starting pay, planning estimate, or published employer example. Financial limitations and source links remain under More info.
- Replace an obsolete methodology screen with the current short explanation. Remove the old five-section completion counter from the current plan.
- Keep existing answers, actions, notes, financial inputs, and exports intact.
- Label the older release 0.19.0 calibration report as historical. Software assertion counts are not evidence of predictive accuracy.

## Verification

A repeatable rendering audit covers 2,023 rendered screen variants: all 117 career pages and library profiles, all 470 salary stages in each of the guided and library previews, 117 education screens, 121 plan states, 339 profile-question views, 99 profession questions, 90 lifestyle choices, 54 fictional scenario result pairs, and supporting screens. It checks missing values, escaped template fragments, malformed links and rendering exceptions. This is bounded HTML-rendering coverage, not exhaustive browser or psychometric validation.

All 335 automated regression tests passed.

Browser checks sample the actual student career suggestion, expanded explanation, salary lifestyle link and return, app footer, Developer landing page, search, report navigation and archive. Local fictional fixtures are removed before publication. The user's hosted draft is not changed.

## Maintaining this section

Run `npm run review:developer` after adding research, validation or implementation records. It refreshes the rendering audit and republishes the record index locally. Review new records before publishing; do not add personal student data, credentials or private material. The source helper handles the separate hosting publication step.
