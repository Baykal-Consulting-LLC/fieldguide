# Plain-language student flow · 0.31.6

Reviewed the guided results, career library, career cards, match explanations, working-life notes, training labels, financial-scenario headings, next-step display and personal plan.

Career cards now show a short job title, one work description, a plain interest summary, training, pay and the lifestyle verdict. Important training and conflicting-preference notices remain visible. Specific reasons, the answers behind them, skill connections and method explanations are retained under More info. Task-led recommendations say that the student liked several tasks while their wider interests are less similar; this is not relabeled as a strong whole-profile match. Pathway cards have one consolidated answer disclosure.

The final plan leads with the pay actually selected. For a resident physician, that is residency pay; qualified starting pay and later stages remain in More info. Custom-income plans link to the editable budget rather than an unsupported salary stage. Supporting school-cost tables, work-scenario controls, longer action instructions, dates and edit controls are behind More info. Notes and completion controls remain available. Display shortening does not rewrite saved notes, action details, dates or older interests; full exports retain the data.

Newly generated step descriptions use simpler words. Source occupation names, classification data, the official O*NET item wording/order/response options, scoring thresholds, ranking logic, wages and budget calculations are unchanged. Short job titles describe the same catalog roles; physician and dentist scope remains explicit. Licensing is still separate from a degree.

Verification:
- All 408 existing tests passed after the main presentation changes.
- 34 profile/pathway/rendering checks and 81 career/plan/source checks passed after follow-up presentation refinements.
- Three presentation regression checks passed, including the new chosen-pay versus future-pay check, custom-income link, and render-without-mutating-saved-work check.
- Browser QA used an ignored preview copy with separate test storage and account sync disabled only in that copy. At 390px, verified the medicine career card, opened the full match reasons, followed My Plan, opened saved notes, edited a note and reloaded: both the note and completed checkbox survived. Verified selected residency pay before expanding future pay. Checked a task-led writing card at mobile and 1280px: task support and weaker wider interests are both explicit, with no horizontal overflow.
- Mobile section anchors leave room for the sticky menu. These are responsive browser checks, not physical-device tests or new financial/psychometric validation.

Development records remain in the Developer archive. Earlier generated records may use earlier presentation wording.
