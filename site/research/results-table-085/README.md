# Complete, field-grouped results table

The live results board now renders every filtered supported and exploration option in one semantic table, grouped by its primary field (or the selected field when scoped). Top, Supported, Explore, and Mixed chips keep confidence distinct. No twelve-row cap or load-more button remains. Top cards are retained as highlights; the three exploration-card preview is removed.

Long career names wrap at word boundaries in a dedicated column. On narrow screens the table scrolls locally rather than squeezing names between salary and save controls. It has sticky column headers, a pinned career column on wider screens, field row-group headings, accessible labels, and a bounded scroll region; all rows remain in the DOM.

The college/no-college selectors draw from the full supported-plus-exploration union, independent of table filters. They preserve the established education-lane rules, group options by field, and label their match status. Selected exploration careers display Needs confirmation. Existing salaries, matching evidence, and cohort data are unchanged.

Focused tests cover uncapped field groups, mixed Top/exploration rendering, candidate-only default comparisons, education-lane isolation, selecting exploration comparisons, and account/model isolation. Browser checks use frozen public fictional model views only.
