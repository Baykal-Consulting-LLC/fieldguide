import json,subprocess
from pathlib import Path
root=Path('/tmp/fieldguide-grok-blind-099');p=json.loads((root/'profiles.json').read_text());(root/'profiles-original.json').write_text(json.dumps(p))
rows=[{'id':r['id'],'education':r['education']} for r in p];prompt=root/'education.prompt.txt';prompt.write_text('Fix only this schema field for independently authored fictional profiles, before any matching outcomes. Preserve the meaning of each education description. Return JSON {"rows":[{"id":...,"education":...}]} for all 100 IDs in order. education must be EXACTLY one of short training, associate, bachelor, graduate, open, undecided. Choose the explicitly preferred current route; choose open for explicit openness among routes, undecided for explicit uncertainty. No career, income, interest or match inference. The full original description will be preserved separately. DATA:\n'+json.dumps(rows))
cmd=['/Users/muratbaykal/.grok/bin/grok','--cwd',str(root),'--verbatim','--system-prompt-override','Correct only the requested schema field. No tools, web, subagents or external context. Return JSON only.','--no-subagents','--disable-web-search','--tools','','--max-turns','1','--output-format','json','--reasoning-effort','low','--prompt-file',str(prompt)]
with (root/'education.raw.json').open('w') as out,(root/'education.stderr.log').open('w') as err:subprocess.run(cmd,stdout=out,stderr=err,check=True,timeout=600)
s=json.loads((root/'education.raw.json').read_text())['text'].strip()
if s.startswith('```'):s=s.split('\n',1)[1].rsplit('```',1)[0]
d=json.loads(s);assert len(d['rows'])==100
for r,c in zip(p,d['rows']):
 assert r['id']==c['id'] and c['education'] in ['short training','associate','bachelor','graduate','open','undecided']
 r['educationContext']=r['education'];r['education']=c['education']
(root/'education-normalization.json').write_text(json.dumps(d));(root/'profiles.json').write_text(json.dumps(p));print('Normalized education enum only; all original context and interest answers retained.',flush=True)
