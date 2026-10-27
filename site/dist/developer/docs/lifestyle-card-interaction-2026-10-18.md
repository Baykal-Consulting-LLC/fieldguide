# Lifestyle card interaction fix · 0.31.2

Removed hover background/border selection styling from lifestyle cards. A touch browser can retain hover after a tap; that appearance must not imply an answer to the next question. Only the current question's actual saved choice receives selected styling. Keyboard focus indicators remain.

Removed the repeated “Choose this” / “See my picture” footer from every choice card. The whole card remains the button and continues immediately. Each card now exposes its actual selected state with aria-pressed.

Verified with ten lifestyle regression tests, including all nine new-question states and returning to an earlier saved choice. In an isolated browser preview with separate test storage and account sync disabled, chose home, transport, groceries and dining, then confirmed Travel had five unselected cards, neutral backgrounds and no repeated action footer. Returning to Home retained its actual choice. Inspected a 390px-wide layout. This was browser QA at a phone-sized viewport, not a direct physical iOS Safari test.

Existing student data, scoring, budget amounts and navigation are unchanged.

## Compact cards · 0.31.3

Removed the simple-to-lavish scale from all nine lifestyle questions. Cards now size to their content, with less padding and smaller gaps. Body text remains 18px; mobile headings remain 22px.

Ten lifestyle tests passed. Observed the automatic progression from Home through Entertainment in an isolated preview. At a 390px viewport, all five Entertainment cards measured about 121px tall, compared with the prior 170px minimum. The new question had five unselected cards, no scale or repeated action labels. This was a responsive browser check, not a physical iOS Safari test.
