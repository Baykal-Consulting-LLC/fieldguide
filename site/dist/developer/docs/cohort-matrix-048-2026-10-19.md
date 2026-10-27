# Cohort matrix · release 0.48

The cohort matrix provides two views of the same fictional population: a distribution table and an unpaginated model-by-model overview. It is linked from the pinned model review area on Developer. The matching logic and frozen answers are unchanged.

## Population and coverage gaps

The public snapshot contains every canonical model referenced by the four frozen cohort summaries: 70 development, 30 holdout, 24 additional, and 24 legacy cases, totaling 148. “Legacy” names an earlier batch; it does not mean older students. Every public biography states age 16. None has separate structured optional skill answers. Described strengths are authored biography statements, not measured skill or aptitude scores. No standardized clinical assessments or validated aptitude measurements are recorded.

Six owner-only models join the same table after existing owner authentication. The browser reads them through `getPrivateReviewCases`, transforms them with the same function, and retains them in memory. Private raw records, derived profile rows, and private counts are not included in the public snapshot. Authentication changes remove private rows and close profile details; pending requests are checked against the current account before their results are used. CSV exports use only the current authorized selection. No assessment answers, profiles or matching records are written by this screen.

## Two views

**Distribution matrix:** 147 feature rows in 17 groups, with Full selection and five cohort columns. The cell shows percentage and count/denominator. Darker green shows a larger share. Six blue rows show mean official interest scores out of 40. Click a cell for contributing models and exact source passages. Select a feature group for a focused table.

**All model profiles:** one row per selected model, with compact columns for background, interests, described skills, motivations, characteristics, health topics, learning/access, supports and constraints. Long content is abbreviated in the overview; clicking a cell opens every original biography field, life-history event, unfamiliar activity, author tag, open question and recorded preference. Links lead to the existing model history and match chart.

Search, cohort, and a particular feature restrict the population. The feature-group selector changes visible features only. Reset restores the complete available population and distribution view. Distribution CSV exports current feature rows and every cohort denominator. Full profiles CSV includes every biography field for selected models, not only visible columns. CSV text is quoted and formula-leading cells are neutralized.

## Source and calculations

`scripts/build-cohort-matrix.mjs` reads the four summaries and canonical JSON cases under `validation/blind-2026-10-18`. Each published row has a SHA-256 fingerprint of its source case. The build recomputes six interest scores from recorded official answers using the unchanged official scorer and asserts equality with each case’s frozen raw scores.

`dist/cohort-features.js` contains the coding definitions and exact source scopes. `cohortRow` preserves the complete biography and records the source segments for each coded feature. Themes are editorial keyword indexes, not validated psychological categories. The on-page rules disclose each pattern and source scope.

Counts deduplicate by model within each feature. Features overlap; percentages must not be added. Each column denominator is the full filtered population in that cohort. Empty columns show a dash, not zero. Interest means use complete recorded profiles and show their valid-score denominator. Public and owner-only populations are explicitly labeled.

## Interpretation

Health rows mean topic mentions anywhere in the biography, which may concern a relative, history, questions or negation. They are not student diagnoses or prevalence. Explicit leading negative statements such as “no diagnosed anxiety implied” are excluded from health-topic counts; the original text remains in the profile. Uncoded text means unknown, not a negative assessment. Supports do not imply illness. Learning/neurodivergence and physical access remain separate groups.

Pronouns do not establish gender. Family/cultural and language labels report explicit narrative wording, not inferred ethnicity, religion or fluency. Location is the first named US state in the location field; the original location text is available in detail. Financial categories describe wording, not estimated income bands. Interests, skills and motivations are coded only from their respective current-life source lists; career outcomes and household circumstances do not supply these traits.

This cohort was authored to exercise application behavior. Its distribution is useful for finding gaps in the test models; it does not describe a real or representative student population.
