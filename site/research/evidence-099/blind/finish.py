import json,subprocess,concurrent.futures
from pathlib import Path
root=Path('/tmp/fieldguide-grok-blind-099');manifest=json.loads((root/'generation-contract.json').read_text());q=json.loads((root/'neutral-questionnaire.json').read_text())
valid={k:{x['id'] for x in q[k]} for k in ['topics','methods','responsibilities']}
def validate(d,roster):
 assert len(d['profiles'])==len(roster)
 for p,r in zip(d['profiles'],roster):
  assert p['id']==r['id'] and p['age']==r['age'] and p['raceEthnicity']==r['raceEthnicity']
  for pos,neg,k in [('positiveTopics','negativeTopics','topics'),('positiveMethods','negativeMethods','methods')]:
   assert set(p[pos])<=valid[k] and set(p[neg])<=valid[k] and not set(p[pos])&set(p[neg])
  assert set(p['responsibilities'])<=valid['responsibilities'];assert len(p['official'])==60 and all(type(v)==int and 1<=v<=5 for v in p['official'])
  assert set(p['followups'])=={f['id']for f in q['followups']} and all(type(v)==int and 0<=v<=5 for v in p['followups'].values())
  assert all(type(v)==int and 0<=v<=3 for v in p['lifestyleChoices'].values())
 return d

def run(letter,start):
 rs=manifest['roster'][start:start+10];stem='batch-004'+letter
 prompt=root/(stem+'.prompt.txt');prompt.write_text(manifest['contract']+'\nReturn EXACTLY 10 complete profiles for this roster, not 20. Do not repeat text.\nQUESTIONNAIRE:\n'+json.dumps(q)+'\nROSTER:\n'+json.dumps(rs))
 for attempt in range(2):
  raw=root/(stem+'.raw.json');err=root/(stem+'.stderr.log')
  cmd=['/Users/muratbaykal/.grok/bin/grok','--cwd',str(root),'--verbatim','--system-prompt-override','Author independent synthetic student profiles. No tools, external context, web or subagents. Return JSON only.','--no-subagents','--disable-web-search','--tools','','--max-turns','1','--output-format','json','--reasoning-effort','low','--prompt-file',str(prompt)]
  with raw.open('w') as f,err.open('w') as e: result=subprocess.run(cmd,stdout=f,stderr=e,timeout=600)
  try:
   assert result.returncode==0
   text=json.loads(raw.read_text())['text'].strip()
   if text.startswith('```'):text=text.split('\n',1)[1].rsplit('```',1)[0]
   d=validate(json.loads(text),rs);(root/(stem+'.json')).write_text(json.dumps(d));print('Generated final blind subset',letter,10,flush=True);return
  except Exception as ex:print('Schema retry',letter,attempt,type(ex).__name__,flush=True)
 raise RuntimeError(stem)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:list(ex.map(lambda x:run(*x),[('a',80),('b',90)]))
profiles=[p for b in range(4)for p in json.loads((root/f'batch-{b:03d}.json').read_text())['profiles']]+[p for x in ['a','b']for p in json.loads((root/f'batch-004{x}.json').read_text())['profiles']]
assert len(profiles)==100 and len({p['id'] for p in profiles})==100
(root/'profiles.json').write_text(json.dumps(profiles))
(root/'technical-retry.json').write_text(json.dumps({'reason':'Last 20-profile invocation entered provider tail-repetition recovery. Stopped without a profile result and split the identical assigned roster into two independent 10-profile requests.','selection':'No profiles removed or changed based on matching outcomes.','retained':100}))
print('SEALED generation of 100 profiles before outcomes.',flush=True)
