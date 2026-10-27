# Findings and trace review

The candidate restores every college career connection lost in the earlier
focused experiment: 270/270 in the first cohort and 151/151 in Grok. It does
not improve student-level coverage beyond the current control.

| Group | Models | Current strong | Protected strong | Current degree in first 3 | Protected degree in first 3 |
|---|---:|---:|---:|---:|---:|
| First cohort, all splits | 1000 | 634 | 634 | 499 | 499 |
| Development | 758 | 482 | 482 | 375 | 375 |
| Original holdout | 30 | 2 | 2 | 1 | 1 |
| Fresh holdout | 12 | 2 | 2 | 2 | 2 |
| Expansion holdout | 200 | 148 | 148 | 121 | 121 |
| Grok evaluation | 1000 | 684 | 684 | 518 | 518 |

No students gain or lose either coverage measure versus the current control.
Compared with the rejected focused arm, the original holdout returns from
3 strong / 2 college-covered students to 2 / 1. Do not describe recovery of
college connections as a monotonic improvement for every model or split.

The candidate changes question order for 282 models but changes the actual
question set for only nine (7 first cohort, 2 Grok). Career sets remain
identical for 1,998 models. Variety remains 51 confirmed careers in the first
cohort and 37 in Grok. Protection mostly makes an already effective current
confirmation order explicit; the failed focused cap was the larger issue.

## The two career-level changes

- **Jamie Singh, scale056-0587, development:** General & Operations Managers
  becomes an additional strong interest match. The structured profile already
  names enterprise, coordination, organization, leadership and responsibility
  for an entire organization. Its narrative explicitly asks to learn about
  organizational accountability and difficult resource/workforce decisions.
  Two activity contexts and two defining-interest confirmations support the
  career under unchanged rules. Broad correlation remains negative; that is
  not a reason to delete independently supported interests. This is a
  plausible long-term interest, not evidence of current job readiness or
  direct access to a management role. The student already had college matches,
  so student-level college coverage does not increase.
- **Casey Jones, scale056-0296, development:** bookkeeping loses confirmation.
  The protected schedule asks an office-clerk question at follow-up 23 and gets
  unknown; bookkeeping receives its first defining question at 24 and cannot
  receive the second. In the control both bookkeeping confirmations fit at
  23–24 and receive Yes. No new dislike or contrary evidence was discovered;
  this is an allocation loss. Preserve the unanswered confirmation as unknown
  in the new arm rather than borrowing the control answer. The student still
  has a librarian strong match, so aggregate strong and college coverage hide
  this option-level loss. It is exposed in the case browser.

## Remaining uncertainty and recommendation

The protected run leaves 682 students without any strong match and 983
without a bachelor/graduate career among the first three. Median unknown
follow-ups among models with no strong match:

| Group | Models without strong match | Unknown of 24, median |
|---|---:|---:|
| Development | 276 | 17 |
| Original holdout | 28 | 21 |
| Fresh holdout | 10 | 23.5 |
| Expansion holdout | 52 | 14 |
| Grok evaluation | 316 | 19 |

Retain the current control and the shorter display as separate decisions.
Do not promote this protected candidate on the basis of recovery versus a
known failed arm. Next review high-unknown development cases for missing
activity questions, mappings that fail to represent already stated facts,
and career-specific interests genuinely absent from the profiles. Test only
grounded fixes at fresh 60 + 24; preserve the existing non-bachelor options
and report career-level losses as well as student-level coverage. Keep all
holdout groups separate and do not use their known losses for tuning.

All 4,000 new arm replays used exactly 24 follow-ups after the same 60 official
responses. Current-control question/answer/support parity, canonical scoring
checkpoints and all source hashes passed. No strong career has contrary
evidence. No simulator binding, profile fact, question wording or support
threshold changed. Neither prototype was edited, built or published.

Browser verification: both coverage charts, legend filtering, Grok and original
holdout filters, the new management case and lost bookkeeping case, and mobile
reflow at 390px passed. No browser console errors. The fragment uses one
executable script and preserves the full study dataset; no inert JSON script
dependency is present. Temporary viewport and preview server were reset/closed.

Early checkpoints show only small allocation changes: at 68 questions the first
cohort gains one strong/college-covered model, while Grok has one fewer strong
model. The largest first-cohort degree difference is +2 at 72 questions; all
student-level coverage differences disappear at 84. This is not a material
question-efficiency improvement in these simulated cohorts.
