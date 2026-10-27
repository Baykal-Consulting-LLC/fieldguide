# Results landing 0.81

The approved shortlist-first board is now the default for plan, profession results and explorer landing routes. Existing matching and saved answer schemas are unchanged. Empty own plans start with lifestyle selection. Field-scoped result routes retain their field scope.

The old results and plan renderers remain at #/retired-v1/results and #/retired-v1/plan. Existing career details, assessment, notes, funding and plan actions remain available; no prior answers, chosen career or notes are reset.

Own-plan data is derived from the current explorer matcher and existing salary/lifestyle models in the authenticated app. Account storage remains in the parent app; a same-origin presentation frame receives only its display data. Both sides validate message origin and window source. Career saving is validated against the current offers and persisted through the existing account workflow. The frame cannot alter assessment answers or lifestyle inputs.

The separate model browser reuses the existing frozen simulator 0.79/0.78 public payloads and a compact public index. It shows all 2,000 fictional profiles. Original development, original holdout, earlier fresh holdout, expansion holdout and Grok evaluation labels remain separate. Model recommendations use saved 0.79 research offers; own-plan recommendations use current live rules. Model actions cannot write into an account. Missing interests and five-year estimates are not invented.

The latest visual feedback is applied to both the design preview and live board: needed-income label, compact Top/Other chips in chart rows, stronger color zones, larger profession names and pay.

Validation covers frozen Top IDs for all 2,000 models, original holdout sizes, pay provenance, current and retired routes, model/own-plan isolation, message-source checks, saving and dialog viewport positioning. Browser automation surfaces were unavailable, so DOM/layout and signed-in account interactions could not be visually verified. User screenshots informed the UI changes.
