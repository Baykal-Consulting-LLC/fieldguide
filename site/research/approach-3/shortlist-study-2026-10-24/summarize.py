import gzip,json,hashlib,statistics,datetime
from pathlib import Path

root=Path(__file__).resolve().parents[2]
folder=Path(__file__).resolve().parent
protocol=json.loads((folder/'protocol.json').read_text())
questions=json.load(gzip.open(root/'site/dist/developer/journeys-104.json.gz','rt'))['questions']
catalog=json.load(gzip.open(root/'site/dist/developer/matrix-104.json.gz','rt'))['catalog']
rows=[]
for i in range(4):
 d=json.load(gzip.open(folder/f'shard-{i}.json.gz','rt'));assert len(d['rows'])==500
 rows.extend(d['rows'])
assert len(rows)==2000 and len({r['id'] for r in rows})==2000
for s in protocol['sources']:
 assert hashlib.sha256((root/s['path']).read_bytes()).hexdigest()==s['sha256'],s['path']+' changed during experiment'

def ids(items):return {c['id'] for c in items}
def endpoint(arm):return arm['curve'][-1]
def distribution(values):
 return {'mean':round(statistics.mean(values),2),'median':statistics.median(values),'p90':sorted(values)[max(0,int(len(values)*.9)-1)],'min':min(values),'max':max(values)}
def metrics(rs,arm):
 ends=[endpoint(r[arm]) for r in rs]
 return {'models':len(rs),'strong':sum(bool(e['top']) for e in ends),'degreeFirst3':sum(bool(e['degreeTop']) for e in ends),'degreeAny':sum(bool(e['degreeAny']) for e in ends),'unbound':sum(r[arm]['unbound'] for r in rs),'asked':sum(e['asked'] for e in ends),'unknown':sum(e['unknown'] for e in ends),'questionCounts':distribution([e['asked'] for e in ends]),'exploration':distribution([len(r[arm]['candidates']) for r in rs]),'priority':distribution([len(r[arm]['priority']) for r in rs]),'zeroPriority':sum(not r[arm]['priority'] for r in rs),'broadOnly':sum(r[arm]['display']['broadOnly'] for r in rs),'hiddenConfirmedCollege':sum(r[arm]['display']['hiddenConfirmedCollege'] for r in rs)}
groups=[('original','First 1,000 · all splits',lambda r:r['cohort']!='grok075'),('development','Development',lambda r:r['cohort']=='development'),('holdout','Original holdout',lambda r:r['cohort']=='holdout'),('holdout049','Fresh holdout',lambda r:r['cohort']=='holdout049'),('holdout056','Expansion holdout',lambda r:r['cohort']=='holdout056'),('grok075','Grok evaluation',lambda r:r['cohort']=='grok075')]
summaries=[]
for key,label,pred in groups:
 rs=[r for r in rows if pred(r)];before=metrics(rs,'baseline');after=metrics(rs,'targeted')
 changes={}
 for metric,field in [('Strong','top'),('DegreeFirst3','degreeTop'),('DegreeAny','degreeAny')]:
  changes['gained'+metric]=sum(not endpoint(r['baseline'])[field] and bool(endpoint(r['targeted'])[field]) for r in rs)
  changes['lost'+metric]=sum(bool(endpoint(r['baseline'])[field]) and not endpoint(r['targeted'])[field] for r in rs)
 curves=[]
 for budget in [0,4,8,12,16,24]:
  curves.append({'budget':budget,**{arm:{'strong':sum(bool(next(e for e in r[arm]['curve'] if e['budget']==budget)['top']) for r in rs),'degreeFirst3':sum(bool(next(e for e in r[arm]['curve'] if e['budget']==budget)['degreeTop']) for r in rs)} for arm in ['baseline','targeted']}})
 summaries.append({'id':key,'label':label,'before':before,'after':after,'changes':changes,'curves':curves})

cases=[];studentRows=[];lowBroadCollege=[]
for r in rows:
 b=r['baseline'];a=r['targeted'];be=endpoint(b);ae=endpoint(a)
 lostDegree=[c for c in b['strong'] if c['degree'] and c['id'] not in ids(a['strong'])]
 lostDegreeFirst3=[c for c in b['strong'] if c['id'] in be['degreeTop'] and c['id'] not in ae['degreeTop']]
 gainedDegree=[c for c in a['strong'] if c['degree'] and c['id'] not in ids(b['strong'])]
 for c in a['strong']:
  if c['degree'] and c['r'] is not None and c['r']<.608:lowBroadCollege.append({'id':r['id'],'name':r['name'],'cohort':r['cohort'],'careerId':c['id'],'title':c['title'],'r':c['r']})
 if lostDegree or lostDegreeFirst3 or be['top'] and not ae['top']:
  for c in list({c['id']:c for c in lostDegree+lostDegreeFirst3}.values()) or [{'id':None,'title':'Lost all strong matches','degree':False}]:
   cid=c['id'];new=next((x for x in a['candidates']+a['strong'] if x['id']==cid),None)
   oldanswers=[x for x in b['answers'] if x['careerId']==cid and x['response']=='yes'];newKeys={x['key'] for x in a['answers']}
   missing=[{'id':x['id'],'prompt':questions.get(x['id'],{}).get('prompt',x['id']),'response':x['response']} for x in oldanswers if x['key'] not in newKeys]
   cases.append({'id':r['id'],'name':r['name'],'cohort':r['cohort'],'careerId':cid,'title':c['title'],'entry':catalog.get(cid,{}).get('entry'),'degree':c['degree'],'kind':'missed-career' if cid and cid not in ids(a['strong']) else 'outside-first-three' if cid else 'lost-strong-coverage','lostAllStrong':bool(be['top']) and not bool(ae['top']),'lostDegreeFirst3':bool(be['degreeTop']) and not bool(ae['degreeTop']),'lostDegreeAny':bool(be['degreeAny']) and not bool(ae['degreeAny']),'missingChecks':missing,'currentMissing':new['missing'] if new else [],'currentEvidence':new['evidence'] if new else None,'currentContexts':new['contexts'] if new else None,'currentInterests':new['interests'] if new else None,'beforeTop':be['top'],'afterTop':ae['top']})
 studentRows.append({'id':r['id'],'name':r['name'],'cohort':r['cohort'],'before':{'strong':bool(be['top']),'degree':bool(be['degreeTop']),'allCandidates':len(b['candidates']),'priority':len(b['priority'])},'after':{'strong':bool(ae['top']),'degree':bool(ae['degreeTop']),'allCandidates':len(a['candidates']),'priority':len(a['priority'])},'lostDegree':[c['title'] for c in lostDegree],'gainedDegree':[c['title'] for c in gainedDegree]})

totals={arm:metrics(rows,arm) for arm in ['baseline','targeted']}
result={'study':protocol['id'],'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'protocol':protocol,'summaries':summaries,'totals':totals,'cases':cases,'lowBroadCollegeRetained':lowBroadCollege,'students':studentRows,'selectedExamples':[r for r in rows if r['id'] in ['life-005','scale056-0115','scale056-0061']],'validation':{'models':len(rows),'freshArms':4000,'maxFollowups':24,'baselineQuestionTraceParity':True,'baselineCareerSupportParity':True,'canonicalCheckpointParity':True,'sourceHashesUnchanged':True,'prototypeWrites':0,'unknownsCounted':True,'sampledHiddenCollegeAssertionsZero':True}}
(folder/'summary.json').write_text(json.dumps(result,indent=2))
print(json.dumps([{**{'group':s['label'],'models':s['before']['models'],'beforeStrong':s['before']['strong'],'afterStrong':s['after']['strong'],'beforeDegree':s['before']['degreeFirst3'],'afterDegree':s['after']['degreeFirst3']},**s['changes']} for s in summaries],indent=2))
print('cases',len(cases),'college misses',sum(c['degree'] and c['kind']=='missed-career' for c in cases),'low broad degree retained',len(lowBroadCollege))
print('Pool distributions',json.dumps({a:{'exploration':totals[a]['exploration'],'priority':totals[a]['priority']} for a in totals}))
