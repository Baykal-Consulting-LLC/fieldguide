# Career matches and plan icons · 0.31.9

The shared career-field icon now follows each career through guided matches, the main job choice, alternatives, and the work section of My Plan. The field is resolved from the career rather than the last field the student visited. All 117 careers have a family connection. Emergency medicine support, logistics, industrial engineering, and urban planning preserve their primary catalog groups.

Training, pay, life, and next steps reuse the existing book, saving, home, and plan symbols in the section-label line. Numeric section prefixes are removed. Sticky navigation keeps its short text labels. Icons add no extra row or card padding, and decorative SVGs remain hidden from assistive technology.

Phone review: fictional medicine, creative-work, and trades students at 320px and 390px. Compared match cards, plan summary, and five plan sections with the prior release. No measured card height increased and no horizontal page overflow was observed. The Pay shortcut still positions its section below the sticky navigation. Full observed comparison: `validation/plan-icons-mobile-2026-10-18.json`.

Regression checks cover rendering, career switching, saved work, matching, and the final plan. One test depended on the removed numbered label; it now finds the next-steps section by its stable section ID. Its saved-history assertions are unchanged.
