"""Verify actual prompts and all keyed transcripts before any outcome analysis."""
import json,gzip,hashlib
from pathlib import Path
site=Path.cwd();root=Path('/tmp/fieldguide-executor-077');manifest=json.loads(gzip.open(site/'calibration/executor-077/manifest.json.gz','rt').read());models=manifest['models'];defs=manifest['definitions'];rows=[];receipts=[];decoder=json.JSONDecoder()
def sha(b):return hashlib.sha256(b).hexdigest()
for b in range(200):
 p=root/f'answers-{b:03d}.json'
 if not p.exists():raise SystemExit('Incomplete keyed trial; missing batch '+str(b))
 rs=models[b*10:(b+1)*10];d=json.loads(p.read_text());meta=json.loads((root/f'metadata-{b:03d}.json').read_text());prompt=(root/f'prompt-{b:03d}.txt').read_text();raw=json.loads((root/f'raw-{b:03d}.json').read_text())
 assert sha(prompt.encode())==meta['promptSHA256'];assert len(d['models'])==len(rs);assert raw.get('num_turns')==1;assert raw.get('stopReason')=='end_turn';assert set(raw['modelUsage'])=={'grok-4.7-build'};assert raw['modelUsage']['grok-4.7-build']['modelCalls']==1
 actualq=decoder.raw_decode(prompt.split('\nQUESTIONNAIRE:\n',1)[1])[0];actualp=decoder.raw_decode(prompt.split('\nFROZEN PROFILES AND QUESTION ORDERS:\n',1)[1])[0]
 expectedp=[{'id':m['id'],'profile':m['profile'],'questionIndicesInOrder':m['questions'],'requiredAnswerCount':len(m['questions'])}for m in rs];assert actualp==expectedp,(b,'profile or exposure drift')
 keys=sorted({k for m in rs for k in m['questions']});expectedq={str(k):{f:v for f,v in defs[k].items()if f in ['type','prompt','options']}for k in keys}
 for q in expectedq.values():
  if 'options'in q:q['options']=[o['text']for o in q['options']]
 assert actualq==expectedq,(b,'question drift');responses=json.loads(raw['text'].strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip())['responses']
 for a,m in zip(d['models'],rs):
  assert a['id']==m['id']and 'blocks'not in a;assert set(a['answers'])=={str(k)for k in m['questions']};assert responses[m['id']]==a['answers']
  for k in m['questions']:
   v=a['answers'][str(k)];q=defs[k];assert type(v)==int;assert 0<=v<=5 if q['type']=='rating'else 0<=v<=3 if q['type']=='specific'else -1<=v<2**len(q['options'])
  rows.append({'id':a['id'],'answers':a['answers']})
 receipts.append({'batch':b,'models':[m['id']for m in rs],**meta,'modelCalls':1,'stopReason':raw['stopReason'],'responseTextSHA256':sha(raw['text'].encode()),'promptVerifiedAgainstFrozenFacts':True})
assert len(rows)==2000 and len({r['id']for r in rows})==2000
encoded=json.dumps(rows,separators=(',',':')).encode();out=site/'calibration/executor-077';(out/'answers.json.gz').write_bytes(gzip.compress(encoded,mtime=0));(out/'sealed.json').write_text(json.dumps({'count':2000,'sha256':sha(encoded),'method':'All final transcripts use direct question keys, per-question allowed codes and the same configured Grok model/low effort. Positional pilots excluded before outcome analysis. Every actual prompt and response verified. No outcome-based selection.','manifestSHA256':sha((out/'manifest.json.gz').read_bytes()),'model':'grok-4.7-build','verifiedPrompts':200,'verifiedModels':2000},indent=2));(out/'execution-receipt.json.gz').write_bytes(gzip.compress(json.dumps(receipts,separators=(',',':')).encode(),mtime=0));print('SEALED 2000 uniformly keyed transcripts; all actual prompts verified; one model call per batch; no outcome selection.')
