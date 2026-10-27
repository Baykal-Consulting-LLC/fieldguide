"""Repair terminal transport/schema failures only; no recommendation outcomes are read."""
import json,gzip,subprocess,concurrent.futures,hashlib,time
from pathlib import Path
site=Path.cwd();root=Path('/tmp/fieldguide-executor-077');data=json.loads((root/'input.json').read_text());models=data['models'];bank=data['definitions'];contract=(root/'contract.txt').read_text();contract += '\nTRANSPORT ONLY: nest each model’s direct question-keyed answers under p0,p1,... in groups of 32 requested question indices, as required by the output schema. The keys INSIDE each p-group are the actual question indices. These groups change no question, answer code or interpretation. Return {"responses":{"modelId":{"p0":{"questionIndex":integer,...},...},...}}.'
(root/'nested-keyed-repair-contract.txt').write_text(contract)
(site/'calibration/executor-077/nested-transport-amendment.json').write_text(json.dumps({'reason':'Repair exhausted output-format failures using smaller keyed containers. Same ten frozen profiles, exact questions, interpretation instructions, model and low effort. No matching outcomes are read. All final answers remain directly keyed to question IDs. Valid complete transcripts are never replaced for their results.','createdAt':time.time(),'contractSHA256':hashlib.sha256(contract.encode()).hexdigest()},indent=2))
def active():
 return subprocess.check_output(['ps','-Ao','args='],text=True)
def allowed(k):
 q=bank[k];return list(range(6))if q['type']=='rating'else list(range(4))if q['type']=='specific'else list(range(-1,2**len(q['options'])))
def run(b):
 out=root/f'answers-{b:03d}.json'
 if out.exists():return
 rs=models[b*10:(b+1)*10];keys=sorted({k for m in rs for k in m['questions']});qb={str(k):{f:v for f,v in bank[k].items()if f in ['type','prompt','options']}for k in keys}
 for key,q in qb.items():
  if 'options'in q:q['options']=[o['text']for o in q['options']]
  q['allowedCodes']=allowed(int(key))
 roster=[{'id':m['id'],'profile':m['profile'],'questionIndicesInOrder':m['questions'],'requiredAnswerCount':len(m['questions'])}for m in rs];base=contract+'\nQUESTIONNAIRE:\n'+json.dumps(qb,separators=(',',':'))+'\nFROZEN PROFILES AND QUESTION ORDERS:\n'+json.dumps(roster,separators=(',',':'))
 schema={'type':'object','properties':{'responses':{'type':'object','properties':{m['id']:{'type':'object','properties':{'p'+str(i//32):{'type':'object','properties':{str(k):{'type':'integer','enum':allowed(k)}for k in m['questions'][i:i+32]},'required':[str(k)for k in m['questions'][i:i+32]],'additionalProperties':False}for i in range(0,len(m['questions']),32)},'required':['p'+str(i//32)for i in range(0,len(m['questions']),32)],'additionalProperties':False}for m in rs},'required':[m['id']for m in rs],'additionalProperties':False}},'required':['responses'],'additionalProperties':False}
 prompt=root/f'prompt-{b:03d}.txt';raw=root/f'raw-{b:03d}.json';backup=root/'failed-flat-transports';backup.mkdir(exist_ok=True)
 for name in [prompt,raw,root/f'err-{b:03d}.log']:
  if name.exists():(backup/(str(int(time.time()))+'-'+name.name)).write_bytes(name.read_bytes())
 for attempt in range(4):
  prompt.write_text(base+(''if attempt==0 else '\nSchema repair only: return every requested question key with an allowed integer code. No preferences or outcomes are being changed.'))
  cmd=['/Users/muratbaykal/.grok/bin/grok','--cwd',str(root),'--verbatim','--system-prompt-override','You are a blind questionnaire answer executor. Use only supplied profiles and questions. Return complete JSON only. No tools.','--no-subagents','--disable-web-search','--tools','','--max-turns','1','--output-format','json','--json-schema',json.dumps(schema,separators=(',',':')),'--reasoning-effort','low','--prompt-file',str(prompt)]
  try:
   with raw.open('w')as f,(root/f'err-{b:03d}.log').open('w')as e:r=subprocess.run(cmd,stdout=f,stderr=e,timeout=1500)
   assert r.returncode==0;response=json.loads(raw.read_text());s=response['text'].strip()
   if s.startswith('```'):s=s.split('\n',1)[1].rsplit('```',1)[0]
   d=json.loads(s);assert set(d['responses'])=={m['id']for m in rs};rows=[]
   for m in rs:
    groups=d['responses'][m['id']];assert set(groups)=={'p'+str(i//32)for i in range(0,len(m['questions']),32)};answers={}
    for group in groups.values():
     assert not set(answers)&set(group);answers.update(group)
    assert set(answers)=={str(k)for k in m['questions']},(m['id'],'keys')
    for k in m['questions']:
     v=answers[str(k)]
     if type(v)==float and v.is_integer():v=int(v);answers[str(k)]=v
     assert type(v)==int and v in allowed(k),(m['id'],k,v)
    rows.append({'id':m['id'],'answers':answers})
   out.write_text(json.dumps({'models':rows},separators=(',',':')));(root/f'metadata-{b:03d}.json').write_text(json.dumps({'batch':b,'attempts':attempt+1,'modelUsage':response['modelUsage'],'transport':'nested-direct-question-keys','promptSHA256':hashlib.sha256(prompt.read_bytes()).hexdigest(),'schemaSHA256':hashlib.sha256(json.dumps(schema,sort_keys=True).encode()).hexdigest(),'answerSHA256':hashlib.sha256(out.read_bytes()).hexdigest(),'completedAt':time.time()}));print('Repaired keyed batch',b,flush=True);return
  except Exception as e:print('Nested transport retry',b,attempt,repr(e),flush=True)
 raise RuntimeError('Nested transport failed '+str(b))
# All earlier generators are finished. Complete every missing batch without
# cancelling queued cases when one transport fails.
missing=[b for b in range(200)if not(root/f'answers-{b:03d}.json').exists()]
print('Remaining keyed batches',len(missing),flush=True)
failed=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=24)as ex:
 futures={ex.submit(run,b):b for b in missing}
 for future in concurrent.futures.as_completed(futures):
  try:future.result()
  except Exception as e:
   failed.append(futures[future]);print('Needs further transport repair',futures[future],repr(e),flush=True)
(root/'remaining-transport-failures.json').write_text(json.dumps(failed))
print('Remaining keyed pass complete; failed batches',failed,flush=True)
