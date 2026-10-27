# Two independent answer-executor checks

1. Full existing questionnaire: all 2,000 frozen public profiles, identical per-model exposure, common current matcher 0.63. Previous response codes and outcomes are withheld from Grok. Frozen profile evidence includes explicitly stated activity preferences and initial field context; these are not hidden from the actor. No answer is selected using a matching result.
2. Narrow targeted round: same frozen 0.76 context on both sides; only answers to its fixed follow-up invitations vary. This does not replace the entire earlier transcript and is reported separately from the full-questionnaire comparison.

The original 1,000 and Grok-authored 1,000 are never combined into a single success rate. Original development and three older holdouts retain separate denominators. The Grok cohort informed 0.76 corrections, so it is now post-holdout calibration, not pristine independent validation. Both populations are synthetic; neither AI executor is student ground truth.

The full survey uses low-effort Grok CLI default model in isolated sessions, with tools, web and subagents disabled by the invocation/contract. Question indices are opaque and occupation links, weights, pay metadata and prior outputs are withheld. Every answer is checked for schema, question coverage, allowed values and profile ID. Final responses use direct question-index keys and per-question allowed-code constraints. Earlier positional transport pilots are excluded and re-executed with that uniform schema. Schema-only retries and interrupted incomplete requests are retained as execution metadata; completed valid batches are never replaced for performance reasons. An unsupported minimal-effort connectivity pilot was rejected by the CLI and contributes no responses.

Before publication, replay unchanged answers through the same adapter. All 2,000 Top lists must reproduce exactly, and the original current-matcher totals must remain 789 Top / 653 bachelor-graduate Top, with Grok 674 / 548. An official interest code 0 (cannot judge) is scored as the instrument's 3 (Unsure); raw unknown responses are retained in transcripts. Multi-choice `none` is normalized as −1, not conflated with unfamiliar.

Reproduce:

- `node scripts/executor-077/export.mjs` exports profiles, instrument and frozen states. Public-only IDs are verified.
- `python3 scripts/executor-077/generate.py` runs the independent CLI answer executor. This is never launched by the Site build.
- `python3 scripts/executor-077/seal.py` verifies every actual prompt, profile, question ID, response code, model identity and single-call transcript before sealing the 2,000 keyed records.
- `node scripts/executor-077/compare.mjs --identity-check` verifies the transport and common matcher.
- `node scripts/executor-077/compare.mjs` consumes the sealed 2,000-response artifact.
- `python3 scripts/executor-077/followups.py` runs the separately frozen targeted invitations.

Profile descriptions and answer rationales are not runtime matching features. This research uses Grok to interpret fictional profiles offline, solely to construct multiple-choice responses. More positive responses and more recommendations are not evidence of greater accuracy. Exact question disagreements, career changes, fields, routes and earnings remain inspectable.

The existing-answer arm is heterogeneous: authored answers in the 172 narrative original cases, structured simulation for 828 procedural fixtures, and frozen general responses plus structured detailed-question bindings for the 1,000 Grok-authored cases. It is compared with a fresh Grok interest-answer replay, not with a newly run second Codex LLM. Lifestyle, strengths, context and feasibility inputs remain fixed.
