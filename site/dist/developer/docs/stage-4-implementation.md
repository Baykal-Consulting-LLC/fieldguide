# Stage 4 implementation

October 16, 2026 · Fieldguide analysis 1.0.0

## Student flow

Open **Enter results**, copy the exact external interest form, date, source reference, possible scale bounds, and all six scores, then check them against the source. The paper form retains its official whole-number 0–10 counts; online form bounds must be copied from their own documentation. Changing the form clears incompatible scores and resets source checks.

Add external ability dimensions if available, preserving names, scales, source interpretation, reference populations, and any supplied intervals. Missing norms flag percentiles for review. These results are displayed separately and never remove subjects or generate aptitude cutoffs.

Add a student-nominated subject and link real experiences to any of eight academic directions. Select priorities, record values in the source's own language, and keep confidence separate from exposure. Review input status before opening **My fieldguide**.

The visual report shows original scores, source detail, priorities, ability evidence, an exploration agenda, college subjects, representative career links, credential caveats, experiments, and counselor questions. It exposes reasons for every suggested starting point. Students can reorder directions, set them aside, add any nominated subject, browse all directions, and save experiments to their plan.

## Analysis boundaries

This release implements a transparent editorial exploration method rather than every future operation in the [stage 3 design](../../research/06-stage-3-analysis-design.md). There is no API connection, official career-return reproduction, occupation-profile correlation, calculated CIP–SOC mapping, or predictive model.

Complete, appropriate, source-checked O*NET records can supply themes at the top two distinct score levels. Observed ties remain ties. Equal profiles, differences of at most 5% of the declared scale span, missing dimensions, unconfirmed forms, invalid scale bounds, and unchecked sources produce no interest-based routing. The near-flat rule and theme selection are editorial heuristics, not tests of significance or published score cutoffs.

The theme-to-direction map is declared in `dist/analysis.js`. It connects activities to academic conversation starters, not standardized occupation interest vectors. Student preference and experience supply separate reasons. All eight directions remain available; catalog order breaks editorial ties rather than asserting a fit rank. The student's explicit ordering takes precedence. Missing ability scores are never zeros. Shared battery references are identified and no independent confirming votes are counted.

Every render recomputes claims from the current evidence. A source correction removes dependent interest reasons. The fictional example is generated from a fresh, separate state, uses invented evidence, disables personal-data-changing controls, and does not modify the saved personal draft.

## Data handling

The application uses browser-local storage under the existing version 1 key. It extends and sanitizes stage 2 drafts without deleting older responses. It does not send responses to an application server or AI service. Private hosting requires the owner's account but does not create separate student accounts or cross-device synchronization.

The UI uses a simplified internal state model; it does not claim JSON Schema conformance to the [future assessment-import contract](../../analysis/assessment-result.schema.json). A later adapter can support formal external result imports. Currently, source-result entry is manual and full-draft restore accepts Fieldguide's own backup format only.

Personal experience, preparation, values, and nomination notes are hidden from the visual report and report export unless the inclusion checkbox is selected. Ability-source interpretation remains attributed report evidence. Full-draft backups include all entries, including hidden notes. Exported files must be handled accordingly. Printing includes displayed report sections and expanded evidence detail; the user controls open panels and note inclusion.

## Sources and content

The report links to official O*NET occupational profiles and the Interest Profiler manual, plus NCES crosswalk guidance. Career pages were checked October 16, 2026. Subject-to-career connections and preparation questions are editorial and are not guaranteed degree-to-job routes. Each actual college curriculum, credential, and local entry requirement needs independent checking.

Career examples: commercial/industrial design (27-1021.00), software development (15-1252.00), social science research assistance (19-4061.00), environmental science (19-2041.00), market research (13-1161.00), writing (27-3043.00), mechanical engineering (17-2141.00), middle school teaching (25-2022.00). These eight examples are not exhaustive career coverage.

## Verification

Automated tests cover score completeness, zero versus blank, ties, flat profiles, source checks, form changes, scale bounds, missing ability information, percentile comparison groups, shared battery references, student choice, source correction, deterministic output, fictional isolation, draft migration, note inclusion, and escaping user text. Original activity/state tests remain in the suite.

Browser verification covers manual entry through report generation, a percentile without norms, hidden notes, adding an experiment, setting a direction aside, exported report content, and save/reload behavior. Desktop/mobile layout, source disclosures, and backup restore are checked as part of release QA. These are software checks; counselor review and student comprehension sessions remain necessary to evaluate the counseling experience.

## Education and financial context extension

The user requested source-backed education routes, tuition/net price and aid, minimum and typical requirements, and realistic financial expectations on every broad pathway and specific career. Parallel research specifies that extension. Broad pathways must link multiple specific occupations and programs; they cannot have one invented pathway salary or generic tuition. Earnings percentiles must not be labeled as experience bands. No financial metric should silently select or reorder the student's interests.
