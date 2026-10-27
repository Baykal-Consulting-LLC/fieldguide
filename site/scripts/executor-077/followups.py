"""Blind targeted round on the fixed 0.76 invitations, separate from full-survey replay."""
import json,gzip,subprocess,concurrent.futures,hashlib,time
from pathlib import Path
site=Path.cwd();root=Path('/tmp/fieldguide-executor-targeted-077');root.mkdir(exist_ok=True)
manifest=json.loads(gzip.open(site/'calibration/executor-077/manifest.json.gz','rt').read());baseline=json.loads(gzip.open(site/'research/evidence-076/results.json.gz','rt').read());profiles={m['id']:m['profile']for m in manifest['models']}
qs=baseline['questionBank'];bank={q['id']:str(i)for i,q in enumerate(qs)};jobs=[{'id':r['id'],'profile':profiles[r['id']],'questions':[bank[q['questionId']]for q in r['followups']]}for r in baseline['rows']if r['followups']]
contract='''Independently answer ONLY the supplied narrow follow-up questions as each fictional student, using only their frozen profile facts. No career recommendation, scoring, tools, external files, web, subagents or prior context. Old responses and matching outcomes are withheld. Do not optimize a result. Answer the precise activity, not just its broad subject. Skill, confidence, access, demographics, health, family duties, financial means and education aspirations do not independently establish enjoyment. Explicit chosen enjoyed activities are evidence; omitted distinctive activities remain unknown. Never invent missing interests. For each question use 1=Yes, I would like to learn this exact work;2=No, this work does not interest me;3=Unsure/mixed;0=Unfamiliar/insufficient profile evidence. Return {"responses":{"modelId":{"opaqueQuestionIndex":integer,...},...}} only. Exactly each requested question key, every model in order. These are synthetic profiles, not real people.'''
protocol={'study':'executor-077-targeted','policy':'Fixed 0.76 invitations, selected before independent responses; no outcome-driven extra questions. Same frozen saved context in both arms; only new targeted answers vary. Missing evidence stays unknown. This is separate from full-survey current-matcher comparison.','baselineSHA256':hashlib.sha256((site/'research/evidence-076/results.json.gz').read_bytes()).hexdigest(),'consumerSHA256':hashlib.sha256((site/'prototypes/executor-077/followups.mjs').read_bytes()).hexdigest(),'contract':contract,'models':2000,'offeredModels':len(jobs),'questions':sum(len(j['questions'])for j in jobs),'startedAt':time.time()}
(site/'calibration/executor-077/targeted-protocol.json').write_text(json.dumps(protocol,indent=2));(root/'input.json').write_text(json.dumps({'protocol':protocol,'questionBank':qs,'jobs':jobs},separators=(',',':')))
batches=[jobs[i:i+25]for i in range(0,len(jobs),25)]
def run(b):
 rs=batches[b];out=root/f'answers-{b:03d}.json';raw=root/f'raw-{b:03d}.json';prompt=root/f'prompt-{b:03d}.txt'
 def valid(d):
  assert len(d['models'])==len(rs)
  for a,m in zip(d['models'],rs):assert a['id']==m['id']and set(a['answers'])==set(m['questions'])and all(type(v)==int and 0<=v<=3 for v in a['answers'].values())
  return d
 if out.exists():valid(json.loads(out.read_text()));return
 qb={bank[q['id']]:q['prompt']for q in qs};prompt.write_text(contract+'\nQUESTIONNAIRE:\n'+json.dumps(qb)+'\nFROZEN PROFILES:\n'+json.dumps(rs))
 schema={'type':'object','properties':{'responses':{'type':'object','properties':{m['id']:{'type':'object','properties':{q:{'type':'integer','minimum':0,'maximum':3}for q in m['questions']},'required':m['questions'],'additionalProperties':False}for m in rs},'required':[m['id']for m in rs],'additionalProperties':False}},'required':['responses'],'additionalProperties':False}
 for attempt in range(3):
  try:
   cmd=['/Users/muratbaykal/.grok/bin/grok','--cwd',str(root),'--verbatim','--system-prompt-override','You independently answer only the supplied questions using the frozen profile. No tools. Return JSON only.','--no-subagents','--disable-web-search','--tools','','--max-turns','1','--output-format','json','--json-schema',json.dumps(schema,separators=(',',':')),'--reasoning-effort','low','--prompt-file',str(prompt)]
   with raw.open('w')as f,(root/f'err-{b:03d}.log').open('w')as e:r=subprocess.run(cmd,stdout=f,stderr=e,timeout=1500)
   assert r.returncode==0;response=json.loads(raw.read_text());s=response['text'].strip()
   if s.startswith('```'):s=s.split('\n',1)[1].rsplit('```',1)[0]
   parsed=json.loads(s);d=valid({'models':[{'id':m['id'],'answers':parsed['responses'][m['id']]}for m in rs]});out.write_text(json.dumps(d,separators=(',',':')));(root/f'metadata-{b:03d}.json').write_text(json.dumps({'batch':b,'attempts':attempt+1,'modelUsage':response.get('modelUsage'),'promptSHA256':hashlib.sha256(prompt.read_bytes()).hexdigest(),'answerSHA256':hashlib.sha256(out.read_bytes()).hexdigest()}));print('Targeted batch',b,'complete',len(rs),'profiles',flush=True);return
  except Exception as e:print('Targeted schema/transport retry',b,attempt,repr(e),flush=True)
 raise RuntimeError('Targeted batch failed '+str(b))
with concurrent.futures.ThreadPoolExecutor(max_workers=8)as ex:list(ex.map(run,range(len(batches))))
answered={m['id']:m for b in range(len(batches))for m in json.loads((root/f'answers-{b:03d}.json').read_text())['models']};answers=[{'id':r['id'],'answers':{q['questionId']:answered[r['id']]['answers'][bank[q['questionId']]]for q in r['followups']}}for r in baseline['rows']]
encoded=json.dumps(answers,separators=(',',':')).encode();seal={'models':2000,'sha256':hashlib.sha256(encoded).hexdigest(),'selection':'All fixed invitations retained; schema/transport repair only, no outcome-based selection.','sealedAt':time.time()}
(site/'calibration/executor-077/targeted-answers.json.gz').write_bytes(gzip.compress(encoded,mtime=0));(site/'calibration/executor-077/targeted-sealed.json').write_text(json.dumps(seal,indent=2));print('SEALED targeted answers for all 2000 frozen models',flush=True)
