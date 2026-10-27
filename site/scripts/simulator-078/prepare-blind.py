import gzip,json,hashlib,random
from pathlib import Path
root=Path.cwd();out=root/'calibration/simulator-078';temp=Path('/tmp/fieldguide-blind-078');temp.mkdir(exist_ok=True)
read=lambda p:json.loads(gzip.decompress(Path(p).read_bytes()))
m=read('calibration/executor-077/manifest.json.gz');r=read('research/executor-077/results.json.gz');answers={a['id']:a['answers']for a in read('calibration/executor-077/answers.json.gz')};models={x['id']:x for x in m['models']};results={x['id']:x for x in r['rows']};rank=lambda s:hashlib.sha256(('blind078-v1:'+s).encode()).hexdigest()
def clean(x):
 if isinstance(x,dict):return{k:clean(v)for k,v in x.items()if k not in ['id','name','phase','variationTags']}
 if isinstance(x,list):return[clean(v)for v in x]
 return x
def label(q,v):
 if q['type']=='specific':return['Unknown / insufficient evidence','Yes, would enjoy learning this work regularly','No, not for me','Unsure / mixed'][v]
 if q['type']=='rating':return['Unknown / insufficient evidence','Strongly dislike','Dislike','Neutral / unsure','Like','Strongly like'][v]
 if v==0:return 'Unknown / insufficient evidence'
 if v==-1:return 'None of these; explicitly not for me'
 return 'Selected: '+'; '.join(o['text']for j,o in enumerate(q['options'])if v&2**j)
strata=[('development','narrative',32),('development','structured',32),('holdout','narrative',8),('holdout049','narrative',6),('holdout056','structured',18),('grok075','structured',96)];sample=[]
for group,kind,n in strata:
 eligible=[x for x in m['models']if x['cohort']==group and not results[x['id']]['exactTopSet'] and (('statedEnjoyedActivities'in x['profile'])==(kind=='structured'))]
 eligible.sort(key=lambda x:rank(x['id']));assert len(eligible)>=n,(group,kind,len(eligible));sample+=eligible[:n]
units=[];mapping=[];roster=[]
for p in sample:
 row=results[p['id']];changed_top={x['id']for x in row['addedTop']+row['removedTop']};changed_fields={f for x in row['addedTop']+row['removedTop']for f in x['fields']};diffs=[]
 for i,k in enumerate(p['questions']):
  q=m['definitions'][k];a=p['baseline'][i];b=answers[p['id']][str(k)]
  if a!=b:diffs.append((k,q,a,b))
 first=sorted([x for x in diffs if x[1]['type']=='specific'and x[1].get('scope')in changed_top],key=lambda x:rank(p['id']+str(x[0])))
 if not first:first=sorted([x for x in diffs if x[1]['type']=='specific'],key=lambda x:rank(p['id']+str(x[0])))
 if not first:first=sorted(diffs,key=lambda x:rank(p['id']+str(x[0])))
 assert first;chosen=[first[0]]
 second=[x for x in diffs if x[0]!=chosen[0][0]and x[1]['type']=='multi'and x[1].get('scope')in changed_fields]
 if not second:second=[x for x in diffs if x[0]!=chosen[0][0]and x[1]['type']=='multi']
 if not second:second=[x for x in diffs if x[0]!=chosen[0][0]]
 assert second;chosen+=sorted(second,key=lambda x:rank(p['id']+str(x[0])))[0:1]
 pid='P'+rank(p['id'])[:12];us=[]
 for k,q,a,b in chosen:
  uid='Q'+rank(p['id']+':'+str(k))[:14];swap=int(rank(uid)[0],16)%2;values=[b,a]if swap else[a,b]
  unit={'id':uid,'question':q['prompt'],'type':q['type'],'choices':[o['text']for o in q.get('options',[])],'A':label(q,values[0]),'B':label(q,values[1])};us.append(unit)
  mapping.append({'id':uid,'modelId':p['id'],'cohort':p['cohort'],'profileKind':results[p['id']]['profileKind'],'questionIndex':k,'questionId':q['id'],'questionType':q['type'],'existing':a,'grok':b,'AExecutor':'grok'if swap else'existing','repairDevelopment':p['cohort']=='development'})
 roster.append({'respondent':pid,'profile':clean(p['profile']),'items':us})
assert len(roster)==192 and len(mapping)==384
rng=random.Random(78021);rng.shuffle(roster)
protocol={'version':'simulator-078','review':'Executor-blinded AI review, fresh Grok CLI sessions; same provider as one executor, no human validation','sample':{'profiles':192,'items':384,'cohortStrata':strata,'selection':'Fixed SHA-256 ordering of changed-Top-set profiles; one relevant profession disagreement and one relevant activity disagreement where available. Stratified diagnostic sample, not representative population accuracy.'},'blindness':'Reviewer sees anonymized frozen profiles, actual question/options and independently shuffled human-readable A/B answers only. Executor names, IDs, occupation links, match results, wage/education metrics and prior reviews withheld. Natural job wording in the actual question retained.','repairSeparation':'Use original development judgments for authoring. Keep all original holdout and Grok judgments sealed until repair rules are frozen. Existing holdouts have been inspected in earlier work; not pristine final validation.','unknowns':'Missing enjoyment is not disinterest. Grades, ability, demography, wellbeing, obligations and access do not imply enjoyment. Do not invent missing specialist purpose. Literal OR alternatives need one branch, not every example.','limits':'Same-model self-style and prompt effects can remain despite executor labels being blinded. Two items per profile; report clustered profiles and both/neither/unresolved, not just a winner rate. No live changes.'}
protocol['manifestSHA256']=hashlib.sha256(Path('calibration/executor-077/manifest.json.gz').read_bytes()).hexdigest();protocol['blindInputSHA256']=hashlib.sha256(json.dumps(roster,sort_keys=True).encode()).hexdigest()
(out/'review-protocol.json').write_text(json.dumps(protocol,indent=2));(out/'blind-map.json').write_text(json.dumps(mapping,indent=2));(temp/'review-input.json').write_text(json.dumps(roster));(out/'blind-input.json.gz').write_bytes(gzip.compress(json.dumps(roster).encode(),mtime=0));print('Frozen blinded review:',len(roster),'profiles,',len(mapping),'items, 24 batches; maps/outcomes withheld from reviewer.')
