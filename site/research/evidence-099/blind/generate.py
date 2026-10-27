import json,subprocess,concurrent.futures,hashlib,random,time
from pathlib import Path
root=Path('/tmp/fieldguide-grok-blind-099');q=json.loads((root/'neutral-questionnaire.json').read_text());rng=random.Random(990021)
eth=['White non-Hispanic']*44+['Hispanic any race']*29+['Black non-Hispanic']*15+['Asian non-Hispanic']*5+['Two or more races non-Hispanic']*5+['American Indian/Alaska Native non-Hispanic']+['Native Hawaiian/Pacific Islander non-Hispanic']
rng.shuffle(eth)
roster=[{'id':f'blind099-{i+1:04d}','raceEthnicity':eth[i],'age':rng.choices([14,15,16,17,18,19],[10,18,24,24,18,6])[0]}for i in range(100)]
contract='''You are independently creating fictional US student whole-person profiles for a BLIND evaluation. You have NO matching engine, career catalog, recommendation rules, preferred careers, current profiles, scoring weights or results. Do not infer or invent them. No career outcome is requested. Use no tools, files, memory, web or subagents. Return JSON only. Author each profile yourself; do not output a program, algorithm, recipe, repetitive template or placeholder. These are synthetic students, not real people.
Create the exact roster below. Race/ethnicity is one approximate public-student marginal from NCES fall 2022, NOT a constraint on any interest or strength. Ages are design assumptions, not population weights. Other characteristics must be meaningfully varied and jointly plausible, not assigned independently at random. Write distinct narratives, not the same archetype with new demographics. Do not steer toward high-paying/degree jobs or any expected career.
Represent the FULL range across all our modeled domains: interests, strengths and developing skills, knowledge/exposure, motivation and values, confidence, uncertainty, academic engagement, educational openness, preferred work setting and collaboration, sensory/physical access needs, mental health and supports, family/care responsibilities, financial resources, geography/opportunities, lifestyle aspirations and practical constraints. Include mixed interests, clear/sparse interests, low exposure, strong interest with low skill, practiced skill with low enjoyment, contradictory/tentative preferences that are honestly unknown, and interests across every activity type. Neither everyone exceptional nor everyone disadvantaged. Vary well-being from unstated/no difficulty to named concerns and realistic support/functional effect. Mental health, disability, race, sex, family language and income must not determine intellectual ability or career interests. Context affects opportunity, support and feasibility. Do not equate quietness with low people interest, low income with no college, sport with health careers, or caring for plants with laboratory research.
For each profile output EXACT keys:
id, name (fictional), age, gender (girl/boy/nonbinary/not stated), raceEthnicity (from roster), region (Northeast/Midwest/South/West), locale (urban/suburban/town/rural), household (short coherent family/resources/opportunities/caregiving description), school (type/grade/electives/access), wellbeing (current concern or unstated, functional needs and support, no diagnosis-to-interest inference), motivation (2-4 short motives), strengths (2 strengths + 1 developing area; not aptitude claims), confidence (1-5), exposure (limited/mixed/broad), education (short training/associate/bachelor/graduate/open/undecided; feasible aspirations may need aid), workContext (preferred setting, pace, people vs solo and access needs), constraints (0-3), narrative (45-75 words connecting sustained chosen activities, motivation, strengths, exposure and one uncertainty; no career recommendation), positiveTopics (1-8 IDs), negativeTopics (0-6 distinct IDs), positiveMethods (1-8 IDs), negativeMethods (0-4 IDs), responsibilities (0-3 IDs), lifestyleChoices ({home,transport,groceries,dining,travel,entertainment,recreation,clothing,saving}, each 0-3), official (60 integer responses 1-5 in supplied order), followups (object mapping all six supplied IDs to 0=unknown or 1-5 interest; 3=neutral, 4=interested,5=very interested).
Activity IDs are questionnaire ANSWERS to the supplied exact activity statements, NOT categories or inferred attributes. Select a positive only if this specific activity appeals; broad subject liking must not imply its distinctive procedures. Select negatives only for explicit disinterest; all other IDs remain unknown. Keep positives and negatives disjoint. Official 3 means Unsure; never invent confident interest to fill every item. Followup 0 is unknown; use 4/5 only for explicitly appealing activities consistent with narrative, context and other answers. One statement being positive does not force the paired statement. A student can like an unfamiliar hypothetical activity without prior skill; leave unknown if they cannot judge. Vary answers independently where meaningful, not identical theme patterns. Responses and profile must be internally consistent. Lifestyle choices: 0 low-cost/shared/basic,1 modest,2 comfortable,3 expansive; aspirations may exceed current household means but make that uncertainty explicit.
Return {"profiles":[...]} and nothing else.'''
manifest={'generator':'Grok CLI default model, independent sessions, no tools/web/subagents','blindness':'Only neutral assessment items, whole-profile instructions and demographic roster; no site repository, rules, occupations, prior cohort, scores or outcomes. Outputs not selected by matching performance.','population':'Synthetic whole-person US student coverage cases; not a statistically representative population sample. Race marginal approximates NCES public students fall 2022; all other distributions are design choices.','demographicSource':'https://ies.ed.gov/learn/press-release/public-school-fall-2022-enrollment-counts-remain-below-fall-2019','roster':roster,'contract':contract,'questionnaireSHA256':hashlib.sha256((root/'neutral-questionnaire.json').read_bytes()).hexdigest(),'createdAt':time.time()}
(root/'generation-contract.json').write_text(json.dumps(manifest,indent=2))
valid={k:{x['id']for x in q[k]}for k in ['topics','methods','responsibilities']}
def validate(d,roster):
 assert isinstance(d,dict) and len(d['profiles'])==len(roster)
 for p,r in zip(d['profiles'],roster):
  assert p['id']==r['id'] and p['age']==r['age'] and p['raceEthnicity']==r['raceEthnicity']
  for pos,neg,k in [('positiveTopics','negativeTopics','topics'),('positiveMethods','negativeMethods','methods')]:
   assert set(p[pos])<=valid[k] and set(p[neg])<=valid[k] and not set(p[pos])&set(p[neg]);assert len(p[pos])==len(set(p[pos]))
  assert set(p['responsibilities'])<=valid['responsibilities'];assert len(p['official'])==60 and all(type(v)==int and 1<=v<=5 for v in p['official'])
  assert set(p['followups'])=={f['id']for f in q['followups']} and all(type(v)==int and 0<=v<=5 for v in p['followups'].values())
  assert all(type(v)==int and 0<=v<=3 for v in p['lifestyleChoices'].values());assert len(p['narrative'].split())>=35
  for f in ['wellbeing','strengths','motivation','confidence','education','household','school','workContext','exposure','constraints']:assert f in p
 return d

def run(b):
 start=b*20;rs=roster[start:start+20];out=root/f'batch-{b:03d}.json';raw=root/f'batch-{b:03d}.raw.json';prompt=root/f'batch-{b:03d}.prompt.txt'
 if out.exists():validate(json.loads(out.read_text()),rs);return b
 prompt.write_text(contract+'\n\nQUESTIONNAIRE (no weights or occupation links):\n'+json.dumps(q)+'\nROSTER:\n'+json.dumps(rs))
 for attempt in range(3):
  if attempt:prompt.write_text(prompt.read_text()+'\nPrevious output failed schema/completeness validation. Return all 20 complete profiles, exactly 60 official responses each. Do not omit IDs or fields.')
  cmd=['/Users/muratbaykal/.grok/bin/grok','--cwd',str(root),'--verbatim','--system-prompt-override','You author independent synthetic student profiles. Follow the supplied contract. Do not use tools or external context. Output JSON only.','--no-subagents','--disable-web-search','--tools','','--max-turns','1','--output-format','json','--reasoning-effort','low','--prompt-file',str(prompt)]
  with raw.open('w')as f,(root/f'batch-{b:03d}.stderr.log').open('w')as e:proc=subprocess.run(cmd,stdout=f,stderr=e,timeout=1200)
  try:
   assert proc.returncode==0
   response=json.loads(raw.read_text());s=response['text'].strip()
   if s.startswith('```'):s=s.split('\n',1)[1].rsplit('```',1)[0]
   d=validate(json.loads(s),rs);out.write_text(json.dumps(d,separators=(',',':')));print('Generated blind batch',b,'profiles',len(d['profiles']),flush=True);return b
  except Exception as err:print('Schema retry',b,attempt,type(err).__name__,flush=True)
 raise RuntimeError('Could not generate batch '+str(b))
with concurrent.futures.ThreadPoolExecutor(max_workers=2)as ex:list(ex.map(run,range(5)))
profiles=[p for b in range(5)for p in json.loads((root/f'batch-{b:03d}.json').read_text())['profiles']]
assert len(profiles)==100 and len({p['id']for p in profiles})==100
(root/'profiles.json').write_text(json.dumps(profiles,separators=(',',':')))
(root/'sealed.json').write_text(json.dumps({'count':1000,'sha256':hashlib.sha256((root/'profiles.json').read_bytes()).hexdigest(),'sealedAt':time.time(),'selection':'All schema-valid generated profiles retained; no matching outcomes inspected for acceptance.'},indent=2))
print('SEALED 100 independent Grok-authored profiles. No outcomes inspected.',flush=True)
