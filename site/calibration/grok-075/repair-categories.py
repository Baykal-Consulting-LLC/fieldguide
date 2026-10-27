import json,subprocess,time,concurrent.futures
from pathlib import Path
root=Path('/tmp/fieldguide-grok-blind-075')
enums={'education':['short training','associate','bachelor','graduate','open','undecided'],'gender':['girl','boy','nonbinary','not stated'],'region':['Northeast','Midwest','South','West'],'locale':['urban','suburban','town','rural'],'exposure':['limited','mixed','broad']}
def repair(b):
 src=root/f'batch-{b:03d}.json'
 while not src.exists():time.sleep(5)
 ps=json.loads(src.read_text())['profiles'];bad=[{'id':p['id'],**{k:p[k] for k,vs in enums.items() if p[k] not in vs}}for p in ps if any(p[k]not in vs for k,vs in enums.items())]
 target=root/f'batch-{b:03d}.categories.json'
 if target.exists():return b
 if not bad:target.write_text('{}');return b
 prompt=root/f'categories-{b:03d}.prompt.txt';prompt.write_text('Correct categorical schema fields only for these independently authored synthetic student profiles. Preserve the intent of each supplied description; no careers, matching rules, scores or outcomes are available. Do not infer interests or change any other answer. Return JSON {"repairs":[{"id":"...","education":"one allowed value",...only supplied invalid fields}]} . Allowed values: '+json.dumps(enums)+'\nDescriptions: '+json.dumps(bad))
 for attempt in range(3):
  cmd=['/Users/muratbaykal/.grok/bin/grok','--cwd',str(root),'--verbatim','--system-prompt-override','You repair supplied categorical JSON values without changing meaning. No tools or external context. JSON only.','--no-subagents','--disable-web-search','--tools','','--max-turns','1','--output-format','json','--reasoning-effort','low','--prompt-file',str(prompt)]
  raw=root/f'categories-{b:03d}-{attempt}.raw.json'
  with raw.open('w')as f,(root/f'categories-{b:03d}-{attempt}.log').open('w')as e:r=subprocess.run(cmd,stdout=f,stderr=e,timeout=600)
  try:
   d=json.loads(raw.read_text())['text'].strip()
   if d.startswith('```'):d=d.split('\n',1)[1].rsplit('```',1)[0]
   xs=json.loads(d)['repairs'];assert len(xs)==len(bad)
   out={}
   for x,p in zip(xs,bad):
    assert x['id']==p['id'];assert set(x)==set(p)
    assert all(x[k]in enums[k]for k in x if k!='id');out[x['id']]={k:v for k,v in x.items()if k!='id'}
   target.write_text(json.dumps(out));print('Categorical schema repair',b,len(xs),flush=True);return b
  except Exception:pass
 raise RuntimeError('Could not repair categories '+str(b))
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as ex:list(ex.map(repair,range(50)))
print('CATEGORY REPAIRS COMPLETE',flush=True)
