import ast,json,subprocess,time
from pathlib import Path
root=Path('/tmp/fieldguide-grok-blind-075');q=json.loads((root/'neutral-questionnaire.json').read_text());manifest=json.loads((root/'generation-contract.json').read_text());roster=manifest['roster'];contract=manifest['contract'];valid={k:{x['id']for x in q[k]}for k in ['topics','methods','responsibilities']}
# Reuse the structural validators only, without coordinator process actions.
tree=ast.parse((root/'coordinate.py').read_text());nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef)and n.name in ['parse','errors','call']];exec(compile(ast.Module(body=nodes,type_ignores=[]),'<structural-validators>','exec'))
raw=root/'batch-046-completion.raw.json'
while True:
 try:completed=parse(raw);break
 except Exception:time.sleep(3)
original=parse(root/'batch-046.raw.json');assert len(original['profiles'])==7;assert len(completed['profiles'])==13
assert [p['id']for p in completed['profiles']]==[r['id']for r in roster[927:940]]
d={'profiles':original['profiles']+completed['profiles']}
for attempt in range(4):
 es=errors(d,46)
 if not es:break
 (root/f'batch-046.schema-completion-{attempt}.json').write_text(json.dumps({'errors':es,'before':d}))
 ps=[p for p in d['profiles']if any(isinstance(e,dict)and e.get('id')==p['id']for e in es)]
 prompt=root/f'completion-repair-046-{attempt}.prompt.txt';prompt.write_text('Repair only these malformed synthetic input fields. No matching rules, careers or outcomes exist. Keep all other answers and profile features. Return {"repairs":[{"id":"...","fieldName":correctedValue}]}. A malformed official array has unreliable positions: return official as an object with every exact item ID and its 1-5 response, using 3 unsure when not supported. Do not invent interests.\nContract:'+contract+'\nQuestionnaire:'+json.dumps(q)+'\nErrors:'+json.dumps(es)+'\nProfiles:'+json.dumps(ps))
 patch=call(prompt,root/f'field-repair-046-completion-{attempt}.raw.json')['repairs'];byid={p['id']:p for p in d['profiles']}
 for x in patch:
  for k,v in x.items():
   if k=='id':continue
   if k=='official'and isinstance(v,dict):assert set(v)=={z['id']for z in q['official']};v=[v[z['id']]for z in q['official']]
   byid[x['id']][k]=v
assert not errors(d,46),errors(d,46)
(root/'batch-046.json').write_text(json.dumps(d,separators=(',',':')))
(root/'completion-046.json').write_text(json.dumps({'reason':'The first independent session supplied 7 of 20 requested profiles. A separate blind session authored the 13 missing IDs. All 20 retained after structural validation, before any career outcomes.','firstIDs':[p['id']for p in original['profiles']],'completedIDs':[p['id']for p in completed['profiles']]},indent=2))
print('Completed final group: retained 7 plus 13 independently authored profiles; no outcome feedback.',flush=True)
