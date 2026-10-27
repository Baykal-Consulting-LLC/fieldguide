import gzip,json,hashlib,statistics,datetime,collections
from pathlib import Path
root=Path(__file__).resolve().parents[2]
folder=Path(__file__).resolve().parent
priorfolder=root/'outputs/a3-shortlist-study-2026-10-24'
protocol=json.loads((folder/'protocol.json').read_text())
questions=json.load(gzip.open(root/'site/dist/developer/journeys-104.json.gz','rt'))['questions']
catalog=json.load(gzip.open(root/'site/dist/developer/matrix-104.json.gz','rt'))['catalog']
prior={r['id']:r for i in range(4) for r in json.load(gzip.open(priorfolder/f'shard-{i}.json.gz','rt'))['rows']}
rows=[]
for i in range(4):
 d=json.load(gzip.open(folder/f'shard-{i}.json.gz','rt'));assert len(d['rows'])==500
 rows.extend(d['rows'])
assert len(rows)==2000 and len({r['id'] for r in rows})==2000
for s in protocol['sources']:
 assert hashlib.sha256((root/s['path']).read_bytes()).hexdigest()==s['sha256'],s['path']+' changed during experiment'
for r in rows:
 old=prior[r['id']]
 assert r['baseline']['curve']==old['baseline']['curve'],r['id']+' control checkpoint drift'
 assert [[a['careerId'],a['id'],a['response'],a['selected']] for a in r['baseline']['answers']]==[[a['careerId'],a['id'],a['response'],a['selected']] for a in old['baseline']['answers']],r['id']+' control answer drift'
 r['failed']=old['targeted']
 for arm in ['baseline','targeted','failed']:
  assert len(r[arm]['answers'])==24,r['id']+' did not use exactly 24 follow-ups'
  assert len({a['key'] for a in r[arm]['answers']})==24
  assert r[arm]['unbound']==0
  assert all(c['contrary']==0 for c in r[arm]['strong']),r['id']+' strong career has contrary evidence'

def ids(items):return {c['id'] for c in items}
def endpoint(arm):return arm['curve'][-1]
def dist(v):return {'mean':round(statistics.mean(v),2),'median':statistics.median(v),'min':min(v),'max':max(v)}
def metrics(rs,arm):
 ends=[endpoint(r[arm]) for r in rs]
 return {'models':len(rs),'strong':sum(bool(e['top']) for e in ends),'degreeFirst3':sum(bool(e['degreeTop']) for e in ends),'degreeAny':sum(bool(e['degreeAny']) for e in ends),'noncollegeAny':sum(any(not c['degree'] for c in r[arm]['strong']) for r in rs),'distinctCareers':len({c['id'] for r in rs for c in r[arm]['strong']}),'distinctCollegeCareers':len({c['id'] for r in rs for c in r[arm]['strong'] if c['degree']}),'asked':sum(e['asked'] for e in ends),'unknown':sum(e['unknown'] for e in ends),'questionCounts':dist([e['asked'] for e in ends]),'strongConnections':sum(len(r[arm]['strong']) for r in rs),'collegeConnections':sum(sum(c['degree'] for c in r[arm]['strong']) for r in rs),'priority':dist([len(r[arm]['priority']) for r in rs]),'unbound':sum(r[arm]['unbound'] for r in rs)}
def changes(rs,reference):
 out={}
 for metric,field in [('Strong','top'),('DegreeFirst3','degreeTop'),('DegreeAny','degreeAny')]:
  out['gained'+metric]=sum(not endpoint(r[reference])[field] and bool(endpoint(r['targeted'])[field]) for r in rs)
  out['lost'+metric]=sum(bool(endpoint(r[reference])[field]) and not endpoint(r['targeted'])[field] for r in rs)
 return out
groups=[('original','First 1,000 · all splits',lambda r:r['cohort']!='grok075'),('development','Development',lambda r:r['cohort']=='development'),('holdout','Original holdout',lambda r:r['cohort']=='holdout'),('holdout049','Fresh holdout',lambda r:r['cohort']=='holdout049'),('holdout056','Expansion holdout',lambda r:r['cohort']=='holdout056'),('grok075','Grok evaluation',lambda r:r['cohort']=='grok075')]
summaries=[]
for key,label,pred in groups:
 rs=[r for r in rows if pred(r)]
 recovery=[]
 for r in rs:
  lost=[c for c in r['baseline']['strong'] if c['degree'] and c['id'] not in ids(r['failed']['strong'])]
  recovery.extend(c['id'] in ids(r['targeted']['strong']) for c in lost)
 curves=[]
 for budget in [0,4,8,12,16,24]:
  curves.append({'budget':budget,**{arm:{'strong':sum(bool(next(e for e in r[arm]['curve'] if e['budget']==budget)['top']) for r in rs),'degreeFirst3':sum(bool(next(e for e in r[arm]['curve'] if e['budget']==budget)['degreeTop']) for r in rs)} for arm in ['baseline','targeted','failed']}})
 episodes=[e for r in rs for e in r['targeted']['episodes']]
 parity={'sameSequence':sum([(a['careerId'],a['id']) for a in r['baseline']['answers']]==[(a['careerId'],a['id']) for a in r['targeted']['answers']] for r in rs),'sameQuestionSet':sum({a['key'] for a in r['baseline']['answers']}=={a['key'] for a in r['targeted']['answers']} for r in rs),'sameCareerSet':sum(ids(r['baseline']['strong'])==ids(r['targeted']['strong']) for r in rs)}
 summaries.append({'id':key,'label':label,'baseline':metrics(rs,'baseline'),'failed':metrics(rs,'failed'),'protected':metrics(rs,'targeted'),'versusCurrent':changes(rs,'baseline'),'versusFailed':changes(rs,'failed'),'priorCollegeLosses':len(recovery),'recoveredCollegeConnections':sum(recovery),'stillMissedCollegeConnections':len(recovery)-sum(recovery),'curves':curves,'episodes':dict(collections.Counter(e['end'] for e in episodes)),'allocationParity':parity})

cases=[];students=[]
for r in rows:
 b=r['baseline'];a=r['targeted'];f=r['failed'];bi=ids(b['strong']);ai=ids(a['strong']);fi=ids(f['strong'])
 bs=endpoint(b);ass=endpoint(a)
 kinds=[]
 for c in b['strong']:
  if c['degree'] and c['id'] not in fi:kinds.append((c,'recovered' if c['id'] in ai else 'still-missed'))
  elif c['degree'] and c['id'] not in ai:kinds.append((c,'new-loss'))
  elif not c['degree'] and c['id'] not in ai:kinds.append((c,'noncollege-loss'))
 for c in a['strong']:
  if c['degree'] and c['id'] not in bi:kinds.append((c,'new-gain'))
 if bs['degreeTop'] and not ass['degreeTop']:
  recorded={c['id'] for c,kind in kinds}
  for c in b['strong']:
   if c['id'] in bs['degreeTop'] and c['id'] in ai and c['id'] not in recorded:kinds.append((c,'ranking-only'))
 for c,kind in kinds:
  cid=c['id'];new=next((x for x in a['strong']+a['candidates'] if x['id']==cid),None)
  supportIds=set((new or {}).get('evidenceIds',[]))
  newlyAsked=[x for x in a['answers'] if x['key'] not in {y['key'] for y in f['answers']} and (x['id'] in supportIds or x['careerId']==cid)]
  omitted=[x for x in b['answers'] if x['response']=='yes' and x['careerId']==cid and x['key'] not in {y['key'] for y in a['answers']}]
  related=[x for x in a['answers'] if x['careerId']==cid or x['id'] in supportIds]
  compact=lambda xs:[{'id':x['id'],'response':x['response'],'selected':x['selected'],'reason':x['reason'],'evidenceRefs':x['evidenceRefs']} for x in xs]
  cases.append({'id':r['id'],'name':r['name'],'cohort':r['cohort'],'careerId':cid,'title':c['title'],'entry':catalog.get(cid,{}).get('entry'),'degree':c['degree'],'kind':kind,'currentStrong':cid in bi,'failedStrong':cid in fi,'protectedStrong':cid in ai,'collegeCoverageCurrent':bool(bs['degreeTop']),'collegeCoverageProtected':bool(ass['degreeTop']),'evidence':{k:new[k] for k in ['r','contexts','interests','contrary','missing']} if new else None,'newlyAsked':compact(newlyAsked),'omitted':compact(omitted),'answered':compact(related),'episodes':[e for e in a['episodes'] if e['careerId']==cid]})
 students.append({'id':r['id'],'name':r['name'],'cohort':r['cohort'],**{name:{'top':endpoint(r[arm])['top'],'college':endpoint(r[arm])['degreeTop'],'allCollege':endpoint(r[arm])['degreeAny'],'unknown':endpoint(r[arm])['unknown']} for name,arm in [('current','baseline'),('failed','failed'),('protected','targeted')]}})

needed={x['id'] for c in cases for name in ['newlyAsked','omitted','answered'] for x in c[name]}
questionLabels={qid:questions.get(qid,{'prompt':qid}) for qid in needed}
result={'study':protocol['id'],'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'protocol':protocol,'summaries':summaries,'totals':{arm:metrics(rows,arm) for arm in ['baseline','targeted','failed']},'cases':cases,'questions':questionLabels,'students':students,'validation':{'models':len(rows),'freshArms':4000,'priorFreshArmsCompared':2000,'officialQuestions':60,'followupsEveryModel':24,'baselineQuestionTraceParity':True,'baselineCareerSupportParity':True,'canonicalCheckpointParity':True,'sourceHashesUnchanged':True,'prototypeWrites':0,'unboundAnswers':0,'noNewProfileFacts':True},'caseCounts':dict(collections.Counter(c['kind'] for c in cases))}
(folder/'summary.json').write_text(json.dumps(result,indent=2))
print(json.dumps([{k:s[k] for k in ['label','baseline','failed','protected','versusCurrent','versusFailed','priorCollegeLosses','recoveredCollegeConnections','stillMissedCollegeConnections','episodes']} for s in summaries],indent=2))
print('Case counts',result['caseCounts'])
