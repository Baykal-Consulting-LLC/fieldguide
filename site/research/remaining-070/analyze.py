"""Reconcile read-only 0.69 gap audit and produce inspectable case review."""
from pathlib import Path
import csv, gzip, hashlib, html, json
from collections import Counter

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
OUT=ROOT.parent/'outputs'
OUT.mkdir(exist_ok=True)
DATA=json.loads(gzip.decompress((HERE/'audit.json.gz').read_bytes()))
ROWS=DATA['rows']
LABELS={
 'supported-below-cap':'Degree career already supported below Top three',
 'activity-context':'Both defining Yes; second activity context missing',
 'unasked-bound-evidence':'Saved evidence fits bindings; defining answers missing',
 'one-recorded-check':'One defining check unresolved in stored responses',
 'broader-exploration':'More than one specific interest needs exploration',
 'no-typed-evidence':'No usable typed interest evidence yet',
}
COHORTS={'development':'Development · 758','holdout':'Original holdout · 30','holdout049':'Fresh holdout · 12','holdout056':'Expanded holdout · 200'}
def clean(c):
 return not c['supported'] and not c['negativeTopics'] and not any(q['response']=='no' or q['hold'] for q in c['checks'])
def task_gap(c):
 return clean(c) and len(c['checks'])==2 and all(q['response']=='yes' for q in c['checks']) and len(c['taskDomains'])<2
def ready(c):
 return clean(c) and bool(c['checks']) and any(q['response']!='yes' for q in c['checks']) and all(q['response']=='yes' or q['bindingSatisfied'] for q in c['checks'])
def one(c):
 return clean(c) and bool(c['checks']) and sum(q['response']!='yes' for q in c['checks'])==1 and bool(c['specificDomains'])
def category(r):
 if r['degreeOutsideTop']: return 'supported-below-cap'
 if any(task_gap(c) for c in r['candidates']): return 'activity-context'
 if any(ready(c) for c in r['candidates']): return 'unasked-bound-evidence'
 if any(one(c) for c in r['candidates']): return 'one-recorded-check'
 if not r['ledger']['yes']: return 'no-typed-evidence'
 return 'broader-exploration'
def summary(rs):
 return {k:{'models':sum(category(r)==k for r in rs),'noTop':sum(category(r)==k and r['noTop'] for r in rs)} for k in LABELS}
def ranks(c):
 return (c['supported'],task_gap(c),ready(c),one(c),clean(c),c['subjectComplete'],len(c['specificDomains']),len(c['taskDomains']),len(c['positiveTopics']))

# Human-reviewed examples. Narrative context explains why to ask, never supplies
# new typed answers. Proposed prompts are unvalidated drafts, not quoted scales.
NOTES={
 'life-038':{'title':'Aisha: test/documentation interest is not being carried through','detail':'The profile describes robotics documentation and repeatable tests. Existing saved option IDs also support computing/test/precision features, but some defining computing questions remain unasked. Offer a distinction between tracing program changes, documenting test results, and designing interfaces. Do not assume she wants to write software merely because she tests something.','prompt':'Which would you choose to try: trace why a small program fails, design and record repeatable tests, compare two screen layouts, or none / not sure?','status':'Missing follow-up selection; confirm coding versus testing context.'},
 'new049-003':{'title':'Colton: real comparison interest, but market research is not established','detail':'Two market-research checks are saved Yes, with only one activity context. His profile explicitly distinguishes comparing offers from photographing listings and following through. Purchasing/procurement comparisons deserve exploration; customer research, investment risk and sustained bookkeeping should not be inferred.','prompt':'Which would interest you more: compare supplier offers against a checklist, investigate why customers prefer an option, keep transaction records consistent, or none / not sure?','status':'Retain the activity gate and distinguish supplier comparison from market research.'},
 'gap-021':{'title':'Audrey: performing arts is an inappropriate proxy for event commitments','detail':'The remaining event-planner responsibility binding requires t:performance although the actual prompt asks about commitments, bills and suppliers. Social-outing coordination is a reason to ask about those responsibilities, not proof that she wants client accountability.','prompt':'If plans for a group event changed, would you choose to track supplier promises and costs, choose the activities only, help during the event, or none / not sure?','status':'Review the irrelevant topic requirement; ask about budget and supplier follow-through.'},
 'life-017':{'title':'Nadia · original holdout: historical evidence is clearer than the topic adapter','detail':'The profile explicitly describes a neighborhood history project and verifying accounts against documents. Prior frozen evidence supports historical subject and method; the audit ledger from saved activity IDs lacks a history topic. Responsibility for presenting an uncertain conclusion remains unknown. Librarian and film-editor bindings also fit saved broad choices; film editing still needs direct medium-specific confirmation.','prompt':'When two accounts of an event conflict, would you like to compare original sources and present what is still uncertain, simply collect the stories, or none / not sure?','status':'History capture gap plus an unresolved responsibility; do not automatically add Historian.'},
 'new049-020':{'title':'Miles · fresh holdout: physics must not mean astronomy','detail':'The profile names motion problems, experiments and predictions, while the shared physical-science topic fact is sky observation. Preserve his support needs separately from interest. Explaining assumptions, handling uncertain results and independent work remain unresolved; neither Physics nor Astronomy should be invented from a general testing preference.','prompt':'Which would you choose to explore: compare a motion prediction with a measurement, investigate a pattern in the night sky, build and revise a mechanism, or none / not sure?','status':'Add a distinct mechanics/physical-model activity; keep research-reporting interests unknown.'},
 'life-046':{'title':'Linh · original holdout: genuine art, uncertain professional commitment','detail':'Color experiments and visual storytelling support art exploration. Developing a sustained personal body of work is unresolved. River cleanup and noticing bank changes do not establish an interest in systematic geography research.','prompt':'Would you like to make several related original works and revise how they are presented, try unrelated small art experiments, or none / not sure?','status':'Ask the missing art-responsibility distinction; do not turn volunteering into geographic research.'},
 'scale056-0161':{'title':'Emery · development: exercise science activity bank gap','detail':'Movement, quantitative/testing methods and direct-care responsibility are explicit frozen facts; both exercise-physiology interests are saved Yes. None of the current activity contexts qualifies. Add a context on comparing physiological responses and revising an exercise plan, retaining clinical boundaries.','prompt':'Which would you choose in a supervised exercise-science introduction: compare measurements before and after activity, adjust a routine using those results, encourage participation without measurements, or none / not sure?','status':'Missing independent activity context; do not remove the context gate.'},
 'scale056-0008':{'title':'Casey · expanded holdout: food science is routed through health contexts','detail':'Both food-science defining checks are saved Yes, but no health-centric activity context qualifies. The profile already has other supported degree alternatives below Top three. Food processing and ingredient comparisons need their own activity contexts; this case is not evidence for inventing health interest.','prompt':'Would you choose to compare how a controlled ingredient change affects texture, check consistency across batches, prepare a familiar meal without comparisons, or none / not sure?','status':'Food/materials context coverage and a separate Top-three display cap.'},
 'new049-021':{'title':'Tessa: limited exposure should remain limited evidence','detail':'The profile gives occasional simple shared meals and music/comedy preferences, with no sustained career interest established. One saved cooking check is Yes; safety, repeated work and coordination remain unknown. This is a sensible unresolved case.','prompt':'Which short introduction would you choose: prepare the same dish twice and compare it, help organize a small group activity, try a different activity, or none / not sure?','status':'Offer a small experience; no automatic chef or degree match.'},
 'legacy-023':{'title':'Remy: no usable typed evidence','detail':'No positive typed interest evidence is available in the audited ledger. Familiar school tasks and time with familiar people do not justify any specialized career assignment.','prompt':'Which short experience would you choose to try first? Offer several genuinely different activities plus none / not sure.','status':'Exposure-first exploration; missing information is not a negative result.'}
}

COUNTS={'all':summary(ROWS),**{g:summary([r for r in ROWS if r['cohort']==g]) for g in COHORTS}}
assert len(ROWS)==317 and len({r['id'] for r in ROWS})==317
assert sum(r['noTop'] for r in ROWS)==188
assert sum(v['models'] for v in COUNTS['all'].values())==317
assert sum(v['noTop'] for v in COUNTS['all'].values())==188
assert sum(bool(r['degreeOutsideTop']) for r in ROWS)==65
assert sum(any(ready(c) for c in r['candidates']) for r in ROWS)==30
assert sum(any(task_gap(c) for c in r['candidates']) for r in ROWS)==43
for file,h in DATA['hashes'].items():
 assert hashlib.sha256((ROOT/file).read_bytes()).hexdigest()==h,file

SELECTED=[]
for r in ROWS:
 cs=sorted(r['candidates'],key=ranks,reverse=True)
 shortlist=[c for c in cs if c['supported']][:6] if r['degreeOutsideTop'] else [c for c in cs if clean(c)][:4]
 others=sorted([c for c in r['nonDegreeCandidates'] if clean(c)],key=ranks,reverse=True)[:2]
 SELECTED.append({**{k:r[k] for k in ['id','name','cohort','source','noTop','top','degreeOutsideTop','ledger']},'category':category(r),'shortlist':shortlist,'nonDegreeShortlist':others,'review':NOTES.get(r['id'])})

RESULT={'counts':COUNTS,'overlaps':{'taskContextModels':43,'allBindingsSatisfiedButUnansweredModels':30,'oneStoredCheckModels':sum(any(one(c) for c in r['candidates']) for r in ROWS)},'rows':SELECTED,'definitions':DATA['definitions'],'notes':NOTES}
(HERE/'review.json').write_text(json.dumps(RESULT,ensure_ascii=False,separators=(',',':')))
(HERE/'queue-counts.json').write_text(json.dumps(COUNTS,indent=2))
with (OUT/'remaining-match-review.csv').open('w',newline='') as f:
 w=csv.writer(f);w.writerow(['modelId','name','cohort','noSupportedTop','primaryReviewQueue','degreeCareersAlreadySupported','degreeCareersToInvestigate','unresolvedQuestionIds','missingFeatures'])
 for r in SELECTED:
  w.writerow([r['id'],r['name'],r['cohort'],r['noTop'],LABELS[r['category']],'; '.join(c['title'] for c in r['degreeOutsideTop']),'; '.join(c['title'] for c in r['shortlist'] if not c['supported']),'; '.join(q['questionId'] for c in r['shortlist'] for q in c['checks'] if q['response']!='yes'),'; '.join(sorted({v for c in r['shortlist'] for q in c['checks'] if q['response']!='yes' for v in q['missing']}))])

def md_table():
 lines=['| Primary review queue | No degree Top | Of these, no Top at all |','|---|---:|---:|']
 return '\n'.join(lines+[f'| {LABELS[k]} | {v["models"]} | {v["noTop"]} |' for k,v in COUNTS['all'].items()])
report=f'''# Remaining match review · frozen 0.69 benchmark

Reviewed the 317 models without bachelor/graduate Top, including all 188 without any supported Top. These are overlapping groups, not 505 models. Degree routes use college/graduate keys and exclude associate-only routes. No source answers or matches changed.

The largest immediate opportunity is **65 models already having supported degree careers below Top three** (52 development, 13 expanded holdout). There are **252** with no supported degree career anywhere in the result. A supported alternative is support under the existing rules, not independent certification of real-world fit.

## Complete model review queues

{md_table()}

These are mutually exclusive triage queues in the order shown. Broader flags overlap: 43 have a degree career with both defining Yes but inadequate task contexts; 30 have an unanswered degree career whose current typed bindings are satisfied; 208 have a degree career with exactly one unresolved defining check and some saved specific support. The 30 binding-ready models are all from the original authored set. They need semantic review/direct confirmation, not automatic promotion. A single stored check remaining is not proof that one answer establishes a good match.

## Separate cohorts

| Cohort | Without any Top | Without degree Top | Degree supported below cap | No supported degree anywhere |
|---|---:|---:|---:|---:|
'''
for g,label in COHORTS.items():
 rs=[r for r in ROWS if r['cohort']==g];cap=sum(bool(r['degreeOutsideTop']) for r in rs)
 report+=f'| {label} | {sum(r["noTop"] for r in rs)} | {len(rs)} | {cap} | {len(rs)-cap} |\n'
report+='''
All holdouts were previously inspected and remain diagnostic; this review does not tune or refit rules against them. Results above remain 812 supported Top, 683 bachelor/graduate Top, and 152 graduate Top across 1,000. No improvement is claimed from this review alone.

## Fix next, without inventing interests

1. **Show already-supported education alternatives alongside the highlights.** Examples: Reese Chen (scale056-0049) already has a supported nursing degree route; Jamie Ellis (scale056-0119) already has mechanical/robotics/electrical engineering options below trade highlights. Do not give a career extra evidential support because it pays more or requires college. Keep all routes and earnings inspectable.
2. **Repair follow-up invitation coverage for original profiles.** Thirty models have a degree candidate with all current binding requirements present but at least one missing defining response. Leading families: librarians (12 model-career pairs), film editors (11), industrial designers (10). This is not permission to infer specialized work from an ambiguous activity option. “Words, photographs or moving images” needs a medium-specific choice before confirming film editing. Aisha's test documentation deserves a coding/testing distinction, not a default software-developer assignment.
3. **Add independent activity contexts rather than dropping gates.** Forty-three models have both defining Yes for a degree career but fewer than two task domains; 25 are still uncovered after removing the display-cap cases, including 15 with no Top. Role-pair counts overlap: PR 12, food science 11, exercise physiology 6, social-research assistants 5, mechanical engineering 4, electrical engineering 4. Food science contexts currently concentrate on health; PR contexts concentrate on creative storytelling; neither covers all relevant interests. Both defining questions often reuse the same binding, so retaining independent activity confirmation matters.
4. **Target the unresolved responsibility or method.** In the 124-model primary queue, 99 lack any Top. Many gaps are safety accountability, careful quantitative work, research communication, curriculum evaluation, or client-financial responsibility. Ask the missing distinction only, with not-for-me and unfamiliar options. Do not convert missing safety, patient care, adult teaching, or investment-risk interest into Yes. Separate curriculum improvement from direct classroom assessment, and debt-plan accountability from enthusiasm for investments; new constructs need validation.
5. **Correct narrow or irrelevant topic proxies.** The physical-science topic fact is sky observation, too narrow to capture motion/experimental physics. Event-planner responsibility degree-13112100-047-responsibility requires performance although it asks about bills and supplier commitments. Cartography's method requires fieldwork even when using existing survey/photo records could be the preferred route. These are proposed semantic corrections, not new positive answers. Preserve numerical/accuracy evidence where genuinely needed.
6. **Close broad specialist loopholes before expanding support.** The optometry domain binding is only health; methods add precision/investigation, and responsibility adds clinical. No vision-specific feature is required. Thirty-three remaining models have at least one supported optometry check and subject alignment without contrary responses; none should be automatically promoted on that basis. Add specific vision/examination interest. Animal care similarly does not establish farm-animal nutrition/breeding research. Interest in learning materials does not establish educator coaching.

## No-answer and disagreement policy

Seventy-four primary-queue models need more than one interest explored; Remy has no usable positive typed evidence. These are unresolved, not demonstrated matching failures. Brief new experiences may be more informative than repeated career labels. Tessa's occasional shared meal should not become food science or chef leadership. Many models also have rejected career branches: those remain rejected. Fourteen models have a career whose currently evaluated binding conflicts with a saved No; that is a discrepancy to inspect, never an automatic overwrite. All No answers, review holds, frozen profile facts, thresholds, education definitions, pay assumptions and live flow are unchanged.

## Human-reviewed examples and proposed multiple-choice distinctions

These are unvalidated activity-question drafts informed by occupational descriptions, not copied or psychometrically tested scales. Each needs distinct positive/negative/unfamiliar choices and a reviewed binding before any benchmark. No draft received a simulated answer in this audit.

'''
for id,n in NOTES.items():
 report+=f'### {n["title"]} · {id}\n\n{n["detail"]}\n\nProposed distinction: {n["prompt"]}\n\nAction: {n["status"]}\n\n'
report+='''## Method and evidence

Reconstructed the exact frozen 0.69 state for every target and asserted the complete supported-career membership/order equals its saved result. Inspected all degree career gates for the 317 targets, plus non-degree careers for the 188 with no Top. The audit stores existing answers, confidence, holds, binding requirements, missing/contrary features, exact source quotes and candidate contexts. This is a systematic rule/evidence audit with selected human-reviewed examples, not an independent subjective certification of every career pair.

Nested alternative groups use AND-of-OR semantics. The existing structured quality alias (testing plus mechanics/electronics) is honored; it is not mistaken for an uncollectable new topic. The four prior typed evidence rules are honored instead of reverting to their older broad bindings. Candidate anchoring and review order do not alter matching scores or create support.

Inputs: research/evidence-069/results.json.gz, calibration/cohort-056/question-bindings.json, frozen profiles, original saved choices and unchanged production matching modules. Full audit: research/remaining-070/audit.json.gz. Source hashes are stored and checked. The notebook reruns queue counts and reconciliations; scripts/review-remaining-070.mjs rebuilds the detailed audit. No live Site files were changed or published.

Primary occupational descriptions checked: [food science](https://www.onetonline.org/link/summary/19-1012.00), [public relations](https://www.onetonline.org/link/summary/27-3031.00), [exercise physiology](https://www.onetonline.org/link/summary/29-1128.00), [optometry](https://www.onetonline.org/link/summary/29-1041.00), [cartography](https://www.onetonline.org/link/summary/17-1021.00), [history](https://www.onetonline.org/link/summary/19-3093.00), [instructional coordination](https://www.onetonline.org/link/summary/25-9031.00), [credit counseling](https://www.onetonline.org/link/summary/13-2071.00), [animal science](https://www.onetonline.org/link/summary/19-1011.00), [physics](https://www.onetonline.org/link/summary/19-2012.00), [event planning](https://www.onetonline.org/link/summary/13-1121.00). These describe occupations; they do not validate the proposed new questions or predict student satisfaction.
'''
(HERE/'review.md').write_text(report)
(OUT/'remaining-match-review.md').write_text(report)

# A bounded, self-contained lookup: all 317 cases; top four audit candidates
# (or up to six already-supported degree alternatives), plus two non-degree
# candidates for models with no Top. Complete candidate pairs remain in audit.gz.
safe=json.dumps({'rows':SELECTED,'definitions':DATA['definitions'],'labels':LABELS,'cohorts':COHORTS,'counts':COUNTS},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
template='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Remaining match review · Fieldguide</title>
<style>body{margin:0;background:#f5f7f3;color:#193a31;font:16px/1.55 system-ui}main{max-width:1150px;margin:45px auto;padding:0 24px}h1{font-size:38px;line-height:1.15}h2{margin-top:35px}p{max-width:95ch}.note,small{color:#596c64}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card,details.model{background:white;border:1px solid #cbd6cd;border-radius:14px;padding:20px;margin:12px 0}.card b{font-size:34px;display:block}table{border-collapse:collapse;width:100%;background:white}th,td{padding:9px 12px;border-bottom:1px solid #d9e0d9;text-align:left}th{background:#e5eee5}label{display:inline-grid;gap:5px;margin:8px 14px 8px 0}input,select{font:inherit;padding:9px;max-width:300px;border:1px solid #9cad9f;border-radius:7px}summary{cursor:pointer;font-weight:650}article{border-top:1px solid #dde5dd;padding:14px 0}blockquote{margin:8px 0;padding-left:15px;border-left:3px solid #a2baa9;color:#486256}.tag{display:inline-block;font-size:13px;background:#eaf0ea;padding:3px 9px;border-radius:10px;margin:4px 5px 4px 0}.bar{height:12px;background:#dce5dc;border-radius:6px;margin:6px 0 14px}.bar i{display:block;height:100%;background:#427d6c;border-radius:6px}.warning{background:#fff1d6;border-radius:8px;padding:14px}button{font:inherit;padding:7px 12px;margin:5px}a{color:#225d53}@media(max-width:700px){.cards{grid-template-columns:1fr}h1{font-size:30px}.scroll{overflow:auto}main{padding:0 15px}}</style>
<main><p class="note">Fieldguide · frozen 0.69 benchmark · read-only audit</p><h1>Where the remaining match gaps come from</h1><p>317 models lack a bachelor/graduate Top; the 188 without any Top are part of that same group. No answers or matches changed.</p><div class="cards"><div class="card"><b>65</b>already have supported degree alternatives below the three highlights</div><div class="card"><b>252</b>have no supported degree career anywhere in the benchmark</div><div class="card"><b>188</b>have no supported Top of any education level</div></div><p class="warning">Review queues identify what to investigate. They are not new matches, improvement forecasts, or validated question scales. Known No, holds and missing interests remain intact.</p><h2>Development and holdouts stay separate</h2><div class="scroll"><table><thead><tr><th>Cohort</th><th>No Top</th><th>No degree Top</th><th>Degree below cap</th></tr></thead><tbody id="cohorts"></tbody></table></div><h2>Primary review queues · all 317</h2><div id="bars"></div><p class="note">Each model appears once in these queues. 43 activity-context flags and 30 missing-answer/binding flags overlap with other queues; they are not additive. A single unresolved stored check does not guarantee that one answer establishes a good career match.</p><h2>Inspect every model</h2><label>Cohort<select id="cohort"><option value="all">All groups · separate labels</option></select></label><label>Review queue<select id="queue"><option value="all">Every queue</option></select></label><label>Match gap<select id="gap"><option value="all">All 317</option><option value="no-top">Only the 188 with no Top</option></select></label><label>Search<input id="search" placeholder="Model name, ID, career"></label><p id="count" aria-live="polite"></p><div id="models"></div><button id="prev">Previous</button><span id="page"></span><button id="next">Next</button><h2>How to use this review</h2><p>Open a model for existing typed facts and exact unresolved question IDs. Candidate shortlists are diagnostic priorities, not recommendations. Up to four degree candidates (six already-supported alternatives) and two non-degree candidates are shown per model; the complete 28,000+ anchored degree pairs are retained in the compressed audit. Proposed activity distinctions appear only on the manually reviewed examples.</p><p>Broader exploration includes sensible unresolved cases; it does not mean the student lacks potential. The original, fresh and expanded holdouts have all been inspected before, so they are diagnostic rather than pristine validation sets.</p><p><a href="remaining-match-review.md">Detailed findings and research sources</a> · <a href="remaining-match-review.csv">317-row CSV</a></p></main><script id="data" type="application/json">__DATA__</script><script>
const d=JSON.parse(document.getElementById('data').textContent),$=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));let page=0;
for(const[g,l]of Object.entries(d.cohorts)){const rs=d.rows.filter(r=>r.cohort===g);$('#cohorts').insertAdjacentHTML('beforeend',`<tr><td>${esc(l)}</td><td>${rs.filter(r=>r.noTop).length}</td><td>${rs.length}</td><td>${rs.filter(r=>r.degreeOutsideTop.length).length}</td></tr>`);$('#cohort').insertAdjacentHTML('beforeend',`<option value="${g}">${esc(l)}</option>`)}
for(const[k,l]of Object.entries(d.labels)){const n=d.counts.all[k].models;$('#bars').insertAdjacentHTML('beforeend',`<div>${esc(l)} <b>${n}</b><div class="bar"><i style="width:${100*n/317}%"></i></div></div>`);$('#queue').insertAdjacentHTML('beforeend',`<option value="${k}">${esc(l)}</option>`)}
function career(c){return `<article><b>${esc(c.title)}</b> <span class="tag">${c.supported?'Already supported alternative':'Needs further evidence'}</span><p class="note">${esc(c.routes.join(' / '))} · ${c.specificDomains.length} defining domains supported · ${c.taskDomains.length} activity contexts</p>${c.checks.filter(q=>q.response!=='yes'||q.hold).map(q=>`<p><b>${esc(q.questionId)}</b> · ${esc(q.response??'not asked')}${q.hold?' · held':''}<br>${esc(d.definitions[q.questionId]?.prompt)}<br><small>Missing: ${esc(q.missing.join(', ')||'No missing binding feature; direct semantic confirmation still needed')}${q.blocked.length?' · Negative: '+esc(q.blocked.join(', ')):''}</small></p>`).join('')}${c.taskDomains.length<2&&c.checks.length===2?'<p>Independent activity-context coverage needs review; do not remove this gate merely to increase coverage.</p>':''}<details><summary>Existing supporting task choices</summary>${c.taskEvidence.map(e=>`<blockquote>${esc(e.text)}<br><small>${esc(e.questionId)} · ${esc(e.source)}</small></blockquote>`).join('')||'<p>No qualifying task contexts.</p>'}</details></article>`}
function render(){const query=$('#search').value.toLowerCase(),rs=d.rows.filter(r=>($('#cohort').value==='all'||r.cohort===$('#cohort').value)&&($('#queue').value==='all'||r.category===$('#queue').value)&&($('#gap').value==='all'||r.noTop)&&(!query||JSON.stringify([r.id,r.name,r.shortlist.map(c=>c.title),r.nonDegreeShortlist.map(c=>c.title)]).toLowerCase().includes(query)));page=Math.min(page,Math.max(0,Math.ceil(rs.length/15)-1));$('#count').textContent=rs.length+' models in this review view';$('#models').innerHTML=rs.slice(page*15,page*15+15).map(r=>`<details class="model"><summary>${esc(r.name)} · ${esc(r.id)} — ${esc(d.labels[r.category])}</summary><p>${esc(d.cohorts[r.cohort])} · ${esc(r.source)} · ${r.noTop?'No supported Top':'Top: '+esc(r.top.map(c=>c.title).join('; '))}</p>${r.review?`<section class="warning"><b>${esc(r.review.title)}</b><p>${esc(r.review.detail)}</p><p>Proposed activity distinction: ${esc(r.review.prompt)}</p><p>${esc(r.review.status)}</p></section>`:''}<details><summary>Frozen positive evidence and provenance</summary>${Object.entries(r.ledger.yes).map(([k,refs])=>`<p><b>${esc(k)}</b><br>${[...new Set(refs.map(x=>x.quote))].map(esc).join('<br>')}</p>`).join('')||'<p>No usable typed positive evidence.</p>'}</details><h3>Degree career audit shortlist</h3>${r.shortlist.map(career).join('')||'<p>No clean, anchored degree candidate can be inferred. Offer exploration instead.</p>'}${r.nonDegreeShortlist.length?'<h3>Non-degree exploration · also unresolved</h3>'+r.nonDegreeShortlist.map(career).join(''):''}</details>`).join('');$('#page').textContent=`Page ${page+1} of ${Math.max(1,Math.ceil(rs.length/15))}`;$('#prev').disabled=page===0;$('#next').disabled=(page+1)*15>=rs.length}
for(const id of ['cohort','queue','gap','search'])$('#'+id).addEventListener('input',()=>{page=0;render()});$('#prev').onclick=()=>{page--;render()};$('#next').onclick=()=>{page++;render()};render();</script></html>'''
(OUT/'remaining-match-review.html').write_text(template.replace('__DATA__',safe))
print(json.dumps({'targets':len(ROWS),'noTop':188,'supportedDegreeBelowCap':65,'noSupportedDegreeAnywhere':252,'primaryQueues':COUNTS['all'],'hashesUnchanged':True},indent=2))
