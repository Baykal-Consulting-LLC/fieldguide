import json,gzip,hashlib
from pathlib import Path
root=Path('/tmp/fieldguide-blind-078'); out=Path('research/simulator-078');out.mkdir(exist_ok=True)
protocol=json.loads(Path('calibration/simulator-078/review-protocol.json').read_text());blind=json.loads(gzip.decompress(Path('calibration/simulator-078/blind-input.json.gz').read_bytes()));mapping=json.loads(Path('calibration/simulator-078/blind-map.json').read_text());by={r['id']:r for r in mapping};judgments={};receipts=[]
assert hashlib.sha256(json.dumps(blind,sort_keys=True).encode()).hexdigest()==protocol['blindInputSHA256']
for b in range(24):
 p=root/f'review-{b:02d}.json'
 if not p.exists():continue
 d=json.loads(p.read_text());r=json.loads((root/f'receipt-{b:02d}.json').read_text());prompt=(root/f'prompt-{b:02d}.txt').read_text();assert hashlib.sha256(prompt.encode()).hexdigest()==r['promptSHA256']
 presented=json.loads(prompt.split('ANONYMIZED REVIEW INPUT:\n',1)[1]);expected=blind[b*8:(b+1)*8];assert len(presented)==len(expected)
 for a,e in zip(presented,expected):assert {k:v for k,v in a.items()if k!='sourceEvidence'}==e
 evidence_profiles={q['id']:respondent['profile'] for respondent in expected for q in respondent['items']};assert set(d['judgments'])==set(evidence_profiles)
 envelope=json.loads((root/f'raw-{b:02d}.json').read_text());payload=envelope['text'].strip()
 if payload.startswith('```'):payload=payload.split('\n',1)[1].rsplit('```',1)[0]
 assert hashlib.sha256(payload.encode()).hexdigest()==r['responseSHA256'];assert json.loads(payload)==d;assert envelope['num_turns']==1 and envelope['modelUsage']['grok-4.7-build']['modelCalls']==1
 for key,j in d['judgments'].items():
  for ev in j['evidence']:
   v=evidence_profiles[key]
   for token in ev['path'].strip('/').split('/'):v=v[int(token)]if isinstance(v,list)else v[token.replace('~1','/').replace('~0','~')]
   assert isinstance(v,str)and ev['quote']in v and len(ev['quote'])>=8
 assert not set(judgments)&set(d['judgments']);judgments.update(d['judgments']);receipts.append(r)
dev=[]
for id,j in judgments.items():
 x=by[id]
 if not x['repairDevelopment']:continue
 dev.append({**x,**j,'preferredExecutor':x['AExecutor'] if j['choice']=='A' else ('existing' if x['AExecutor']=='grok' else 'grok') if j['choice']=='B' else j['choice'],'existingVerdict':j['aVerdict']if x['AExecutor']=='existing' else j['bVerdict'],'grokVerdict':j['aVerdict']if x['AExecutor']=='grok' else j['bVerdict']})
(out/'development-review.json').write_text(json.dumps({'completedBatches':len(receipts),'developmentUnits':len(dev),'judgments':dev},indent=2))
print(json.dumps({'completedBatches':len(receipts),'developmentUnits':len(dev),'sealedEvaluationUnits':sum(not by[k]['repairDevelopment']for k in judgments)}))
if len(receipts)==24:
 assert set(judgments)==set(by) and len(judgments)==384
 payload=json.dumps({'judgments':judgments,'receipts':receipts},separators=(',',':')).encode();Path('calibration/simulator-078/blind-judgments.json.gz').write_bytes(gzip.compress(payload,compresslevel=9,mtime=0));Path('calibration/simulator-078/review-seal.json').write_text(json.dumps({'sha256':hashlib.sha256(payload).hexdigest(),'items':384,'profiles':192,'type':'Executor-blinded fresh AI session; not human or independent-provider validation','receipts':receipts},indent=2))
 print('ALL BLINDED JUDGMENTS SEALED. Evaluation mapping remains unrevealed until rule freeze.')
