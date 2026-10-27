import json,subprocess,concurrent.futures,hashlib,time,os,signal
from pathlib import Path
root=Path('/tmp/fieldguide-grok-blind-075');q=json.loads((root/'neutral-questionnaire.json').read_text());manifest=json.loads((root/'generation-contract.json').read_text());roster=manifest['roster'];contract=manifest['contract'];valid={k:{x['id']for x in q[k]}for k in ['topics','methods','responsibilities']}
# Transfer only our two generation coordinators; running Grok children finish
# unchanged and their raw outputs are collected below. Never touch other Grok work.
active={}
for line in subprocess.check_output(['ps','-Ao','pid,args'],text=True).splitlines():
 parts=line.strip().split(None,1)
 if len(parts)<2 or not parts[0].isdigit():continue
 pid,args=int(parts[0]),parts[1]
 if args.endswith('/tmp/fieldguide-grok-blind-075/generate.py')or args.endswith('/tmp/fieldguide-grok-blind-075/generate-supplement.py'):os.kill(pid,signal.SIGTERM)
 elif args.startswith('/Users/muratbaykal/.grok/bin/grok --cwd /tmp/fieldguide-grok-blind-075 ')and '/batch-'in args:
  b=int(args.rsplit('/batch-',1)[1].split('.',1)[0]);active[b]=pid
(root/'coordination-transfer.json').write_text(json.dumps({'transferredAt':time.time(),'runningBatches':active,'reason':'Preserve in-flight independent generations while allowing more pending independent batches; no outcomes available.'},indent=2))
def parse(raw):
 r=json.loads(raw.read_text());s=r['text'].strip()
 if s.startswith('```'):s=s.split('\n',1)[1].rsplit('```',1)[0]
 return json.loads(s)
def errors(d,b):
 if not isinstance(d,dict)or len(d.get('profiles',[]))!=20:return ['Expected 20 profiles']
 errs=[]
 for p,r in zip(d['profiles'],roster[b*20:b*20+20]):
  if p.get('id')!=r['id']or p.get('age')!=r['age']or p.get('raceEthnicity')!=r['raceEthnicity']:errs.append({'id':p.get('id'),'field':'roster','expected':r})
  for pos,neg,k in [('positiveTopics','negativeTopics','topics'),('positiveMethods','negativeMethods','methods')]:
   if not set(p.get(pos,[]))<=valid[k]or not set(p.get(neg,[]))<=valid[k]or set(p.get(pos,[]))&set(p.get(neg,[]))or len(p.get(pos,[]))!=len(set(p.get(pos,[]))):errs.append({'id':p['id'],'field':pos+'/'+neg})
  if not set(p.get('responsibilities',[]))<=valid['responsibilities']:errs.append({'id':p['id'],'field':'responsibilities'})
  if len(p.get('official',[]))!=60 or not all(type(v)==int and 1<=v<=5 for v in p.get('official',[])):errs.append({'id':p['id'],'field':'official','length':len(p.get('official',[]))})
  if set(p.get('followups',{}))!={f['id']for f in q['followups']}or not all(type(v)==int and 0<=v<=5 for v in p.get('followups',{}).values()):errs.append({'id':p['id'],'field':'followups'})
  if not all(type(v)==int and 0<=v<=3 for v in p.get('lifestyleChoices',{}).values()):errs.append({'id':p['id'],'field':'lifestyleChoices'})
  if len(p.get('narrative','').split())<35:errs.append({'id':p['id'],'field':'narrative'})
 return errs

def call(prompt,raw):
 cmd=['/Users/muratbaykal/.grok/bin/grok','--cwd',str(root),'--verbatim','--system-prompt-override','Independently author or repair the supplied synthetic profiles. No tools or external context. JSON only.','--no-subagents','--disable-web-search','--tools','','--max-turns','1','--output-format','json','--reasoning-effort','low','--prompt-file',str(prompt)]
 with raw.open('w')as f,raw.with_suffix('.stderr.log').open('w')as e:r=subprocess.run(cmd,stdout=f,stderr=e,timeout=1800)
 assert r.returncode==0
 return parse(raw)
def run(b):
 out=root/f'batch-{b:03d}.json';raw=root/f'batch-{b:03d}.raw.json'
 if out.exists():return b
 if b in active:
  while True:
   try:os.kill(active[b],0);time.sleep(3)
   except ProcessLookupError:break
  try:d=parse(raw)
  except Exception:d=None
 else:d=None
 if d is None:
  prompt=root/f'batch-{b:03d}.prompt.txt';prompt.write_text(contract+'\nQUESTIONNAIRE (no scoring or occupations):\n'+json.dumps(q)+'\nROSTER:\n'+json.dumps(roster[b*20:b*20+20]));d=call(prompt,raw)
 for attempt in range(4):
  es=errors(d,b)
  if not es:out.write_text(json.dumps(d,separators=(',',':')));print('Accepted blind batch',b,'profiles 20',flush=True);return b
  (root/f'batch-{b:03d}.schema-{attempt}.json').write_text(json.dumps({'errors':es,'before':d}))
  # Correct only malformed fields, retaining all other authored features. Official
  # arrays with an ambiguous missing position are re-answered by exact item ID.
  ps=[p for p in d['profiles']if any(e.get('id')==p['id']for e in es if isinstance(e,dict))]
  if not ps:raise RuntimeError('Incomplete batch '+str(b))
  prompt=root/f'field-repair-{b:03d}-{attempt}.prompt.txt';prompt.write_text('Repair only the listed invalid fields in these independently authored synthetic student profiles, consistent with the whole profile. No occupations, matching engine, rules or outcomes are available. Preserve every other answer. Return {"repairs":[{"id":"...","fieldName":correctedValue}]} with only the fields identified as invalid. If official is malformed, its array positions are unreliable: return official as an OBJECT mapping EVERY exact official item ID to 1-5. Use 3 (unsure) for missing interest; never invent confident interests. Other fields use the original contract/schema.\nCONTRACT:\n'+contract+'\nQUESTIONNAIRE:\n'+json.dumps(q)+'\nERRORS:\n'+json.dumps(es)+'\nPROFILES:\n'+json.dumps(ps))
  patch=call(prompt,root/f'field-repair-{b:03d}-{attempt}.raw.json')['repairs'];byid={p['id']:p for p in d['profiles']}
  for x in patch:
   p=byid[x['id']]
   for k,v in x.items():
    if k=='id':continue
    if k=='official'and isinstance(v,dict):
     assert set(v)=={z['id']for z in q['official']};v=[v[z['id']]for z in q['official']]
    p[k]=v
  print('Narrow blind schema repair',b,attempt,'fields',len(es),flush=True)
 raise RuntimeError('Unrepaired schema '+str(b))
with concurrent.futures.ThreadPoolExecutor(max_workers=20)as ex:list(ex.map(run,range(50)))
print('COMPLETE 1000 independent profiles; no outcomes inspected.',flush=True)
