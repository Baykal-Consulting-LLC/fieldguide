# Additional live service comparison · CareerOneStop

We executed two actual public CareerOneStop Interest Assessment sessions in a normal browser, using only frozen public fictional model responses. No account, licensing workaround, registration, private profile or real student answers were used. This is a second deployed service comparison, **not** independent psychometric validation: CareerOneStop explicitly identifies O*NET Web Services as its matching source.

[CareerOneStop assessment](https://www.careeronestop.org/Toolkit/Careers/interest-assessment.aspx) · [Official methodology/help](https://www.careeronestop.org/Toolkit/Careers/interest-assessment-help.aspx)

The raw browser extracts, complete result sets, screenshots, source item crosswalk, chart evidence, hashes and offline comparison are in `research/validation-053-careeronestop/`. The previous official O*NET comparison freeze was left unchanged.

## Scope and method

Before seeing CareerOneStop results, we chose two contrasting existing development models: life-005, whose broad profile is strongest in Artistic, and new049-001, strongest in Enterprising. These are a convenience interoperability panel. Neither the original nor the fresh holdout was used to tune this comparison.

CareerOneStop presents 30 questions across three pages. Every question was an exact text match to an item in our frozen official 60-item Short Form. We copied the original response for that exact item, rather than inventing analogous answers. All 30 external items match; this covers 30/60 local items and 30/30 external items, with five items per RIASEC dimension. The five response columns retain their original ordinal meaning and 1–5 encoding. Original model profiles and answers are untouched.

We completed the questions through visible form controls, clicked Next to obtain results, selected the site's 500-record page-size option and captured all reported careers. The two runs returned 39 and 37 careers. SOC identifiers came from the actual occupation links, not title guessing. The six bar labels were read from the saved result screenshots and independently recomputed from the exact copied answers.

We compare two distinct things:

1. **Same 30 answers:** independent Pearson calculation on our existing O*NET occupational vectors versus CareerOneStop fit labels and strong-career membership on shared SOCs. This is an implementation/data agreement check.
2. **Original 60 versus shared 30:** our local numeric occupation correlations under the complete instrument versus the subset. This measures sensitivity to question sampling; it is not a rank-correlation measurement between two observed service rankings.

CareerOneStop's Match:High to Low display groups Best/Great/Good and then lists titles alphabetically within those groups. It does not expose numeric correlations. Therefore no Spearman or Kendall is claimed against its display order. Table positions are not treated as distinct relevance scores.

## Observed results

| Metric | life-005 | new049-001 |
|---|---:|---:|
| Complete careers captured | 39 | 37 |
| Exact shared items | 30 | 30 |
| Observed R,I,A,S,E,C scores | 11,10,16,11,7,10 | 10,10,6,11,16,6 |
| Score sums agree | 6/6 | 6/6 |
| Returned careers with shared SOC/vector | 22 | 19 |
| Fit labels agree on those careers | 22/22 | 19/19 |
| Strong-set Jaccard with same 30 answers | 1.000 | 1.000 |
| Strong service careers outside our vector catalog | 8 | 5 |
| Strong-set Jaccard versus original 60 answers | 0.846 | 0.143 |
| Local 60-vs-30 Spearman over 429 occupation vectors | 0.993 | 0.965 |
| Local 60-vs-30 Kendall tau-b | 0.931 | 0.851 |
| Local 60-vs-30 top-5 Jaccard | 1.000 | 1.000 |

The second case illustrates why membership alone is a misleading comparison target. Its five highest local correlations are the same under 60 and 30 items, and overall ranks remain similar, yet the set above a strong-fit cutoff changes substantially. A threshold crossing can reflect the narrower item sample rather than a new meaningful occupational preference. We should retain continuous evidence, explicit uncertainty and career exploration access; do not tune weights merely to reproduce a vendor's strong labels.

The artistic run returned visual/design/performing-arts options; the enterprising run returned leadership, coordination and sales options. These are coherent broad themes, but several are experienced management roles. Neither an official interest fit label nor this small agreement check establishes entry-level readiness or whether every specific career is a reasonable personal choice. That question remains for the separate biography-and-answer review, and later actual student research.

## Reproduce and audit

From the site root:

```sh
python3 research/validation-053-careeronestop/compare.py
```

This runs offline against recorded browser results. It asserts that all 30 item texts/themes match their frozen local counterparts, every copied answer matches the earlier model response, the encoded result URL contains the same 30 answers, all six expected chart sums agree and returned SOCs are distinct. It preserves unavailable numeric ranking metrics as null and discloses careers outside the shared catalog.

`summary.json` is the compact report. `results.json` retains every returned SOC, title and fit band. The raw packets additionally preserve the source rows and browser DOM snapshots. Screenshots below are evidence of the synthetic sessions, not student records.

![CareerOneStop artistic synthetic profile](../research/validation-053-careeronestop/life-005-results.png)

![CareerOneStop enterprising synthetic profile](../research/validation-053-careeronestop/new049-001-results.png)

Limits: two development cases, one measurement family, convenience selection, frozen local catalog/version, no provider population norm comparison, no scores from proprietary instruments and no predictive-validity claim. More commercial-service runs require actual accessible instruments and a frozen item/response/occupation crosswalk; documentation alone is not a completed run.


The13 outside-vector careers were also checked against the full457 matching inventory: all13 are absent there, rather than merely lacking a vector. Eight performing-arts/fashion roles and five leadership/coordination roles warrant a content-coverage review. Broad external labels alone do not justify assigning them to these models; no professional-specific interest responses were invented. The full unabridged occupation directory may have further entries, but it is separate from the active matching inventory.
