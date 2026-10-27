# Approach 1 · research0.90

App-owned research experiment; live student flow0.87 and original frozen profiles remain unchanged. A1 stays on shared1.0.4 while A2 uses its independently adopted release. No canonical/shared managed assets are changed.

## Targeting

Count independent subject/method/responsibility domains (3 for expanded professions) or two specific-interest domains plus two task-context domains (4 for guided professions). Repeated positive examples cannot inflate completion. Guided professions can surface their missing task-context questions as well as missing specific checks; exact option IDs are simulated, never prose or occupation-title matches. Existing field/profession No and explicit none feedback are preserved. Rank completion, then unresolved-check count, then broad correlation, with stable ID ties. Where no supported degree alternative exists, select at most one degree-career lane first only if two specific domains already support that candidate. No education score bonus, inferred preparation interest, or mandatory degree candidate. Fill remaining slots from the same evidence-ranked pool. At most3 careers/6 checks; one snapshot before answering. Existing supported degree options below the Top-three cap are not re-proven.

## Plant science

The existing subject and method checks remain. The existing grower-advising responsibility question is preserved. A separate question asks about investigation design, method/results documentation and communicating evidence limits. This reflects a research/reporting role within Soil and Plant Scientists (O*NET19-1013.00), rather than making every scientist an adviser:
https://www.onetonline.org/link/summary/19-1013.00

A positive simulated research answer requires explicit plant interest, explicit research responsibility, explaining evidence, and organization or precision. Plants, garden observation, fieldwork or testing alone cannot supply those interests. An explicit dislike of the required method blocks support. No text classification or added profile facts. The alternative question never writes an answer to the advising question. An explicit No to advising remains recorded and does not preclude a separately supported research role; a No to subject/method or unresolved review hold still blocks support. The accepted route and any declined advising route are retained in evidence.

All previous supported careers and Top ranks remain; newly supported careers fill vacant Top slots only. All supported bachelor/graduate alternatives are counted independently of the three-Top cap. Associate/training routes remain separate. Wage and budget assumptions are unchanged.

## Validation

Both frozen1,000-model cohorts are replayed. Development758, original holdout30, earlier fresh holdout12, expansion holdout200 and Grok1000 are separately reported. Both synthetic sets have informed calibration; they are not pristine blind validation or measured student accuracy. Seven prior manual source-conflict holds remain unknown. Follow-up activity is a simulation audit, not predicted student completion or newly observed interests.

Full results and exact evidence: results.json.gz. Public transport is losslessly string-pooled. Source hashes and invariants: validation.json. Changes in which questions are reached do not guarantee new supported matches.

## Final paired results

First cohort: supported Top 894 → 895; bachelor/graduate Top 790 → 792; any supported bachelor/graduate option 841 → 843. Development 673 → 674 Top and 593 → 594 degree Top. Original 30 and fresh 12 holdouts unchanged; expansion holdout 200 retains 184 Top and moves 165 → 166 degree Top.

Grok cohort: 769 Top and 657 degree Top, unchanged; 704 have any supported degree option. Degree-gap models receiving a degree check increase from 132/159 to 139/159 in the first cohort and 220/296 to 259/296 in Grok. This measures question reach, not new supported matches. All 43 plant-research questions remain unknown. The two new supported careers (Robotics Engineers for scale056-0306 and Electronics Engineers for scale056-0570) use explicit circuit/motion/program-testing or design/accurate-record facts; no missing interests were inferred. Existing Top ordering is retained. Live student flow remains unchanged.
