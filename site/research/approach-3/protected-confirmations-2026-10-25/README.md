# Protected confirmation sets — research only

One frozen candidate versus the current research control, across both public
1,000-model cohorts. Neither prototype is modified, built or published.

Every arm starts with a new state containing the same 60 recorded official
interest responses and lifestyle inputs. No previous field or profession
answers are carried forward. All 24 follow-ups, including unknown responses,
count against the matching-question budget. Lifestyle questions are separate.

The selector sees only recorded answers and canonical matching rows. It cannot
read biographies, facts, future answers, cohort identifiers, pay or education.
The unchanged structured simulator consults the profile only after selection.

`protocol.json` freezes the candidate and source hashes before the execution
pilot or cohort runs. There is no outcome-based parameter tuning. Current
control question and match parity are asserted for every model, as are
canonical engine parity at 60, 64, 68, 72, 76 and 84 questions.

The previous focused selector's frozen fresh-run outcomes are compared only
after the new replays finish; none of its answers enters a new state.
Development (758), original holdout (30), fresh holdout (12), expansion holdout
(200), and Grok evaluation (1,000) remain separate. Previously inspected
holdouts are not pristine unseen validation. Synthetic outcomes do not
establish accuracy for real students.

The protected candidate also removes the previous eight-career cap and returns
to the current discovery scoring. Therefore recovery versus that failed arm
does not isolate the causal effect of protection. Compare against the current
control to assess the additional allocation policy.

Run the five scheduling guard tests from the parent workspace:

    node --test outputs/a3-protected-confirmations-2026-10-25/selector.test.mjs

Run the paired replays from `site/` under its ordinary data lease:

    python3 scripts/shared-foundation.py run -- node ../outputs/a3-protected-confirmations-2026-10-25/workers.mjs

Summarize from the parent workspace:

    python3 outputs/a3-protected-confirmations-2026-10-25/summarize.py

`shard-*.json.gz` contains all answer traces, support evidence and protection
episodes. `summary.json` contains paired changes and the missed/recovered
college connections with exact question references. All writes stay in this
research directory or the thread's visualization directory. No shared release
or cross-prototype update is needed; Approach 2's independent changes are not
inputs to this study.

## Updated report renderer

The inline report now renders charts, totals, tables and its default case as
HTML before its small filter script runs. The source is
`inline-repair/template.html`; rebuild the inline report with:

    python3 outputs/a3-protected-confirmations-2026-10-25/inline-repair/build.py

The unchanged study payload is archived in `inline-repair/payload.json`.
Runtime and data-preservation checks are in `inline-repair/verification.json`.
The previous dynamic report template is historical and should not be used
to regenerate this inline report.
