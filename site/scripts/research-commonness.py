#!/usr/bin/env python3
"""Audit every frozen directory-only title against official employment evidence.
Rerun from saved primary-source snapshots; no application edits or network needed.
O*NET specialty counts are never summed; employment belongs to deduplicated BLS codes.
"""
import json,re,hashlib,collections,math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];CHECKED='2026-10-16'
NATIONAL_URL='https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm'
LOCAL_URL='https://texaswages.com/api/Proj/14'
AUSTIN_METRO_URL='https://www.bls.gov/regions/southwest/news-release/OccupationalEmploymentandWages_Austin.htm'
AUSTIN_METRO_2025={'15-1211':6930,'15-1212':2390,'15-1221':300,'15-1231':1520,'15-1232':9680,'15-1241':1700,'15-1242':1110,'15-1243':1110,'15-1244':5030,'15-1252':31960,'15-1253':3340,'15-1254':800,'15-1255':1080,'15-1299':10100,'15-2011':150,'15-2031':1600,'15-2041':150,'15-2051':3730,'15-2099':30}
CROSSWALK={'13-1021':'13-1020','13-1022':'13-1020','13-1023':'13-1020','13-2022':'13-2020','13-2023':'13-2020','21-1011':'21-1018','21-1014':'21-1018','25-2055':'25-2052','25-2056':'25-2052','25-9042':'25-9045','25-9043':'25-9045','29-2011':'29-2010','29-2012':'29-2010','31-1121':'31-1120','31-1122':'31-1120','39-7011':'39-7010','39-7012':'39-7010','47-4091':'47-4090','47-4099':'47-4090','51-2022':'51-2028','51-2023':'51-2028','51-2092':'51-2090','53-1042':'53-1047','53-1043':'53-1047','53-1044':'53-1047'}
FAMILIES={'creative':'Design & creativity','technology':'Technology & data','health':'Health & helping','business':'Business, finance & law','science':'Science, nature & farming','building':'Engineering & building','trades':'Trades & technical repair','services':'Food, hospitality & personal care','education':'Teaching & learning','public-safety':'Safety & emergency response','transportation-production':'Transport, logistics & production','sales-office':'Sales, office & customer support'}
def number(v):
 try:return float(str(v).replace(',',''))
 except:return None
def national_rows():
 raw=json.loads((ROOT/'data-sources/commonness-bls-employment-2025-web.json').read_text());lines={};conflicts=[]
 for chunk in raw['chunks']:
  for m in re.finditer(r'L(\d+):\s*(.*?)(?=L\d+:|$)',chunk['raw'],re.S):
   n=int(m[1]);value=m[2].strip()
   # Reference citation indices can differ between retrievals; compare only table cells.
   value=re.sub(r'\ue200.*?\ue201','',value)
   if n in lines and lines[n]!=value and'  | 'in value:
    if lines[n].split('  | ')[:15]!=value.split('  | ')[:15]:conflicts.append(n)
   lines[n]=value
 rows={}
 for n,line in lines.items():
  f=[v.strip()for v in line.split('  | ')]
  if len(f)>=16 and re.fullmatch(r'\d\d-\d{4}',f[1]):
   rows[f[1]]={'soc':f[1],'title':f[0],'rowType':f[2],'employment2025':round(number(f[3])*1000)if number(f[3])is not None else None,'employmentSourceThousands':number(f[3]),'selfEmployedPercent':number(f[9]),'annualOpenings2025to2035':round(number(f[10])*1000)if number(f[10])is not None else None,'education':f[12],'relatedExperience':f[13],'training':f[14],'sourceLine':n}
 assert len(rows)==1112 and sum(r['rowType']=='Line item'for r in rows.values())==831
 assert not conflicts,conflicts
 assert not set(range(166,1279))-set(lines),'Source line coverage incomplete'
 return rows,{'assembledSourceLines':len(lines),'overlapConflicts':len(conflicts),'matrixRows':len(rows),'lineItemOccupations':831}
def classify(soc,title):
 s=soc[:2];t=title.lower()
 family={'11':'business','13':'business','15':'technology','17':'building','19':'science','21':'health','23':'business','25':'education','27':'creative','29':'health','31':'health','33':'public-safety','35':'services','37':'services','39':'services','41':'sales-office','43':'sales-office','45':'science','47':'trades','49':'trades','51':'transportation-production','53':'transportation-production'}[s]
 if s=='11':
  if any(w in t for w in ['food service','lodging','gambling','funeral','spa','entertainment','recreation']):family='services'
  elif any(w in t for w in ['education','childcare']):family='education'
  elif any(w in t for w in ['medical','health','social and community']):family='health'
  elif any(w in t for w in ['transportation','supply chain','industrial production','postmaster']):family='transportation-production'
  elif any(w in t for w in ['farm','ranch','natural science','water resource','sustainability','wind energy','geothermal','biofuel','biomass','hydroelectric','brownfield']):family='science'
  elif any(w in t for w in ['construction','architectural','engineering']):family='building'
  elif'emergency management'in t or'security manager'in t:family='public-safety'
 if s=='13'and any(w in t for w in ['logistic','supply chain']):family='transportation-production'
 if s=='19'and'psycholog'in t:family='education'if'school'in t else'health'
 if s=='21'and any(w in t for w in ['educational','career counselor','guidance']):family='education'
 if s=='29'and any(w in t for w in ['emergency medical','paramedic']):family='public-safety'
 if s=='31'and'massage'in t:family='services'
 if s=='37'and any(w in t for w in ['landscap','groundskeep','tree trim','pesticide']):family='science'
 if s=='39'and'childcare'in t:family='education'
 path={'creative':'visual-arts','technology':'technology','health':'social-support','business':'business','science':'environment','building':'engineering','trades':'skilled-trades','services':'practical-care','education':'learning','public-safety':'public-safety','transportation-production':'production-work'if s=='51'else'transport-logistics','sales-office':'sales-customer'if s=='41'else'office-support'}[family]
 if family=='creative':
  path='design'if'design'in t else'media-communication'if any(w in t for w in ['writer','editor','journalis','reporter','camera','film','sound','broadcast','public relations','interpret','translat','announc'])else'culture'if any(w in t for w in ['music','actor','danc','choreograph','athlet','coach','scout','umpire'])else'information-history'if any(w in t for w in ['curator','archiv','museum'])else'visual-arts'
 if family=='science':path='agriculture-outdoors'if s=='45'or any(w in t for w in ['farm','ranch','agricultur','groundskeep','landscap','nurser','greenhouse','tree trim'])else'living-systems'if any(w in t for w in ['biolog','animal','microbio','ecolog','zoolog','medical scientist'])else'matter-earth'if any(w in t for w in ['chemis','physic','astronom','geolog','geograph','hydrolog','material'])else'environment'
 if family=='health':path='nursing'if any(w in t for w in ['nurs','home health','personal care aide'])else'rehabilitation'if any(w in t for w in ['therap','audiolog','prosthet','orthot','exercise'])else'medicines-nutrition'if any(w in t for w in ['pharma','dietiti','nutrition'])else'clinical-technology'if any(w in t for w in ['technician','technologist','medical assist','dental assist','sonograph'])else'health'if s=='29'else'social-support'
 if family=='business':path='law-policy'if s=='23'or any(w in t for w in ['legislat','compliance','regulatory'])else'accounting-finance'if any(w in t for w in ['account','financ','tax','credit','loan','budget','audit','insurance underwriter','actuar'])else'people-operations'if any(w in t for w in ['human resource','training','development','labor relation','compensation','benefit'])else'business'
 if family=='building'and any(w in t for w in ['architect','survey','cartograph','civil','construction']):path='architecture-cities'
 if family=='services':path='hospitality-food'if s=='35'or any(w in t for w in ['food','lodging','hotel','cook','baker','travel guide','tour guide'])else'facilities-outdoor'if s=='37'else'practical-care'
 # Manual field sanity overrides where a SOC major group alone gives misleading navigation.
 if soc[:7] in ['25-4011','25-4012','25-4013','19-3093']:family,path='creative','information-history'
 if soc[:7]=='19-3094':family,path='business','law-policy'
 if soc[:7]=='19-4092' or 'coroner' in t or soc[:7]=='43-5031':family,path='public-safety','public-safety'
 if soc[:7]=='43-5032':family,path='transportation-production','transport-logistics'
 return family,path
PATH_NAMES={'design':'Product & interface design','visual-arts':'Visual arts & making','media-communication':'Media, language & communication','culture':'Performance, culture & sport','information-history':'History, archives & collections','technology':'Computing & digital systems','social-support':'Counseling & community support','nursing':'Nursing & everyday care','rehabilitation':'Therapy & rehabilitation','medicines-nutrition':'Medicines & nutrition','clinical-technology':'Clinical technology & support','health':'Clinical practice & health','business':'Business & management','law-policy':'Law, policy & compliance','accounting-finance':'Money, accounting & finance','people-operations':'People & workplace support','environment':'Environment & natural resources','living-systems':'Living systems & research','matter-earth':'Chemistry, materials & earth science','agriculture-outdoors':'Farming, plants & outdoor work','engineering':'Engineering & technical design','architecture-cities':'Buildings, places & infrastructure','skilled-trades':'Construction, installation & repair','hospitality-food':'Food, kitchens & hospitality','facilities-outdoor':'Facilities, cleaning & grounds','practical-care':'Personal care & practical services','learning':'Teaching, learning & student support','public-safety':'Public safety & emergency response','production-work':'Manufacturing & production','transport-logistics':'Transport, warehousing & logistics','sales-customer':'Sales & customer relationships','office-support':'Office, administration & service'}
def main():
 source=ROOT/'validation/career-catalog-gap-audit-2026-10-16.json';old=json.loads(source.read_text());missing=old['directoryOnlyOccupations'];assert len(missing)==857
 employment,parseAudit=national_rows();local={r['soc']:r for r in json.loads((ROOT/'data-sources/commonness-twc-capital-area-projections-2024.json').read_text())};selectedDoc=json.loads((ROOT/'validation/commonness-priority-50-2026-10-16.json').read_text());selected={r['soc']:r for r in selectedDoc['records']};results=[]
 uniqueRank={r['soc']:i+1 for i,r in enumerate(sorted([e for e in employment.values()if e['rowType']=='Line item'],key=lambda e:e['employment2025']or-1,reverse=True))}
 for d in missing:
  soc=d['soc'];bs=CROSSWALK.get(soc[:7],soc[:7]);e=employment.get(bs);l=local.get(bs);family,path=classify(soc,d['title']);specialty=soc[-2:]!='00';shared=sum(CROSSWALK.get(x['soc'][:7],x['soc'][:7])==bs for x in missing)>1
  mapping='combined_BLS_occupation'if bs!=soc[:7]else'parent_SOC_for_ONET_specialty'if specialty else'exact_SOC'
  n=e['employment2025']if e else None
  decision='priority_addition'if soc in selected else'group_specialty'if specialty or(n is not None and n<100000)else'group_additional_occupation'
  why=f"Selected to close a broad-field/preparation gap; its {'combined occupation'if mapping!='exact_SOC'else'occupation'} has {n:,} national jobs in2025."if soc in selected else f"Keep under {PATH_NAMES[path]}; O*NET specialty shares its parent employment estimate and must not receive an independent headcount."if specialty else f"Keep under {PATH_NAMES[path]}; {'a smaller specialist occupation'if n is not None and n<100000 else'an additional established occupation'}, deferred by the50-profile expansion limit rather than ruled out for the student."
  national={'sourceSOC':bs,'sourceTitle':e['title']if e else None,'employment':n,'year':2025,'geography':'United States','sourceURL':NATIONAL_URL,'scope':'National Employment Matrix employment includes wage/salary and self-employment; published in thousands rounded to one decimal. Not vacancies or annual openings.','mapping':mapping,'specificONETRoleCount':mapping=='exact_SOC','sharedAcrossDirectoryTitles':shared,'sourcePrecisionJobs':100,'frequencyRankAmong831OccupationGroups':uniqueRank.get(bs),'missingReason':None if e else'No separately identifiable count in the reviewed National Employment Matrix table; no substitute count inferred.'}
  localRecord={'sourceSOC':bs,'sourceTitle':l['socTitle']if l else None,'employment':l['txemp']if l else None,'year':2024,'geography':'Capital Area workforce development area14 (Austin/Travis County), not the five-county Austin MSA','sourceURL':LOCAL_URL,'scope':'Published2024 base employment used in TWC2024–2034 projections. Base employment, not projected2034 jobs, vacancies, or job-posting counts.','mapping':mapping,'specificONETRoleCount':mapping=='exact_SOC','missingReason':None if l else'No unsuppressed role row in this regional projection table. Does not imply zero employment.'}
  results.append({**d,'employmentSOC':bs,'employment':{'national':national,'austinArea':localRecord},'decision':decision,'selectedId':selected[soc]['id']if soc in selected else None,'primaryFamily':family,'familyName':FAMILIES[family],'path':path,'fieldName':PATH_NAMES[path],'why':why,'reviewMethod':'Every title assigned by SOC and title rules, then manual field-level sanity review. Grouping is editorial navigation, not an official O*NET hierarchy.','nationalEmploymentFrequencyTier':'large (1million+)'if n is not None and n>=1000000 else'common (100K–999K)'if n is not None and n>=100000 else'specialized (<100K)'if n is not None else'count not separately reported'})
 for r in results:
  bs=r['employmentSOC']
  if bs in AUSTIN_METRO_2025:r['employment']['austinMetro2025']={'sourceSOC':bs,'employment':AUSTIN_METRO_2025[bs],'referencePeriod':'May 2025','geography':'Austin–Round Rock–San Marcos metropolitan area (Bastrop,Caldwell,Hays,Travis,Williamson counties)','sourceURL':AUSTIN_METRO_URL,'scope':'OEWS nonfarm wage/salary employee jobs; excludes self-employed workers. Metro scope differs from Travis-area2024 projection base.','mapping':r['employment']['national']['mapping']}
  if r['soc']=='11-1031.00':
   r['employment']['national']['broadContext']={'sourceSOC':'11-1000','sourceTitle':'Top executives','employment':3904100,'year':2025,'sourceURL':'https://www.onetonline.org/link/summary/11-1031.00','scope':'Official O*NET legislators profile reports Top Executives data. Broader context only; not a legislators headcount; excluded from individual commonness ranking and deduplicated line-item totals.','rawSHA256':hashlib.sha256((ROOT/'data-sources/commonness-legislator-broad-context.html').read_bytes()).hexdigest()}
   r['why']='Keep under Law, policy & compliance. This is elected office; the official profile reports broad Top Executive employment, not a separate legislator count. It is not a conventional salaried entry occupation.'
 assert len({r['soc']for r in results})==857;assert sum(r['decision']=='priority_addition'for r in results)==50
 groups=[]
 for fid,name in FAMILIES.items():
  rr=[r for r in results if r['primaryFamily']==fid];groups.append({'id':fid,'name':name,'directoryTitles':len(rr),'selectedAdditions':sum(r['decision']=='priority_addition'for r in rr),'fields':[{'path':p,'name':PATH_NAMES[p],'directoryTitles':sum(r['path']==p for r in rr)}for p in sorted({r['path']for r in rr})]})
 refs={r['employmentSOC']for r in results if r['employment']['national']['employment']is not None};uniqueEmployment=sum(employment[s]['employment2025']for s in refs)
 summaries={'directoryTitlesReviewed':857,'selectedAdditions':50,'remainingGrouped':807,'exactSOCMappings':sum(r['employment']['national']['mapping']=='exact_SOC'for r in results),'nationalCountReferencesAvailable':sum(r['employment']['national']['employment']is not None for r in results),'austinAreaBaseCountReferencesAvailable':sum(r['employment']['austinArea']['employment']is not None for r in results),'distinctNationalEmploymentGroups':len(refs),'distinctNationalEmploymentGroupsTotalJobs':uniqueEmployment,'sumPerONETTitleEmploymentForbidden':True,'missingNationalCountTitles':[r['title']for r in results if r['employment']['national']['employment']is None]}
 criteria=['Rank commonness using current BLS2025 national occupation headcounts, cross-check actual TWC2024 Austin/Travis-area base employment; do not substitute growth rates, wages, prestige, recognition, or search popularity for frequency.','The50 are an editorial coverage set, not the mathematical50largest occupations. Prioritize wholly missing broad groups, common roles, different education/training routes, and clear roles with defensible salary inputs.','Include common hourly/transition jobs and realistic advancement routes. Managerial destinations remain explicitly separated from school-leaver entry roles.','Avoid spending multiple slots on O*NET specialties that share one BLS occupational count. BLS counts refer to occupation groups, not each O*NET subcode.','Existing health/science/engineering and arts coverage is already substantial; omitted niche specializations in those fields stay grouped while office,retail,hospitality,warehousing,safety,production,and personal-care gaps are filled.','Defer actors and musicians from salary-driven expansion until hourly/irregular-work modeling is implemented; retain them under creative fields with official links.','Grouping807remaining titles is navigation, not evidence that they are unsuitable or all rare. Common nonselected jobs remain visible under their fields.']
 out={'checkedAt':CHECKED,'baseline':'67reviewed profiles,923official O*NET31directory titles,857directory-only titles frozen before this expansion. Tattoo is an editorial role outside the923O*NET31directory.','selectionCriteria':criteria,'employmentSources':{'national':{'sourceURL':NATIONAL_URL,'referenceYear':2025,'releaseDate':'2026-08-27','scope':'BLS National Employment Matrix including self-employed workers','rawArchive':'data-sources/commonness-bls-employment-2025-web.json'},'austinArea':{'sourceURL':LOCAL_URL,'referenceYear':2024,'pageURL':'https://texaswages.com/Projections','scope':'Capital Area workforce development area14 (Austin/Travis County); not Austin MSA','rawArchive':'data-sources/commonness-twc-capital-area-projections-2024.json','regionScopeSource':'https://tctransparency.traviscountytx.gov/EDSI_EconomicRecovery/AllResources'}},'sourceParsingAudit':parseAudit,'summary':summaries,'families':groups,'crosswalk':CROSSWALK,'records':results,'additionalAustinMetroEvidence':{'sourceURL':AUSTIN_METRO_URL,'referencePeriod':'May 2025','scope':'Official five-county Austin MSA; wage/salary employees, excludes self-employed. Full role-specific count table published for computing/math in this release.','groupSharesPercent':{'Office and administrative support':12.3,'Management':10.4,'Food preparation and serving':9.3},'selectedRoleCounts':{'computer-support':9680,'web-developer':800,'web-interface-design':1080}},'manualSanityAudit':{'checked':True,'scope':'All12family buckets and all23SOCmajor groups; title-rule overrides for industry managers,school psychologists,counselors,EMTs,personal care,and outdoor work; selected50all manually reviewed.','conclusions':['All857unique titles received an explicit decision and named field.','Every selected role exists in the official directory and is not among67existing reviewed profiles.','All50selected occupation employment groups are distinct.','Unselected specialties remain nested rather than disappearing.','A nested specialty count never becomes an additional worker count.']}}
 (ROOT/'validation/commonness-directory-audit-2026-10-16.json').write_text(json.dumps(out,indent=2)+'\n')
 for r in selectedDoc['records']:
  full=next(x for x in results if x['soc']==r['soc']);r['employment']=full['employment'];r['primaryFamily']=full['primaryFamily'];r['path']=full['path'];r['fieldName']=full['fieldName'];r['selectionWhy']=full['why']
 selectedDoc['selectionCriteria']=criteria;selectedDoc['status']='selection final; source-backed employment reviewed';(ROOT/'validation/commonness-priority-50-2026-10-16.json').write_text(json.dumps(selectedDoc,indent=2)+'\n')
 (ROOT/'data-sources/commonness-bls-employment-2025-parsed.json').write_text(json.dumps({'sourceURL':NATIONAL_URL,'referenceYear':2025,'checkedAt':CHECKED,'parseAudit':parseAudit,'records':list(employment.values())},indent=2)+'\n')
 print(json.dumps(summaries,indent=2));print(json.dumps(groups,indent=2))
if __name__=='__main__':main()
