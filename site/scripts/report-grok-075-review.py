"""Reproduce the descriptive review; never modifies sealed inputs or matching results."""
import collections
import csv
import datetime
import gzip
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parent / 'outputs'
read = lambda path: json.load(gzip.open(ROOT / path, 'rt') if path.endswith('.gz') else open(ROOT / path))
audit = read('research/grok-075-review/audit.json.gz')
baseline = read('dist/developer/evidence-benchmark-075.json.gz')
instrument = read('calibration/grok-075/neutral-questionnaire.json')
rows = audit['rows']
assert len(rows) == 241 and len({r['id'] for r in rows}) == 241
assert sum(len(r['candidates']) for r in rows) == 989
for path, digest in audit['sources'].items():
    assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == digest, path

def has(r, career):
    return any(c['id'] == career for c in r['candidates'])

def topics(r):
    return set(r['profile']['positiveTopics'])

def methods(r):
    return set(r['profile']['positiveMethods'])

probes = {
    'plant-report': ('After a small growing trial gives mixed results, how appealing would it be to write a short recommendation for someone deciding what to grow, explaining what the trial cannot yet tell them?', 'Checks reporting and recommendation interest. A positive growing-trial answer does not answer this responsibility question.'),
    'animal-branch': ('Which would you choose to try: regular feeding, cleaning and noticing changes in an animal; comparing feeding or breeding trials; a supervised animal-health introduction; or not sure yet?', 'Separates routine care, farm-animal research and clinical work. No branch is assumed from liking animals.'),
    'child-routine': ('In a supervised activity with young children, how appealing would it be to keep play, snacks and rest safe and predictable, notice when a child needs help, and ask a qualified adult when unsure?', 'Captures child-care responsibility without requiring medical patient-care interest.'),
    'learning-branch': ('Which would you choose to try: help one learner understand; plan several lessons and check learning over time; help teachers improve materials; or not sure yet?', 'Separates tutoring, teaching and educator coaching. Liking explanations does not establish all three.'),
    'technical-check': ('After a small circuit works once, how appealing would it be to repeat agreed checks, record failures and explain what still needs checking before someone else relies on it?', 'Tests reliability and documentation in the existing circuit context. Does not assume design leadership or professional competence.'),
    'code-requirements': ('For a small program someone else will use, how appealing would it be to check it against their agreed needs and write down steps that reproduce an unexpected result?', 'Clarifies requirements and reproducible checking without requiring a separate broad label for precision or research.'),
    'weather-model': ('With an example and guidance, how appealing would it be to compare weather measurements on a graph with a model prediction, then investigate where they disagree?', 'Separates numerical/model interest from current mathematics skill. Existing sky or weather observation remains a valid interest either way.'),
    'earth-purpose': ('Which use of a ground-and-water notebook would you choose to explore: explain stream changes; improve a map; investigate an underground-resource problem; or not sure yet?', 'Adds purpose and setting. Rock, terrain and runoff observations do not establish oil extraction, mining or legal-boundary interest.'),
    'written-argument': ('When a number pattern seems to work, how appealing would it be to write an argument and its assumptions so someone else can check it, even if you do not want to teach a class?', 'Separates communicating a mathematical argument from teaching or finding a second learning example. Existing negative explanation preferences remain visible.'),
    'qualitative-study': ('How appealing would it be to compare interviews or original documents systematically, look for evidence against your explanation of a community rule, and write what remains uncertain?', 'Opens a qualitative research route. Does not infer statistical enjoyment, advocacy, clinical work or willingness to represent a client.'),
    'edit-check': ('While editing a short clip, how appealing would it be to compare picture and sound together and revise the timing until they work as intended?', 'Checks the unresolved editing component in context. A general movie-editing Like is useful but does not resolve every production responsibility.'),
    'tool-safety': ('In a supervised practical project, would you choose to follow the tool-safety checks, stop when a setup is uncertain and ask for qualified help before continuing?', 'The existing technical-safety follow-up can be reused for trades as well as engineering, with a new scoped binding. Unknown safety interest is not automatically Yes.'),
    'care-branch': ('Which supervised introduction would you choose: help someone understand health information; record observations under a care plan; compare symptoms and treatment choices with a clinician; or not sure yet?', 'Separates health education, direct care and clinical decisions. A personal diagnosis, caregiving duty or helping interest does not answer this question.'),
    'movement-purpose': ('Which practice project would you choose: improve a movement you enjoy; help someone learn it; prepare a team for competition; or not sure yet?', 'Separates movement, instruction and competitive coaching without converting sport into a medical interest.'),
    'customer-context': ('How appealing would it be to ask a customer what they need, compare suitable options and explain a choice without pressuring them?', 'Checks customer-focused listening in its own context; does not imply management, emotional-support work or investment advice.'),
}

findings = [
    dict(id='plant-binding', title='Reuse the existing plant-comparison answer in plant science', kind='Scoped binding fix', priority='First',
         predicate=lambda r: has(r, 'degree-19101300'),
         detail='All 35 Soil and Plant Scientist candidates already have a positive frozen plant-comparison answer. The six-item bank connects that answer only to Biological Technician. It can support the plant-comparison method in its own stated scope; reporting and advice remain separate.',
         guard='One model, grok075-0705, is missing only this method check. This is one especially clear closure candidate, not 35 guaranteed new Tops. Seventeen of the 35 dislike the distinct sample-preparation item; preserve those answers.',
         source='https://www.onetonline.org/link/summary/19-1013.00'),
    dict(id='childcare-binding', title='Separate childcare from medical patient care', kind='Confirmed binding error', priority='First',
         predicate=lambda r: 'children' in topics(r),
         detail='The two Childcare Worker bindings require r:patientcare, whose actual statement concerns direct medical patient care. These 32 models explicitly select child-focused activities. The medical preference is not the child-care responsibility being asked.',
         guard='Replace the clinical proxy with child-care-specific routines and safeguarding evidence. Ask where that evidence is missing; do not automatically promote every tutor or game helper.',
         source='https://www.onetonline.org/link/summary/39-9011.00'),
    dict(id='animal-inventory', title='Offer animal care without turning it into animal research', kind='Inventory gap', priority='First',
         predicate=lambda r: 'animals' in topics(r),
         detail='All 62 have Animal Scientist as a candidate, and 32 have no other candidate at all. The 457-career inventory lacks Animal Caretakers and Veterinary Assistants. Many narratives describe chosen kennel, feeding or routine care activities, not research.',
         guard='Add appropriate care roles with their own scoped questions and verified training/pay data. Keep animal-production research and clinical interests unknown unless separately answered.',
         source='https://www.onetonline.org/link/summary/39-2021.00'),
    dict(id='technical-method', title='Check contextual technical evidence before demanding another generic tag', kind='Rule review', priority='Next',
         predicate=lambda r: has(r,'degree-17207200') or has(r,'degree-15125100'),
         detail='These 24 models have Electronics Engineer or Computer Programmer candidates. Their selected activity statements already describe tracing a failed connection or program and testing changes. Some remaining method bindings demand additional generic design, investigation or precision preferences.',
         guard='Use exact activity-specific implications only where the target question asks the same thing. Requirements gathering, safety, documentation and communication still need their own evidence. Twenty-four is a review population, not a predicted lift.',
         source='https://www.onetonline.org/link/summary/17-2072.00'),
    dict(id='qualitative-route', title='Allow document and interview research without mandatory statistics', kind='Rule review', priority='Next',
         predicate=lambda r: has(r,'degree-19309400') or has(r,'degree-19309100'),
         detail='Political Scientist and Anthropologist/Archeologist candidates include qualitative routes, but their baseline method bindings respectively require quantitative or outdoor-fieldwork preferences. A systematic document/interview route needs its own correctly scoped alternative.',
         guard='Systematic inquiry, subject context and explaining uncertainty remain necessary. Broad policy or history enthusiasm is not a complete research match.',
         source='https://www.onetonline.org/link/summary/19-3094.00'),
    dict(id='earth-scope', title='Keep earth interest distinct from extraction and boundary work', kind='Keep a context check', priority='Alongside fixes',
         predicate=lambda r: 'earth' in topics(r),
         detail='These 31 profiles select rocks, terrain maps and runoff comparisons. That single activity gives domain support to surveying, mining and petroleum candidates. It does not establish interest in legal boundaries or extracting resources.',
         guard='Add context branches before loosening technical methods. This can reduce weak invitations; it should not be sold as a Top-coverage increase.',
         source='https://www.onetonline.org/link/summary/17-1021.00'),
    dict(id='math-communication', title='Distinguish writing a mathematical argument from teaching', kind='Targeted question', priority='Next',
         predicate=lambda r: has(r,'degree-15202100'),
         detail='Ten models have Mathematician candidates; seven are missing only the responsibility check. The general explaining method is phrased as finding a second example when someone is confused. That is narrower and more teaching-oriented than making reasoning checkable.',
         guard='Ask about sharing written assumptions and reasoning. Do not override explicit dislike of explaining or assume a new interest merely from liking puzzles.',
         source=None),
    dict(id='learning-context', title='Separate direct learner support, course assessment and educator coaching', kind='Targeted question', priority='Next',
         predicate=lambda r: has(r,'degree-25903100'),
         detail='Thirty-one models have Instructional Coordinator candidates based on learning-guide interests. Coaching educators and making course-level decisions remain different activities. Some would prefer direct help with learners.',
         guard='Keep educator-coaching and assessment checks where relevant. Add teaching-assistant and other direct-support options before steering a student into administration.',
         source=None),
    dict(id='media-context', title='Ask about the actual edit rather than broad precision', kind='Targeted question', priority='Next',
         predicate=lambda r: has(r,'film-editing'),
         detail='Fourteen Film and Video Editor candidates are missing the second defining interest. A general precision preference is not identical to comparing picture, sound and timing. Existing movie-editing answers can anchor a concrete follow-up.',
         guard='Retain the unresolved production component; do not treat watching clips, generic creativity or appearing on camera as editing confirmation.',
         source=None),
    dict(id='trade-safety', title='Wire the existing safety follow-up to practical routes too', kind='Question binding gap', priority='Next',
         predicate=lambda r: 'wood' in topics(r) and 'safety' not in r['profile']['responsibilities'],
         detail='Eleven wood-interested models leave safety responsibility unknown. Carpenter questions require it, while the existing safety bridge targets engineering and architecture rather than carpentry.',
         guard='Offer the same supervised safety choice in the relevant practical context. Preserve unknown or negative answers; do not infer tool-safety interest from skill or family work.',
         source=None),
]

case_rows = []
topic_facts = {x['id']: x['activity'] for x in instrument['topics']}
method_facts = {x['id']: x['activity'] for x in instrument['methods']}
responsibility_facts = {x['id']: x['activity'] for x in instrument['responsibilities']}
official = {i+1: q for i,q in enumerate(instrument['official'])}
for r in rows:
    p = r['profile']; flags = [f['id'] for f in findings if f['predicate'](r)]
    candidates = []
    for c in r['candidates']:
        missing = []
        for q in c['missing']:
            alternatives = [{k:a.get(k) for k in ['all','any','block','reason']} | {'missing':a['decision']['missing'],'blocked':a['decision']['blocked']} for a in q['rules']]
            missing.append(dict(id=q['id'],prompt=q['prompt'],savedResponse=(q['record']or{}).get('response','not-presented'),alternatives=alternatives,
                followups=[dict(id=f['id'],prompt=f['prompt'],asked=f['asked'],derivable=f['canDeriveFromExistingEvidence'],savedStatus=(f['answer']or{}).get('feedback')or('selected'if(f['answer']or{}).get('selected')else'not selected'))for f in q['followups']]))
        candidates.append({k:c[k] for k in ['id','title','fields','routes','budget','specificDomains','taskDomains']}|{'missing':missing})
    ts=topics(r)
    if r['id']=='grok075-0705':
        primary='Reuse the frozen positive plant-comparison answer for the missing plant-science method'; keys=[];note='The first probe is already answered: plant-comparison = 5. Reuse that direct answer in its plant-comparison scope. Soil and Plant Scientist has domain and responsibility support already. Do not reinterpret plant-samples = 2 as dislike of all plant science.'
    elif all(c['id']=='degree-19101100'for c in r['candidates']):
        primary='Fill the animal-care inventory gap; clarify research only if the student wants that branch';keys=['animal-branch'];note='Animal Scientist is the only displayed candidate. Routine animal-care interest is stated; farm-animal production research is not established.'
    elif has(r,'degree-15202100'):
        primary='Clarify mathematical communication without assuming a teaching preference';keys=['written-argument'];note='Preserve the current exact mathematics and method choices, including any explicit dislikes. A puzzle, a proof and explaining a course are distinct interests.'
    elif 'computing'in ts:
        primary='Review the coding-method binding, then ask about user requirements and reproducible checking';keys=['code-requirements'];note='The selected computing activity already names a small program, unexpected behavior and data flow. Reuse that context narrowly. Reliability and working to another person’s requirements still need evidence.'
    elif 'electronics'in ts:
        primary='Review circuit-specific method evidence and ask the narrower reliability question';keys=['technical-check'];note='Interest can be ahead of current technical skill. The selected circuit activity names fault tracing and repeated tests; unknown safety or documentation interest remains unknown.'
    elif has(r,'film-editing'):
        primary='Clarify picture-and-sound timing within the student’s editing interest';keys=['edit-check'];note='Keep editing distinct from performing, directing other people or merely watching media. The missing production component should be asked directly.'
    elif 'plants'in ts:
        primary='Reuse the direct plant-comparison answer; ask only the remaining responsibility question';keys=['plant-report'];note='The frozen plant-comparison answer is positive. It does not establish routine sample processing, research recommendations or explaining findings. Keep those distinct.'
    elif 'health'in ts:
        primary='Clarify the health context before offering a medical specialty';keys=['care-branch'];note='A supervised health-science introduction does not by itself resolve direct patient care, clinical decisions or a particular specialty. Personal health and caregiving context are not matching evidence.'
    elif 'children'in ts or 'learning'in ts:
        primary='Correct the medical-care proxy and distinguish learner support from course or staff responsibility';keys=['child-routine','learning-branch'];note='Helping someone understand supports exploration. Childcare routines, formal assessment and coaching educators should not be inferred from that same preference.'
    elif 'weather'in ts or 'space'in ts:
        primary='Ask about numerical/model comparisons while keeping current skill separate';keys=['weather-model'];note='Observation interest is direct. Numerical/model interest is still unresolved; low current mathematics skill is not a negative interest answer.'
    elif 'policy'in ts or 'law'in ts or 'history'in ts:
        primary='Offer a systematic document/interview route and clarify reporting responsibility';keys=['qualitative-study'];note='Evidence about rules or original records can justify exploration without a mandatory statistics preference. It does not settle client representation, independent research or willingness to report uncertain findings.'
    elif 'earth'in ts:
        primary='Clarify the purpose of the earth observations before narrowing to a profession';keys=['earth-purpose'];note='The earth activity does not specify mining, oil extraction or legal property boundaries. Retain the observational interest and ask the context.'
    elif 'animals'in ts:
        primary='Offer routine animal-care options alongside any separately supported fields';keys=['animal-branch'];note='Do not require a student to like animal research to see an animal-care route. Other interests remain visible.'
    elif 'wood'in ts or 'mechanics'in ts:
        primary='Ask the supervised safety question and keep practical routes visible';keys=['tool-safety'];note='Chosen making and testing interests do not automatically establish taking responsibility for safe work. Reuse the existing safety question with the appropriate route binding.'
    elif 'movement'in ts:
        primary='Clarify practice, instruction and competition without assuming clinical interest';keys=['movement-purpose'];note='Movement interest does not imply a preference for competitive coaching, rehabilitation or medical care.'
    elif 'retail'in ts or 'purchasing'in ts or 'personal'in ts:
        primary='Check customer-context listening without assuming management';keys=['customer-context'];note='Explaining an item and asking what is useful can support a customer-context follow-up. Leadership, clinical support and investment advice are separate.'
    else:
        primary='Ask the closest existing unanswered profession check after a concrete activity preview';keys=[];note='The current evidence justifies exploration. No unstated preference is filled from the biography, education aspiration, demographic or health context.'
    plan=[dict(id=k,prompt=probes[k][0],purpose=probes[k][1],status='Not administered; answer remains unknown',type='Occupationally grounded diagnostic draft; not an independently validated scale item') for k in keys]
    if not plan and r['id'] != 'grok075-0705':
        best=min(candidates,key=lambda c:len(c['missing']))
        for q in best['missing'][:2]:plan.append(dict(id=q['id'],prompt=q['prompt'],purpose='Existing unanswered defining-interest check',status='Unknown; no replacement answer generated',type='Existing profession question'))
    likes=[dict(id=q['id'],text=q['text'],value=p['official'][i-1])for i,q in official.items()if p['official'][i-1]>=4]
    case_rows.append(dict(id=r['id'],name=r['name'],narrative=p['narrative'],profile=p,flags=flags,primaryAction=primary,assessment=note,
        positiveTopics=[dict(id=t,text=topic_facts[t])for t in p['positiveTopics']],positiveMethods=[dict(id=m,text=method_facts[m])for m in p['positiveMethods']],
        positiveResponsibilities=[dict(id=t,text=responsibility_facts[t])for t in p['responsibilities']],generalLikes=likes,plan=plan,candidates=candidates,
        closestMissing=min(len(c['missing'])for c in candidates),sparse=len(p['positiveTopics'])==len(p['positiveMethods'])==1))

finding_rows=[{k:v for k,v in f.items()if k!='predicate'}|{'models':sum(f['predicate'](r)for r in rows),'modelIds':[r['id']for r in rows if f['predicate'](r)]}for f in findings]
missing=[q for r in rows for c in r['candidates']for q in c['missing']]
inventory=[dict(soc=soc,title=title)for soc,title in [('39-2021.00','Animal Caretakers'),('31-9096.00','Veterinary Assistants and Laboratory Animal Caretakers'),('19-4071.00','Forest and Conservation Technicians'),('19-4091.00','Environmental Science and Protection Technicians, Including Health'),('25-9045.00','Teaching Assistants, Except Postsecondary'),('21-1093.00','Social and Human Service Assistants'),('51-7011.00','Cabinetmakers and Bench Carpenters')]]
stats=dict(models=241,candidatePairs=989,careers=108,missingInstances=len(missing),derivedUnknown=sum((q['record']or{}).get('response')=='unfamiliar'for q in missing),notPresented=sum(q['record']is None for q in missing),uniqueMissingQuestions=len({q['id']for q in missing}),boundMissingQuestions=len({q['id']for q in missing if q['binding']}),
    withOneCheck=sum(min(len(c['missing'])for c in r['candidates'])==1 for r in rows),withTwoChecks=sum(min(len(c['missing'])for c in r['candidates'])==2 for r in rows),withThreeChecks=sum(min(len(c['missing'])for c in r['candidates'])==3 for r in rows),withTaskOnly=sum(min(len(c['missing'])for c in r['candidates'])==0 for r in rows),
    genericBridgeQuestionIds=len({q['id']for q in missing if q['followups']}),new075ItemsOffered=sum(bool(r['selectedFollowups']['new075'])for r in rows),rawProfilesChanged=0,answersInvented=0,matchingRulesChanged=0,newTopClaims=0)
assert stats['derivedUnknown']==1737 and stats['notPresented']==79
assert stats['withOneCheck']+stats['withTwoChecks']+stats['withThreeChecks']+stats['withTaskOnly']==241
groups=[('all','Original full cohort'),('development','Original development'),('holdout','Original holdout'),('holdout049','Previously fresh holdout'),('holdout056','Expanded holdout'),('grok075','Separate Grok holdout')]
cohorts=[dict(cohort=g,label=label,models=baseline['summary'][g]['models'],currentTop=baseline['summary'][g]['beforeTop'],currentDegree=baseline['summary'][g]['beforeDegree'],researchTop=baseline['summary'][g]['afterTop'],researchDegree=baseline['summary'][g]['afterDegree'])for g,label in groups]
source=dict(label='Frozen Grok holdout candidate audit',files=['research/grok-075-review/audit.json.gz','calibration/grok-075/profiles.json','calibration/cohort-056/question-bindings.json','dist/developer/evidence-benchmark-075.json.gz','scripts/audit-grok-075-candidates.mjs','scripts/report-grok-075-review.py'],filters=['Cohort: Grok 0.75, kept separate','Supported Top count: zero','At least one exploration candidate','Diagnostic review: after holdout results were inspected'],
    caveats=['All profiles are synthetic. The review is not independent expert or real-student validation.','Findings overlap across models and must not be added together as expected gains.','No proposed follow-up has been administered; its answer remains unknown. Existing frozen responses can only be reused within their stated activity scope.','The 1737 unfamiliar records are simulator-derived unknowns, not 1737 independently administered student Unsure answers.','This review makes the inspected subset diagnostic; a future tuned rerun is not a fresh blind validation.'],
    evidenceFlow=[dict(kind='validation',title='Frozen replay reconciles',detail='All 241 replayed supported-career lists equal the saved 0.75 lists; every source hash checked by the read-only audit remains unchanged.'),dict(kind='method',title='Review scope',detail='All 241 narratives and structured preference sets were inspected alongside 989 candidate-career pairs. Rule/record counts are systematic; specific defects and proposed fixes are scoped semantic judgments, not validated new matching rules.')])
snapshot=dict(title='Existing answers can resolve some gaps; most still need a targeted question',surface='report',generatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),status='reviewed',filters=[],queries={
    'review_stats':dict(rows=[stats],source=source),
    'review_findings':dict(rows=finding_rows,source=source|{'metricDefinitions':[dict(label='Affected models',definition='Affected models count distinct profiles flagged by each explicitly stated diagnostic condition. The groups overlap and are not projected new matches.')]}),
    'review_cases':dict(rows=case_rows,source=source),
    'review_cohorts':dict(rows=cohorts,source=source|{'metricDefinitions':[dict(label='Coverage',definition='Top coverage counts models with at least one supported career in the first three; degree coverage counts models with a college or graduate route there. Each cohort retains its own denominator.')]}),
    'inventory_options':dict(rows=inventory,source=source|{'caveats':['These seven SOC entries were checked as absent from the current 457-career catalog. They are candidates for content work, not ready-to-display matches or verified earnings records.']})})
OUT.mkdir(exist_ok=True)
(OUT/'grok-holdout-review-snapshot.json').write_text(json.dumps(snapshot,ensure_ascii=False))
(ROOT/'research/grok-075-review/summary.json').write_text(json.dumps(dict(stats=stats,findings=finding_rows,cohorts=cohorts),indent=2,ensure_ascii=False)+'\n')
with open(OUT/'grok-holdout-review-241.csv','w',newline='')as h:
    w=csv.DictWriter(h,fieldnames=['id','name','primaryAction','closestMissing','flags','candidateProfessions','unresolvedQuestions','proposedFollowups']);w.writeheader()
    for r in case_rows:w.writerow({k:r[k]for k in ['id','name','primaryAction','closestMissing']}|dict(flags=' | '.join(r['flags']),candidateProfessions=' | '.join(c['title']for c in r['candidates']),unresolvedQuestions=' | '.join(q['prompt']for c in r['candidates']for q in c['missing']),proposedFollowups=' | '.join(q['prompt']for q in r['plan'])))
text='''# Grok holdout: review of 241 models with candidates but no supported Top

The review reproduces all 241 frozen outputs and examines 989 candidate-career pairs across 108 professions. No matching rules, profiles, answers, earnings, education routes or live flow were changed. Grok remains separate: 707/1000 supported Top and 588/1000 bachelor/graduate Top under research 0.75; current live-rule comparison is 674 and 548. The original 1000 remain 813 and 686 under research 0.75.

## What can be fixed

'''
for f in finding_rows:text+=f"### {f['title']} · {f['models']} models\n\n{f['detail']}\n\n{f['guard']}\n\n"
text+='''## Questions exist, but the simulator often cannot answer them

There are 195 distinct missing check IDs: 193 existing profession questions with explicit bindings and two specialty-context guards. Across candidates, 1737 missing check records are simulator-derived unfamiliar answers and 79 are not present as profession-answer records. These are not observed students refusing 1816 questions.

The 0.71/0.73 specialized bridge registry covers 19 of the 195 check IDs. The 0.75 six-item round reaches only 12 of the 241 models. Most unresolved profession checks need better routing to the existing question or a short activity-specific version, not a much longer compulsory survey.

129 models have a candidate with one missing defining check; 79 have a closest candidate needing two checks and 32 need three. One legacy candidate has both defining checks but only one task context. These are triage groups, not guaranteed gains.

## Proposed next sequence

1. Correct the childcare clinical proxy and connect already answered, narrowly relevant plant questions. Keep independent unresolved responsibilities open.
2. Add missing care/support/practical occupations; verify education and earnings for each. Do not substitute research professions for ordinary care.
3. Make follow-up selection target the actual unresolved check, with one or two relevant items at a time and a four-item maximum. Use direct general-item responses as scoped anchors where appropriate; do not translate a single Like into every generic method or responsibility.
4. Audit duplicate generic-method requirements in coding/electronics, and alternatives to all-numerical or all-fieldwork research routes. Keep role-specific context, safety and consequential responsibilities.
5. Re-evaluate any proposed changes as post-holdout diagnostics. Freeze the original results and use another untouched set before claiming renewed blind validation.

Every proposed question is an occupationally grounded diagnostic draft, not an independently validated new scale. No unanswered response is predicted. Demographic, wellbeing, school-resource and narrative-strength text is never turned into a positive interest.
'''
(OUT/'grok-holdout-review.md').write_text(text)
print(json.dumps(dict(stats=stats,flags={f['id']:f['models']for f in finding_rows},caseRows=len(case_rows),cohortsSeparate=True),indent=2))
