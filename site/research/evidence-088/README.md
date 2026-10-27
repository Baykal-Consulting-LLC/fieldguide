# Evidence and targeted follow-up replay 0.88

Research-only additive adapter; production 0.87 matching and student questionnaire remain unchanged. Both 1,000-model cohorts are replayed from frozen 0.77 states plus exact 0.78, 0.79 and 0.87 transcripts. Original profiles and holdout assignments are never rewritten.

## Fixed changes

- Testing-documentation scope: explicit circuit testing records plus careful detail checking can support documenting unresolved results without assuming an interest in leading research. Mechanical testing additionally requires organized, careful records. Negative preferences and review holds remain effective.
- Fixed invitation snapshot prioritizes partially supported careers with fewer unresolved checks, up to three career groups and six total questions. Unknown responses may be revisited in this research round using existing typed facts, not repeated indefinitely until a positive result appears.
- Plant-observation and habitat-comparison probes remain diagnostic only: no transfer to advising growers, accountable research programs or pollution decisions.
- Direct official activity answers and exact existing subject checks can invite an adjacent career even when the six-theme average is lower; an invitation never grants specific support.
- Four adjacent occupations: environmental science/protection technicians, forest/conservation technicians, geological technicians and recreation workers. Three distinct specific checks per occupation; environmental sampling remains unknown without its explicit specialty preference.
- All old supported careers and Top ranks are retained. New support fills vacant Top slots. Every supported bachelor/graduate alternative is exposed separately from the Top-three cap.

## Sources and education

Official O*NET 31 Career Interest Types extracts are saved in `data-sources/evidence-088/interests.json` with download URL. Exact occupation profiles: https://www.onetonline.org/link/summary/19-4042.00 , https://www.onetonline.org/link/summary/19-4071.00 , https://www.onetonline.org/link/summary/19-4043.00 , https://www.onetonline.org/link/summary/39-9032.00 .

Environmental and geological technician routes are associate-level preparation; some geological employers require bachelor's study. Forest/conservation technician preparation varies with employer. Recreation worker preparation varies, with high school/workplace training a recognized route. These additions do not count as bachelor/graduate Top merely because postsecondary preparation may be needed.

Every added occupation has a Texas Workforce Commission 2025 lower-paid-worker wage proxy (Austin MSA when available), plus a clearly labeled five-year planning scenario interpolating 45% toward the occupation median. Wage extracts are the existing source datasets; these are not observed entry-by-experience salaries or new verified lifestyle coverage.

## Reproduce and interpret

`node scripts/prepare-evidence-088.mjs` then `node scripts/rerun-evidence-088.mjs`.

`research/evidence-088/results.json.gz` contains full supported lists and exact question-level provenance. The public compressed artifact uses a lossless string pool, omits redundant full support records, and retains all supported degree titles. The dashboard projection uses the same output, not hand-edited totals.

Both cohorts have already informed calibration. Separate holdout reports are comparison checks, not evidence of a new untouched independent validation. Synthetic answers are question-scoped assumptions from frozen explicit typed facts; no text classification, demographics, finances, diagnoses, or occupational stereotypes supplies interests. The 172 original narrative-only profiles cannot acquire inferred positives without typed evidence.

## Observed outcome (paired 2,000-model run)

| Cohort | Supported Top | Bachelor/graduate Top | Any supported bachelor/graduate option |
|---|---:|---:|---:|
| First 1,000 | 889 → 892 | 784 → 788 | 834 → 838 |
| Grok 1,000 | 757 → 759 | 631 → 636 | 678 → 683 |

No prior Top or supported career was removed. 50 original-cohort and 47 Grok models still have a supported degree option below the Top-three cap. New specifically supported career offers: 36 validation-engineer offers in the original cohort, 32 validation-engineer offers in Grok. No new adjacent occupation became supported from broad correlation alone. These offer counts include models already possessing other Top careers; they are not distinct coverage gains.

Of the additional checks, 1,009 / 1,071 original-cohort and 1,820 / 1,941 Grok answers remained unknown. No unknown was filled by an occupation name, demographic trait, or lifestyle target. The large number of unknowns is a property of the frozen profiles' recorded evidence, not measured unwillingness among real students.

Separate holdouts: original 30 retains 26 Top / 21 degree Top; fresh 12 retains 11 / 11; expansion 200 retains 184 Top and retains 165 degree Top. Original development 758 changes 668 → 671 Top and 587 → 591 degree Top.

Final audit additionally distinguishes unmapped answer checks: 484 original-cohort and 1,306 Grok checks had no exact typed simulator binding. These are subsets of unknown answers, not evidence of a student disliking a career. The relevant questions remain in the invitation rather than being skipped for a less relevant bound question.
