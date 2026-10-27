#!/usr/bin/env python3
"""Build selected, attributed O*NET31 descriptors; source CSVs cached separately."""
import csv,json,hashlib
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; CACHE=ROOT/'.cache/onet31'
selected=json.loads((ROOT/'data-sources/occupation-reviewed-index.json').read_text())+json.loads((ROOT/'validation/commonness-priority-50-2026-10-16.json').read_text())['records']
selected=list({r['id']:r for r in selected}.values()); codes={r['soc'] for r in selected}
def rows(name):
 with (CACHE/(name+'.csv')).open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))
def ratings(name,scale,limit=3):
 out=defaultdict(list)
 for r in rows(name):
  if r['O*NET-SOC Code'] in codes and r['Scale ID']==scale and r.get('Recommend Suppress')!='Y' and r.get('Not Relevant')!='Y':
   out[r['O*NET-SOC Code']].append({'name':r['Element Name'],'value':float(r['Data Value']),'date':r.get('Date'),'source':r.get('Domain Source')})
 return {c:sorted(v,key=lambda r:-r['value'])[:limit] for c,v in out.items()}
skills1=ratings('essential_skills','IM',4);skills2=ratings('transferable_skills','IM',4)
skills={c:sorted(skills1.get(c,[])+skills2.get(c,[]),key=lambda r:-r['value'])[:4] for c in codes}
knowledge=ratings('knowledge','IM');abilities=ratings('abilities','IM');styles=ratings('work_styles','WI');interests=ratings('career_interest_types','OI',6);specific=ratings('specific_interest_areas','OI',3)
aliases=defaultdict(list)
for r in rows('sample_of_reported_titles'):
 if r['O*NET-SOC Code'] in codes:aliases[r['O*NET-SOC Code']].append(r['Reported Job Title'])
base={r['O*NET-SOC Code']:r for r in rows('occupation_data')}
zones={r['O*NET-SOC Code']:int(r['Job Zone']) for r in rows('job_zones')}
tasks=defaultdict(list)
for r in rows('task_statements'):
 if r['O*NET-SOC Code'] in codes:tasks[r['O*NET-SOC Code']].append({'id':r['Task ID'],'text':r['Task'],'core':r['Task Type']=='Core','date':r['Date']})
importance={}
for r in rows('task_ratings'):
 if r['O*NET-SOC Code'] in codes and r['Scale ID']=='IM' and r.get('Recommend Suppress')!='Y':importance[(r['O*NET-SOC Code'],r['Task ID'])]=float(r['Data Value'])
output={}
for c in sorted(codes):
 if c not in base:continue
 output[c]={'title':base[c]['Title'],'summary':base[c]['Description'],'aliases':aliases[c][:10],'jobZone':zones.get(c),'tasks':sorted(tasks[c],key=lambda t:(-importance.get((c,t['id']),0),not t['core']))[:3],'skills':skills.get(c,[]),'knowledge':knowledge.get(c,[]),'abilities':abilities.get(c,[]),'workStyles':styles.get(c,[]),'interests':interests.get(c,[]),'specificInterests':specific.get(c,[])}
metadata={'release':'O*NET31.0','checkedAt':'2026-10-16','sourceURL':'https://www.onetcenter.org/database.html','licenseURL':'https://creativecommons.org/licenses/by/4.0/','attribution':'Includes O*NET®31.0 Database content, U.S. Department of Labor, Employment and Training Administration.','modifications':'Selected unsuppressed high-importance descriptors and three task statements; original Fieldguide prompts are separate. Work styles and interests include AI/expert or machine-learning/expert source fields from O*NET; they are occupation descriptors, not measured traits of a student.','sourceFiles':[{ 'url':'https://www.onetcenter.org/dl_files/database/db_31_0_csv/'+p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(CACHE.glob('*.csv'))]}
(ROOT/'dist/occupation-essentials.js').write_text('export const essentialMetadata='+json.dumps(metadata,separators=(',',':'))+';\nexport const occupationEssentials='+json.dumps(output,ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'data-sources/occupation-essentials-receipt.json').write_text(json.dumps({'metadata':metadata,'profiles':len(output),'careerIds':[x['id'] for x in selected]},indent=2)+'\n')
print('Generated',len(output),'exact occupation essentials for',len(selected),'guided profiles')
