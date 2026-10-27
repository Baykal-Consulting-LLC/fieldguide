# Earlier exploration and clearer explanations · 0.40.0

Promising profession comparisons now appear before the ranked career list in both the student match page and My Plan. When broader comparisons are available and none has been reviewed, the list is labeled **First matches**. After one focused comparison is reviewed, it becomes **Top matches**, based on current answers; further exploration stays available. This is an exploration milestone, not a claim that every possible career has been evaluated.

Each invitation and comparison summary explains the relevant evidence gap and links to the actual work question. The explanations distinguish unanswered work, clinical responsibilities and preparation conflicts, shared task evidence, wider profile differences, unfamiliar work, and activities the student says do not appeal. Existing answers are shown when a question has already been encountered in another field. Unfamiliar work is not treated as dislike.

Optional Fieldguide comparison questions now offer three distinct responses: unfamiliar, not interested, or unsure/skip. These responses persist with the guide and can be revised. Selecting a work option clears an earlier unfamiliar/declined marker for that question. Official O*NET questions, wording, responses, scores and eligibility thresholds are unchanged.

A side-by-side disclosure compares the first three invitations on training example/duration, costs before aid with included expense categories, first paid stage and monthly room after the lifestyle budget. It uses existing cost and pay references. Monthly room includes entered loan payments; unfunded education costs remain separate. Cost examples differ in scope, which is shown in each row rather than treated as equivalent tuition quotes.

The pinned interactive model match chart rebuilds with the student app. Each model now carries the same First/Top label and comparison explanations, with links to the relevant question. CSV exports include the stage and evidence gaps. Frozen answers, historic choices, and recorded comparison previews remain intact; invitations are not counted as confirmed or lifestyle-sustaining matches.

## New diagnostic scenarios

Six new, explicitly authored fictional scenarios contrast repair with engineering design, financial recordkeeping with accounting explanation, and food preparation with food science. Their biographies, official response patterns and exact follow-up responses were fixed and hashed before first execution; see [inputs](../research/early-exploration-040/cases.json) and [results](../validation/early-exploration-040.json).

All six expected support/exclusion checks pass: engineering, accounting and food science can become leading matches when the work answers support them; college willingness alone does not promote an unsupported profession. All six official score vectors stay unchanged. The scenarios were authored by the implementing agent with knowledge of the rules. They are regression diagnostics, not independent holdouts, observed student behavior, or a predictive-validity study.

## Frozen-model replay

All 148 public profiles retain their original answers, six scores, leading offers, other offers and lifestyle-sustaining options from 0.39.0. There are 131 First-match labels because no focused comparison has yet been reviewed. Lifestyle counts remain 68 with a leading match covering the budget, 57 with another option covering it and 23 with none. The six private profiles were replayed read-only: four leading matches and two other options cover the budget. No private records are bundled. The [release replay](../validation/early-exploration-040-replay.json) contains aggregate verification only.
