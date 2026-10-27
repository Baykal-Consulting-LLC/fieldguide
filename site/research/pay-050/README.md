# Missing Top-offer pay evidence, 0.50

Bounded review of the 30 distinct expanded professions with unknown first pay in the 0.49 public base cohort's Top lists. Diagnostic variants are excluded from inventory counts. No profiles, answers, matching code or ranking were changed by this research.

## Evidence files

- `top-missing-pay-inventory.json`: profession IDs/titles and affected public model IDs, extracted using `scripts/read-match-chart.mjs` (manifest plus cohort parts).
- `onet-2025-wage-evidence.json`: official O*NET local wage tables, including national, Texas and Austin values and available Texas local geography rows. Each page has exact URL, retrieval time, SHA-256 of source HTML and BLS wage-year attribution.
- `pay-evidence.json`: annotated evidence plus suggested qualified-role planning proxy, TWC entry proxy, exact/broader SOC mapping and stage-specific limitations.
- `twc-2025-msa-entrywg-source.json`: 30 relevant rows from live TexasWages API. Full payload had 831 rows and compared equal to the existing `data-sources/twc-2025-msa-entrywg.json`; exact source payload hash is recorded.
- `annotate-evidence.py`: recreates reviewed annotations from the extracted sources.

## Recommended use

Display wage evidence for all 30 professions. The `planningProxy` selects annual Austin 10th-percentile employee wages where published, then Texas, then national. A local-data fallback must remain visible. Show 25th percentile as sensitivity, with median only as occupational context. These are qualified-role estimates, not observed first salaries, postdoc pay or promises.

Eighteen professions are candidates for a qualified-role proxy scenario. Twelve have further stage or mapping issues: six research/faculty routes, two related-experience roles, and four broad-SOC specialties. `firstPaidStageCoverageCandidate` is false for every row because this research does not establish an actual first-job salary. This does not imply that no student could cover a budget in these professions.

The earliest paid-stage coverage and qualified-role scenario should be separate chart measures. A statistical update must not appear as an improvement caused by new student interest, nor should a pending profession become Top because its parent occupation pays well. Keep all before/after chart cohorts and financial assumptions comparable.

Training costs, aid, loans, licensing and funding during study remain separately unverified. Salary evidence does not imply zero preparation cost.

## Sources and interpretation

[BLS May 2025 OEWS tables](https://www.bls.gov/oes/tables.htm), released May 15, 2026, are current as retrieved October 20, 2026 UTC. Direct BLS ZIP retrieval returned HTTP 403; the official O*NET pages supplied the same reference-year occupational wage distributions. Their URLs are recorded per profession.

[BLS guidance](https://www.bls.gov/oes/earnings.htm) says a person new to a field may expect wages near the 10th or 25th percentile, while experience, education, industry and location influence the wage. This supports a labeled low-wage planning scenario, not an assertion that those percentiles measure starting salaries.

[BLS technical notes](https://www.bls.gov/oes/2025/may/oes_tec.htm) explain that wage and salary employment includes full- and part-time workers, excludes self-employed workers and unincorporated owners/partners, and that annual estimates commonly use 2,080 hours except occupations with annual contract pay. They do not guarantee year-round employment.

[TWC definitions](https://texaswages.com/Home/About) define entry wage as the mean of the lowest-paid third in an occupation and location. This is an official published proxy, not a percentile boundary or longitudinal first-employment statistic. The current [annual MSA table](https://texaswages.com/MSAWages) labels its data 2025.

[BLS medical scientists](https://www.bls.gov/ooh/life-physical-and-social-science/medical-scientists.htm), [biochemists/biophysicists](https://www.bls.gov/ooh/life-physical-and-social-science/biochemists-and-biophysicists.htm), and [physicists/astronomers](https://www.bls.gov/ooh/life-physical-and-social-science/physicists-and-astronomers.htm) describe postdoctoral entry routes. [Postsecondary teaching](https://www.bls.gov/ooh/education-training-and-library/postsecondary-teachers.htm) includes part-time appointments and, in some sciences, prior postdoctoral research. Retain unresolved earlier paid stages.

[BLS editors](https://www.bls.gov/ooh/media-and-communication/editors.htm) typically require previous writing/proofreading experience. [Music directors/composers](https://www.bls.gov/ooh/entertainment-and-sports/music-directors-and-composers.htm) mostly require related work experience. Their role-level wages do not establish the preceding paid stage.

Four mappings deserve a separate specialty review before coverage claims: Video Game Designers → Web and Digital Interface Designers; GIS Technologists and Technicians → Computer Occupations, All Other; Biologists → Biological Scientists, All Other; Data Warehousing Specialists → Database Architects. Other detailed specialties (Logistics Analysts; Poets/Lyricists/Creative Writers) also display explicit parent occupation labels; any scenario remains based on that broader employee group.
