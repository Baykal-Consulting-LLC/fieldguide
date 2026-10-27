# Short-flow targeting repair 0.94

Research only. The live student flow, occupation inventory, interest weights, support gates, education definitions, and reviewed structured-answer resolver are unchanged.

## Why 0.93 regressed

The first-cohort short targeted arm found 127 models with Top, versus 162 with the repaired answer resolver and ordinary selector. It lost 98 previously covered models while gaining 63. Most lost opportunities were bookkeeping, electronics assembly, and sound production. The selector dropped the initial direct-activity opportunity and spent questions on broader candidates.

## Rejected trial

A complete initial lead followed by four-question adaptive batches improved first-cohort Top to 222, but reduced college Top from 93 to 58 and Grok Top from 167 to 121. That tradeoff is recorded in anchor-first-trial.json.gz and is not a live-flow recommendation.

## Tested repair

Probe the initial activity lead chosen by the existing answer-blind selector, at most five questions. Continue only while the actual answers support continuing. Stop that lead on No, None appeal, or Unfamiliar. Use the remaining budget one question at a time, recomputing evidence after every answer. An unfamiliar career-specific check defers that career for this short round; it does not become negative interest evidence or remove the exploration option. Keep the maximum at twelve questions, counting every unfamiliar response.

Selection receives current matching rows, question definitions, seen-question keys, and already recorded answers only. It cannot see synthetic profile facts, future simulated answers, demographics, preferred education, or evaluation outcomes. The same question-scoped answer resolver from 0.93 supplies synthetic answers; absent interests remain unknown. Career-specific checks stay profession scoped; shared activity choices stay field scoped. No outcome union or retained unasked support is allowed.

Both 1,000-model cohorts start from saved lifestyle and official 60-item responses, with all earlier follow-ups withheld. Their extensive-answer matches are a different condition and are not replaced by this experiment. Frozen inputs and split membership are preserved. Original/fresh holdouts have no typed preference facts and are not evaluable in this fresh-answer simulation. Other split results are separately reported; prior results have informed development, so these splits are not unseen validation.

The prototypes have been selected using synthetic evaluation results. Improvements describe these fixtures, not independent real-student validity or a measured success rate. Review actual students and question burden before adopting the live flow.

## Selected case review limits

The replay restores sound production for scale056-0007 and grok075-0017, electronics assembly for scale056-0016, and bookkeeping for scale056-0015 using existing positive structured answers. It also records losses such as scale056-0087 rather than unioning results from different question schedules.

Grok075-0010 supports the legal-research and case-comparison questions, but its narrative remains unsure about formally representing a client while its typed responsibility list includes representation. This is a source-profile consistency issue and a reason to ask about the full professional role before treating interest support as commitment. The targeting benchmark does not resolve narrative/typed-fact conflicts or independently validate all newly reached occupations. No hidden text classifier or invented answer was added to resolve that conflict.
