#!/usr/bin/env python3
"""Reproducible sourced college-career discovery inventory, O*NET31 + BLS2025.
Does not activate new occupations in guided Top/pay/cost calculations.
"""
import csv,json,hashlib
from collections import defaultdict,Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];CACHE=ROOT/'.cache/onet31'
def rows(name):
 with(CACHE/(name+'.csv')).open(encoding='utf-8-sig',newline='')as f:return list(csv.DictReader(f))
def ratings(name,scale,limit):
 out=defaultdict(list)
 for r in rows(name):
  if r['Scale ID']==scale and r.get('Recommend Suppress')!='Y' and r.get('Not Relevant')!='Y':out[r['O*NET-SOC Code']].append(dict(name=r['Element Name'],value=float(r['Data Value']),date=r.get('Date'),source=r.get('Domain Source')))
 return {c:sorted(v,key=lambda x:(-x['value'],x['name']))[:limit] for c,v in out.items()}
base=rows('occupation_data');blsSource=json.loads((ROOT/'data-sources/commonness-bls-employment-2025-parsed.json').read_text());bls={x['soc']:x for x in blsSource['records']if x['rowType']=='Line item'}
gaps={x['soc']:x for x in json.loads((ROOT/'dist/catalog-gap-index.json').read_text())}
# Public guided identity/route mapping is a small frozen input; no model data.
guided=json.loads((ROOT/'data-sources/degree-inventory/guided-index.json').read_text());guidedBySoc={x['soc']:x for x in guided}
interests=ratings('career_interest_types','OI',6);specific=ratings('specific_interest_areas','OI',8);knowledge=ratings('knowledge','IM',6);abilities=ratings('abilities','IM',7)
sk1=ratings('essential_skills','IM',7);sk2=ratings('transferable_skills','IM',7)
skills={c:sorted(sk1.get(c,[])+sk2.get(c,[]),key=lambda x:-x['value'])[:8] for c in set(sk1)|set(sk2)}
tasks=defaultdict(list);im={}
for r in rows('task_ratings'):
 if r['Scale ID']=='IM'and r.get('Recommend Suppress')!='Y':im[(r['O*NET-SOC Code'],r['Task ID'])]=float(r['Data Value'])
for r in rows('task_statements'):tasks[r['O*NET-SOC Code']].append(dict(id=r['Task ID'],text=r['Task'],type=r['Task Type'],importance=im.get((r['O*NET-SOC Code'],r['Task ID'])),date=r['Date']))
aliases=defaultdict(list)
for r in rows('sample_of_reported_titles'):aliases[r['O*NET-SOC Code']].append(r['Reported Job Title'])
zones={r['O*NET-SOC Code']:int(r['Job Zone'])for r in rows('job_zones')};families={'creative':'Design & creativity','technology':'Technology & data','health':'Health & helping','business':'Business & law','science':'Science & environment','building':'Engineering & building','education':'Teaching & learning','public-safety':'Safety & emergency response','transportation-production':'Transport & production','sales-office':'Sales & office support','services':'Food, hospitality & personal care','trades':'Trades & technical repair'}
levels={"Bachelor's degree":'college',"Master's degree":'graduate','Doctoral or professional degree':'graduate'}
records=[]
for o in base:
 c=o['O*NET-SOC Code'];g=guidedBySoc.get(c);b=bls.get(c[:7])or bls.get(gaps.get(c,{}).get('employmentSOC'));degree=b and b['education']in levels
 if not degree and not(g and g['degree']):continue
 fam=g['families']if g else [dict(id=gaps.get(c,{}).get('family','science'),title=families.get(gaps.get(c,{}).get('family'),'Science & environment'))]
 ri=interests.get(c,[]);vector=[next((x['value']for x in ri if x['name']==n),None)for n in ['Realistic','Investigative','Artistic','Social','Enterprising','Conventional']]
 # The guided route is explicit when BLS typical entry is associate/nondegree.
 education=b['education']if degree else '; '.join(x['label']for x in g['degree'])
 level=levels[b['education']]if degree else g['degree'][0]['key']
 records.append(dict(id='degree-'+c.replace('-','').replace('.',''),soc=c,title=o['Title'],summary=o['Description'],aliases=aliases[c][:10],guidedId=g['id']if g else None,families=fam,education=education,educationGroup=level,educationBasis='BLS typical entry assignment'if degree else 'Existing reviewed guided college route; other entry routes also exist',blsSoc=b['soc']if b else None,blsTitle=b['title']if b else None,educationMapping='exact detailed SOC'if b and b['soc']==c[:7]and c.endswith('.00')else 'broader BLS SOC; O*NET specialty is distinct'if b else 'existing guided route',relatedExperience=b['relatedExperience']if b else 'Not available',training=b['training']if b else 'Not available',requiresExperience=bool(b and b['relatedExperience']not in ['None','—']),jobZone=zones.get(c),vector=vector if all(isinstance(v,(int,float))for v in vector)else None,interests=ri,specificInterests=specific.get(c,[]),skills=skills.get(c,[]),abilities=abilities.get(c,[]),knowledge=knowledge.get(c,[]),tasks=sorted(tasks[c],key=lambda x:-(x['importance']or 0))[:3],url='https://www.onetonline.org/link/summary/'+c,educationURL=blsSource['sourceURL']))
assert len({x['soc']for x in records})==len(records)
meta=dict(release='O*NET31.0 / BLS2025–35',checkedAt='2026-10-19',sourceURL='https://www.onetcenter.org/database.html',blsSourceURL=blsSource['sourceURL'],licenseURL='https://creativecommons.org/licenses/by/4.0/',attribution='Includes O*NET®31.0 Database content, U.S. Department of Labor, Employment and Training Administration.',modifications='Selected occupations with BLS bachelor, master, doctoral/professional typical entry, plus reviewed guided college routes. Preserved exact O*NET descriptors and broad BLS education mappings. Limited displayed tasks, aliases and descriptors. No occupation ratings are asserted as measured student characteristics.',interestsProvenance='RIASEC profiles include Machine Learning/Expert sources; specific interests include AI/Expert sources. Individual descriptor dates and provenance are retained.',counts=dict(occupations=len(records),withVectors=sum(bool(x['vector'])for x in records),alreadyGuided=sum(bool(x['guidedId'])for x in records),newDiscovery=sum(not x['guidedId']for x in records),experienceRequired=sum(x['requiresExperience']for x in records),byEducation=dict(Counter(x['educationGroup']for x in records))),selection='Systematic complete source selection, not chosen to produce desired model matches. Job Zone alone does not establish degree requirements. BLS groups may cover several O*NET specialties. No pay, training cost, licensure eligibility or Top-fit outcome is inferred.',sourceFiles=[dict(name=p.name,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),url='https://www.onetcenter.org/dl_files/database/db_31_0_csv/'+p.name)for p in sorted(CACHE.glob('*.csv'))])
output=dict(metadata=meta,records=records)
(ROOT/'dist/degree-inventory-data.js').write_text('export const degreeInventoryMetadata='+json.dumps(meta,separators=(',',':'))+';\nexport const degreeInventory='+json.dumps(records,ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'data-sources/degree-inventory/receipt.json').write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta['counts']))
