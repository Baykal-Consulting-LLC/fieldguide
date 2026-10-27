"""Read-only quality review; no response, rule, ranking or source-profile mutation."""
from pathlib import Path
from collections import Counter
import csv,gzip,hashlib,json
R=Path(__file__).resolve().parents[2]; H=Path(__file__).resolve().parent; O=R.parent/'outputs';O.mkdir(exist_ok=True)
B=json.loads(gzip.decompress((R/'research/evidence-071/results.json.gz').read_bytes())); A=json.loads(gzip.decompress((H/'audit.json.gz').read_bytes())); BM={r['id']:r for r in B['rows']}
def degree(ps):return any(any(x['key'] in ('college','graduate') for x in p['routes']) for p in ps)
def clean(c):return not c['supported'] and not c.get('confirmation') and not c['negativeTopics'] and not any(q['response']=='no' or q['hold'] for q in c['checks'])
def task(c):return clean(c) and len(c['checks'])==2 and all(q['response']=='yes' for q in c['checks']) and len(c['taskDomains'])<2
def ready(c):return clean(c) and bool(c['checks']) and any(q['response'] is None for q in c['checks']) and all(q['response']=='yes' or q['response'] is None and q['bindingSatisfied'] for q in c['checks'])
def one(c):return clean(c) and bool(c['checks']) and sum(q['response']!='yes' for q in c['checks'])==1 and bool(c['specificDomains'])
LABELS={'below-cap':'Supported degree already outside Top three','binding':'Unasked defining checks with rule-level evidence to review','activity':'Both defining checks Yes; distinct activity evidence incomplete','one-check':'One defining check unresolved; answer not assumed','broader':'Broader exploration: multiple missing or contrary checks','exposure':'No usable typed interest evidence'}
def category(r):
 if r['degreeOutsideTop']:return 'below-cap'
 if any(task(c) for c in r['candidates']):return 'activity'
 if any(ready(c) for c in r['candidates']):return 'binding'
 if any(one(c) for c in r['candidates']):return 'one-check'
 return 'broader' if r['ledger']['yes'] else 'exposure'
remaining=[r for r in A['rows'] if not degree(r['top'])]
assert len(remaining)==309 and sum(r['noTop'] for r in remaining)==182
counts={k:{'models':sum(category(r)==k for r in remaining),'noTop':sum(category(r)==k and r['noTop'] for r in remaining)} for k in LABELS}
assert {k:v['models'] for k,v in counts.items()}=={'below-cap':67,'binding':9,'activity':15,'one-check':136,'broader':81,'exposure':1}
assert sum(v['models'] for v in counts.values())==309
COHORTS={'development':'Development','holdout':'Original holdout','holdout049':'Fresh holdout','holdout056':'Expanded holdout'}
cohorts={k:{'models':len(rs:=[r for r in B['rows'] if r['cohort']==k]),'noTop':sum(not r['afterTop'] for r in rs),'noDegreeTop':sum(not degree(r['afterTop']) for r in rs),'belowCap':sum(not degree(r['afterTop']) and degree(r['afterSupported']) for r in rs),'newClaims':sum(len(r['newSupported']) for r in rs),'reclassified':sum(len(r['reclassified']) for r in rs)} for k in COHORTS}
notes={
 'degree-15125100':('Reasonable connection','Concrete saved code/debugging choices support learning to program. Isabel also explicitly enjoys debugging; Aisha needs coding versus test-documentation choices kept distinguishable.','Trace a tiny program failure, design a repeatable test without changing code, sketch an interface, or not sure.'),
 'degree-15125300':('Reasonable connection','The evidence contains actual software testing plus accurate records and explanation. It is not a generic quality or health-care inference.','Compare two failure reports and choose which test to try next; include a non-testing alternative and not sure.'),
 'industrial-design':('Reasonable connection','Useful objects, physical prototypes, design and making/testing are explicit. These four connections are defensible; do not convert support needs or documentation difficulties into disinterest.','Compare two useful-object designs and revise the part that affects how someone uses it, or prefer another creative activity.'),
 'librarian':('Reasonable connection; inspect source breadth','Reference help, source comparison and information organization are concrete. The original saved choices add evidence beyond hobbies. Source roots are reused across multiple gates; broad-pattern conflicts need explanation. Imani remains a more tentative case because her overall profile is near-flat and sustained information work remains uncertain.','Help someone locate and compare reliable sources, preserve a collection without helping users, investigate a different topic, or not sure.'),
 'accounting':('Reasonable connection; clarify sustained work','Valentina has actual inventory/proceeds records and saved financial-checking choices. This goes beyond comparing prices. Willingness to do repeated reconciliation deserves confirmation before emphasizing an audit career.','Reconcile a small set of records repeatedly and investigate discrepancies, compare purchase prices only, or not sure.'),
 'food-science':('Promising connection; clarify science context','Ingredient comparison, repeatable testing and explicit research interest support food-science exploration. Preparing meals alone would not. Some profiles reject chemistry or numerical work, so the specific science route needs a fair introduction rather than an automatic rejection or confident blanket Top label.','Compare measured results from two ingredient changes and investigate why they differ, improve a recipe by feel, or not sure.'),
 'degree-19201200':('Reasonable connection; clarify research route','Motion/mechanism comparisons, numerical methods, testing and research willingness are explicit. Astronomy should not be mandatory. This supports physics exploration without claiming advanced ability, doctoral readiness or guaranteed graduate-study interest.','Use repeated measurements to compare a motion prediction and explain its limits, improve a working mechanism, or not sure.'),
 'exercise-physiology':('Promising connection; clarify physiology context','These profiles have movement, measurement/testing and patient-care willingness. That is stronger than enjoying sport. The bank still needs to distinguish physiological/health monitoring from coaching performance or participation.','Compare how pulse and recovery change in a supervised activity, improve sporting technique without health measurements, or not sure.'),
 'degree-13112100':('Promising connection; clarify event responsibility','Enterprise, coordination, organization and concrete financial reconciliation support a real connection. Performing arts is unnecessary. General venture planning does not by itself confirm interest in event logistics, supplier changes or representing a client.','Revise a small event plan when a supplier or cost changes, choose activities without handling commitments, or not sure.'),
 'public-relations':('Promising connection; clarify public representation','Audience messages, explanation/persuasion and accuracy provide a plausible bridge. Repeated public communication, handling criticism and communicating for a group are more distinctive than generic marketing or negotiating a purchase. Writing/media dislikes need scoped exploration, not wholesale exclusion from communication careers.','Prepare a brief group update, check how it is understood and respond to criticism, negotiate a purchase, or not sure.'),
 'social-research':('Promising connection; clarify research tasks','Community-policy evidence, investigation, organized records and accuracy support qualitative research assistance. Do not infer enjoyment of statistical computing when quantitative work is explicitly disliked. Separate interview/source work from data-analysis roles.','Compare interview or source evidence with missing information, analyze a numerical dataset, discuss a policy without gathering evidence, or not sure.'),
 'degree-17102100':('Reasonable connection','Explicit map/observation context, numerical accuracy and computing support these connections. Mandatory outdoor collection was unnecessarily narrow; no unrelated geography-research interest is inferred.','Check and revise a digital map against recorded observations, collect outdoor samples, or not sure.'),
 'mechanical-engineering':('Reasonable exploration alternative','Mechanism testing, design, precision and safety willingness are explicit. All new engineering claims remain alternatives outside Top three. Mathematical study and practical versus analytical work should be explored, not assumed or used as a prior-experience barrier.','Compare a measured physical design with a prediction, assemble an existing design, or not sure.'),
 'electrical-engineering':('Reasonable exploration alternative','Circuit debugging/design and safety willingness are explicit. Unknown mathematics or a dislike of organization does not erase circuit interest. Keep subfield differences and future study preferences visible.','Compare circuit measurements with an expected result, make a physical object without electrical work, or not sure.'),
 'personal-financial-advisor':('Reasonable connection','Sam explicitly explores investments, uncertain returns and responsibility for another person’s money. This is not price comparison repackaged as investing. Do not infer credentials, suitability to give regulated advice or guaranteed training interest.','Compare uncertain outcomes for a mock recommendation and explain the limits, compare prices for a purchase, or not sure.')}
claims=[]
for r in B['rows']:
 for p in r['newSupported']:
  verdict,reason,prompt=notes[p['id']]; flags=[]
  if p['r'] is None:flags.append('Overall comparison unavailable')
  elif p['r']<0:flags.append('Different overall interest pattern')
  claims.append({'modelId':r['id'],'name':r['name'],'cohort':r['cohort'],'careerId':p['id'],'profession':p['title'],'inTopThree':any(t['id']==p['id'] for t in r['afterTop']),'correlation':p['r'],'review':verdict,'reason':reason,'followupDraft':prompt,'flags':flags,'education':[x['key'] for x in p['routes']],'evidence':p['evidence'],'evidenceSummary':' | '.join(dict.fromkeys(e.get('evidence') or e.get('text') or e['questionId'] for e in p['evidence'])),'profileURL':'https://fieldguide-college-exploration.mooroobee.chatgpt.site/developer/model-lab?case='+r['id']})
assert len(claims)==113 and len({c['careerId'] for c in claims})==15
lossnotes={
 'scale056-0031':'Optometry needed vision evidence that is absent. Keep the supported social-research degree alternative visible outside Top three; this is not a model with no degree option.',
 'scale056-0307':'Removing Animal Scientist is justified: animal care is not farm-animal production research. Circuit/design/testing interest remains genuine. Electronics Engineers has two defining domains and an unknown safety responsibility. A scoped safety follow-up is sensible; the current shared safety item does not include this career in its routing list.',
 'scale056-0595':'Animal behavior/care and research willingness are real, but farm production is unstated. Do not restore Animal Scientist. Explore observational animal behavior and care before deciding whether a professional research or clinical route fits; health is explicitly disliked.',
 'scale056-0731':'Removing Animal Scientist is justified. Food comparison/testing/research remains a plausible path with one activity domain; precision/records interest is unknown. Technical design and safety interests are also unresolved. No automatic replacement Top is justified.',
 'scale056-0576':'Vision interest is unrecorded. Personal care, cooking and carpentry remain supported. Education interests warrant a classroom/assessment distinction, not replacement with an unrelated medical profession.',
 'scale056-0603':'Vision interest is unrecorded. Paralegal remains supported and aligns with written rules/arguments. Other finance or compliance routes need their own quantitative, leadership or accountability evidence.'}
losses=[]
for r in B['rows']:
 if r['lostTop'] or r['lostDegree']:losses.append({'modelId':r['id'],'name':r['name'],'cohort':r['cohort'],'lostTop':r['lostTop'],'lostDegree':r['lostDegree'],'prior':[p['title'] for p in r['priorTop']],'after':[p['title'] for p in r['afterTop']],'degreeAlternatives':[p['title'] for p in r['degreeAlternatives']],'review':lossnotes[r['id']]})
assert len(losses)==6
# Aggregate claims, never convert counts into accuracy or independent validations.
negative=[c for c in claims if c['correlation'] is not None and c['correlation']<0];missing=[c for c in claims if c['correlation'] is None]
questions=[q for q in B['questionCounts'] if q['kind']=='evidence']; assert len(questions)==7
summary={'scope':{'frozenModels':1000,'reconstructedTargetModels':len(A['rows']),'candidatePairsInspected':sum(len(r['candidates']) for r in A['rows']),'newClaims':len(claims),'newProfessions':15,'coverageLossModels':len(losses),'reclassifiedClaims':44},'remaining':counts,'cohorts':cohorts,'newClaimScoreFlags':{'differentPattern':len(negative),'differentPatternInTop':sum(c['inTopThree'] for c in negative),'unavailable':len(missing),'unavailableInTop':sum(c['inTopThree'] for c in missing)},'unconsumedEvidenceItems':{'items':7,'offered':sum(q['all']['offered'] for q in questions),'groundedPositive':sum(q['all']['positive'] for q in questions)},'specialistPositiveCoverage':{'visionFacts':sum(bool(r['ledger']['yes'].get('f:vision-examination')) for r in B['rows']),'farmProductionFacts':sum(bool(r['ledger']['yes'].get('f:animal-production')) for r in B['rows'])},'limits':['Systematic gate/provenance review plus selected individual profile judgments, not an independent assessment or a validated accuracy estimate.','Sources are frozen simulated profiles; background, demographics and mental health were not used as career exclusion features.','All holdouts have been inspected; keep diagnostic results separate.','Negative broad correlation is a disagreement signal, not proof a concrete activity interest is invalid.','No source profiles, answers, scoring, live flow or saved benchmark counts changed.']}
assert summary['newClaimScoreFlags']=={'differentPattern':17,'differentPatternInTop':8,'unavailable':1,'unavailableInTop':1}
assert summary['unconsumedEvidenceItems']=={'items':7,'offered':553,'groundedPositive':91}
(H/'summary.json').write_text(json.dumps(summary,indent=2));(H/'claim-review.json').write_text(json.dumps(claims,indent=2));(H/'loss-review.json').write_text(json.dumps(losses,indent=2))
def csvwrite(path,rs,fields):
 with path.open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
  for r in rs:w.writerow({k:'; '.join(map(str,r[k])) if isinstance(r.get(k),list) else r.get(k) for k in fields})
csvwrite(O/'match-quality-review-072-claims.csv',claims,['modelId','name','cohort','careerId','profession','inTopThree','correlation','review','reason','followupDraft','flags','education','evidenceSummary','profileURL'])
gaps=[]
for r in remaining:
 cat=category(r);pred={'activity':task,'binding':ready,'one-check':one}.get(cat)
 cs=[c for c in r['candidates'] if pred(c)] if pred else r['candidates']
 cs=sorted(cs,key=lambda c:(bool(c['supported']),len(c['specificDomains']),len(c['taskDomains']),c['r'] if c['r'] is not None else -2),reverse=True)
 c=cs[0] if cs else None
 gaps.append({'modelId':r['id'],'name':r['name'],'cohort':r['cohort'],'noTop':r['noTop'],'category':cat,'categoryLabel':LABELS[cat],'degreeAlternatives':[p['title'] for p in r['degreeOutsideTop']],'candidate':c['title'] if c else '', 'unresolvedPrompts':[A['definitions'][q['questionId']]['prompt'] for q in c['checks'] if q['response']!='yes'] if c else [],'missingFeatures':sorted({f for q in c['checks'] for f in q['missing']}) if c else []})
(H/'gap-review.json').write_text(json.dumps(gaps,indent=2));csvwrite(O/'match-quality-review-072-gaps.csv',gaps,['modelId','name','cohort','noTop','categoryLabel','degreeAlternatives','candidate','unresolvedPrompts','missingFeatures'])
report='''# Match-quality review · frozen research 0.71

**Recommendation: keep the promising connections, repair the follow-up wiring and provenance weaknesses, and validate targeted distinctions before adopting the prototype in the live flow.** The review found no basis for restoring ungrounded optometry or farm-animal-research claims just to recover coverage.

This is a review, not a new matching run or a rule change. Supported Top remains **818/1,000**, bachelor/graduate Top **691/1,000** and degree support anywhere **758/1,000**. Live matching remains unchanged. All 1,000 saved results were reconciled; 412 targeted profiles were reconstructed, covering every new claim, reclassification and remaining no-degree-Top case. Their complete supported membership/order matches the saved 0.71 result. 40,229 anchored degree-career pairs were inspected for gates and provenance. Counts are coverage diagnostics, not measured predictive accuracy.

## What works and what needs repair

1. **There are sensible new connections.** Actual code/debugging choices support programming; useful physical objects and prototyping support industrial design; reference/source comparison supports library and information work. Maps plus numerical/computing accuracy can support cartography without compulsory outdoor collection. Engineering alternatives retain real circuit/mechanism, design and safety evidence. Specialized medical or graduate training readiness is not inferred.
2. **Seven recorded follow-ups have no answer-to-evidence bridge.** `evidence071-*` items were offered 553 times with 91 grounded positive responses. `researchRows071` consumes the 24 activity items and two specialist contexts, but not these seven evidence items. Isolated interface probes confirm that changing each of these seven answers does not change its output, while activity and specialist-context controls are consumed. Earlier mapping repairs can still promote careers using the same pre-existing facts; the 91 answers did not independently establish those gains. Repair this before testing real newly expressed preferences. This does not establish that wiring alone will add matches to the frozen cohort.
3. **Multiple positive gates can reuse the same root fact.** The simulator appropriately preserves unknown interests, but this means a newly simulated activity answer often restates a fact already used for a defining Yes. Two answer IDs or task domains are not two independent observations. Retain source roots, identify reused evidence, and test a genuinely new choice before calling the connection independently confirmed. Do not discard a good connection simply because its evidence shares a source.
4. **Specific support and broad correlation can disagree.** Of 113 additional supported career claims, 17 have negative broad-pattern correlations; eight are in Top three. One additional claim is highlighted with an unavailable comparison (Imani's near-flat profile). These are not percentages or validated probabilities of fit. There are already 233 negative-correlation offers among all 2,042 proposed Top offers, equal to the previous benchmark's count, so this is not solely a new regression. Investigate the disagreement using scoped choices and synthetic-profile consistency; do not automatically veto explicit activity interests or lower standards to raise the Top ratio.
5. **Specialist guards expose a cohort gap.** All 17 prior optometry claims and 27 Animal Scientist claims move to confirmation. No frozen profile contains the new explicit vision-examination or farm-production fact. These reclassifications are appropriate for the available evidence, but this cohort cannot test positive coverage for either specialty. Add separate positive/negative/unknown diagnostic fixtures without rewriting the 1,000 profiles or holdouts.

## Review of all 113 new model-career claims

Each CSV row carries its model, cohort, career, Top/alternative status, correlation, reasoning, evidence and a follow-up draft. The judgments below concern reasonable exploration connections, not professional ability or an independently confirmed career choice. Drafts are authored suggestions, not validated scales. No draft received a new model answer in this review.

| Profession | New claims | Review judgment | Main distinction |
|---|---:|---|---|
'''
for c in B['claimCounts']:
 v,n,p=notes[c['id']];report+=f"| {c['title']} | {c['models']} | {v} | {p} |\n"
report+='\n## All six coverage-loss models\n\n'
for r in losses:report+=f"### {r['name']} · {r['modelId']} · {COHORTS[r['cohort']]}\n\nPrevious Top: {'; '.join(r['prior'])}.\n\nProposed Top: {'; '.join(r['after']) or 'No supported Top'}.\n\n{r['review']}\n\n"
report+='''## The remaining 309 models without degree Top

These are mutually exclusive **primary audit queues**, applied in this order: already-supported alternative; incomplete activity context; unasked rule-level binding; one unresolved defining check; broader exploration; no usable typed evidence. Priority is diagnostic, not a forecast of successful matches. A binding appearing satisfied does not independently validate its occupational meaning, and no explicit Unsure, No or hold is treated as permission to infer Yes. A single defining check can still be followed by activity-context requirements.

| Primary queue | Models | Also no supported Top |
|---|---:|---:|
'''
for k in ['below-cap','activity','binding','one-check','broader','exposure']:report+=f"| {LABELS[k]} | {counts[k]['models']} | {counts[k]['noTop']} |\n"
report+='''
Of 309 models, **67 already have supported degree alternatives** outside the Top-three highlights. The remaining **242 have no supported degree career anywhere**. The 182 with no Top are a subset, not another group to add. Across overlapping queues, 21 have an incomplete activity context and 206 have at least one career with a single defining check unresolved; these overlaps must not be added to the table.

The 15 primary activity cases are not automatic recoveries. Inspection of the existing two-item banks found no case where simply asking/reordering a known-positive unasked item would complete the missing activity domains. In most, precision, organization, testing or a specific context remains unknown; four have an explicit negative precision preference in at least one candidate. Preserve that answer and explore a scoped activity rather than relabeling it Yes. Colton's price/supplier comparisons still do not establish market research or survey-design interest.

### Concrete next cases

- **Alex Nowak (life-062, development):** plant propagation, living organisms, repeatable procedures and accurate records justify inspecting the unasked Biological Technician checks. This is stronger than a generic outdoor preference.
- **Alexei Petrov (life-034, development):** saved data-pattern, assumptions, uncertainty and organized-source choices justify Statistical Assistant follow-up review. Do not replace his explicit chosen activities with an occupation merely because a binding currently returns Yes.
- **Evelyn Duarte (life-029, development) and Owen Chao (life-053, original holdout):** team/workflow recommendations are reasons to explore organizational analysis. Both defining Management Analyst rules currently use the same features. Distinguish investigating a workflow from recommending and implementing changes; label experienced destinations honestly.
- **Miles Bennett (new049-020, fresh holdout):** motion/prediction interest is present, but quantitative/research-reporting preferences remain unknown. Do not restore an astronomy requirement or assume independent research enthusiasm. Offer a short measurement/reasoning comparison.
- **Emery Farah (scale056-0161, development):** exercise measurement and patient care are grounded. The new recording item stayed unfamiliar because precision interest is unknown. A concrete progress-record activity would provide new information in a real survey; replaying the same frozen facts cannot.
- **Colton Reed (new049-003, development):** supplier/price comparison is not evidence of customer sampling or market research. Procurement exploration is sensible; the market-research gate should remain unresolved until the distinction is answered.
- **Tessa Nguyen (new049-021, development):** occasional simple meals do not establish food science, professional cooking responsibilities or a college Top. Offer exposure rather than a stronger label.
- **Remy (legacy-023, development):** no usable typed interest evidence. Begin with varied short experiences and an honest unknown option.

## Holdouts remain separate

| Fixed cohort | Models | No Top | No degree Top | Degree already outside Top | New career claims | Specialist claims reclassified |
|---|---:|---:|---:|---:|---:|---:|
'''
for k,s in cohorts.items():report+=f"| {COHORTS[k]} | {s['models']} | {s['noTop']} | {s['noDegreeTop']} | {s['belowCap']} | {s['newClaims']} | {s['reclassified']} |\n"
report+='''
These holdouts have already been inspected and remain diagnostic, not pristine final validation. No holdout-specific rules were introduced.

## Recommended order of fixes

1. Connect positive/negative/unfamiliar option IDs from the seven evidence items to **scoped** evidence before final matching. Add end-to-end probes showing that a real new choice can change an eligible result, and unknown/negative choices cannot. Do not convert one compound choice into global agreement with every method or responsibility.
2. Target shared questions by the unresolved construct and relevant context, instead of relying only on a short career allowlist. Cameron Jones's Electronics Engineer safety gap is a concrete omitted route. Preserve differences between technical, clinical, financial and client responsibilities.
3. Review the nine unasked-binding cases for semantic quality and then repair capture/selection where justified. Do not auto-fill Unsure or assume a new Top count. Use the 136 one-check cases for genuinely informative, neutral targeted choices, with a small question budget and a stop condition.
4. Record unique evidence sources and make confidence use both specific preferences and the broad pattern. Explain disagreements. Do not use degree or pay bonuses or an arbitrary new correlation cutoff to manufacture agreement.
5. Add separate specialist positive controls and real-student testing of the new question drafts. Review research versus practice preferences without demanding professional experience, advanced ability or a pre-existing desire for a prestigious title from a teenager.

## Sources and validation

- Frozen result: `site/research/evidence-071/results.json.gz`; unchanged freeze and source-profile hashes.
- Reconstructed audit: `site/research/quality-072/audit.json.gz`; original/simulated choices, source quotes, question requirements, known answers, holds, missing facts, and support membership.
- Read-only replay: `site/scripts/review-quality-072.mjs`; no source-answer writes. Scratch state reconstruction operates on clones.
- Wiring probes: `site/research/quality-072/check-wiring.mjs` and `wiring-check.json`.
- Career task references checked October 21, 2026: [library/information work](https://www.bls.gov/ooh/education-training-and-library/librarians.htm), [food science](https://www.bls.gov/ooh/life-physical-and-social-science/agricultural-and-food-scientists.htm), [exercise physiology](https://www.bls.gov/ooh/healthcare/exercise-physiologists.htm), [public relations](https://www.bls.gov/ooh/media-and-communication/public-relations-specialists.htm), [social-science research assistance](https://www.onetonline.org/link/summary/19-4061.00), [farm-animal research](https://www.onetonline.org/link/details/19-1011.00), [event planning](https://www.onetonline.org/link/summary/13-1121.00). These occupational descriptions ground the distinctions; they do not validate our question wording or quantify matching accuracy.

This is a systematic evidence/rule audit with selected deeper individual judgments. It is not an independent blinded certification of all career pairs or a psychometric validation. No demographics, health condition, support needs, or training affordability were used as reasons to exclude an interest match. Live matching, original profiles, saved answers, earnings, ranking rules and the frozen 0.71 benchmark remain unchanged.
'''
# Use the exact frozen name; avoid inferred personal labels in the report.
for r in A['rows']:
 if r['id']=='new049-021':report=report.replace('Tessa Nguyen','Tessa')
report+='\n## Visual summaries\n\n![Remaining gap queues](match-quality-review-072-gaps.png)\n\n![New claim pattern comparisons](match-quality-review-072-patterns.png)\n'
report+='\n## Review files\n\n[All 113 new claims](match-quality-review-072-claims.csv) · [All 309 remaining gaps](match-quality-review-072-gaps.csv) · [Executed notebook](match-quality-review-072.ipynb).\n'
(O/'match-quality-review-072.md').write_text(report)
(H/'README.md').write_text('Read-only review of research 0.71.\n\nRun `node scripts/review-quality-072.mjs`, `node research/quality-072/check-wiring.mjs`, then `python research/quality-072/analyze.py`. The notebook contains independent reconciliation and plots.\n\nReview does not implement the proposed fixes or change the frozen benchmark/live matching.\n')
print(json.dumps(summary,indent=2))
