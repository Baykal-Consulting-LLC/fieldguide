#!/usr/bin/env python3
"""Build the50 researched additions. Fails on missing source or preparation records."""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
load=lambda p:json.loads((R/p).read_text())
selection=load('validation/commonness-priority-50-2026-10-16.json')['records'];prep=load('validation/common-career-preparation-50-2026-10-16.json')['records'];wages={x['id']:x for x in load('validation/commonness-priority-50-wages-2026-10-16.json')['records']}
records=[]
for x in selection:
 p=prep[x['id']];w=wages[x['id']];assert len(p['sourceURLs'])>0 and w['entryProxy']['amount']>0
 summary={'No formal educational credential':'Learn on the job. A degree is optional.','High school diploma or equivalent':'High school or GED, then job training.','Some college, no degree':'College coursework or targeted training.'}.get(p['typicalEntry'],p['typicalEntry'])
 records.append({**x,**p,'entry':p['typicalEntry'],'summary':summary,'workSummary':p['summary'],'bullets':p['bullets3'],'sourceURL':p['sourceURLs'][0],'pay':[w['earnings']['p25'],w['earnings']['median'],w['earnings']['p75']],'earnings':{**w['earnings'],'mapping':w['wageMapping']},'entryProxy':w['entryProxy'],'wageMapping':w['wageMapping'],'limitations':[ *p.get('limitations',[]),*w.get('limitations',[])]})
(R/'dist/common-career-data.js').write_text('export const commonCareerSpecs='+json.dumps(records,ensure_ascii=False,separators=(',',':'))+';\nexport const commonRequirements=Object.fromEntries(commonCareerSpecs.map(s=>[s.id,{...s,status:"sourced",jurisdiction:"Texas"}]));\nexport const commonWages=Object.fromEntries(commonCareerSpecs.map(s=>[s.id,s.earnings]));\nexport const commonEntryWages=Object.fromEntries(commonCareerSpecs.map(s=>[s.id,{...s.entryProxy,measuredExperienceData:false}]));\n')
print('Built',len(records),'profiles with preparation and Austin pay')
