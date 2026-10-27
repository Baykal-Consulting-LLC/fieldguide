import json,pathlib,datetime
p=pathlib.Path(__file__).parent;d=json.loads((p/'onet-2025-wage-evidence.json').read_text());twc=json.loads((p/'twc-2025-msa-entrywg-source.json').read_text());tm={r['soc']:r for r in twc['rows']}
base='https://www.bls.gov/ooh/'
postdoc={
 '19-1042':('life-physical-and-social-science/medical-scientists.htm','Medical scientist Ph.D. entrants may begin in postdoctoral research; medical-degree entrants often complete residency. Those stages need separate pay.'),
 '19-1021':('life-physical-and-social-science/biochemists-and-biophysicists.htm','Most Ph.D. holders begin in temporary postdoctoral research. Bachelor/master-level entry positions exist but are a different route.'),
 '19-2012':('life-physical-and-social-science/physicists-and-astronomers.htm','Research-oriented Ph.D. holders may begin in postdoctoral positions typically lasting 2–3 years.'),
 '25-1054':('education-training-and-library/postsecondary-teachers.htm','Physics faculty may first have postdoctoral research jobs, typically 2–3 years. Part-time appointments are common.'),
 '25-1051':('education-training-and-library/postsecondary-teachers.htm','Faculty appointments and annual contracts vary; part-time work is common. Earlier paid preparation/academic first appointment remains unverified.'),
 '25-1022':('education-training-and-library/postsecondary-teachers.htm','Faculty appointments and annual contracts vary; part-time work is common. Earlier paid preparation/academic first appointment remains unverified.')}
experience={
 '27-2041':('entertainment-and-sports/music-directors-and-composers.htm','Most music director/composer positions require related work experience. Earlier paid musician stage is not covered by the occupation wage.'),
 '27-3041':('media-and-communication/editors.htm','BLS says previous writing/proofreading experience is typically required; many begin as editorial assistants, writers or reporters.')}
broadReview={'15-1255','15-1299','15-1243','19-1029'}
for r in d['rows']:
 soc=r['onetCode'][:7];broad=next((v.removeprefix('Wage data for ').removesuffix('.') for v in r['sourceNotes'] if v.startswith('Wage data for ')),None)
 r['wageSoc']=soc;r['wageOccupationTitle']=broad or r['title'];r['wageMapping']='broader_occupation' if broad else 'exact_SOC_occupation';r['sourceNotes']=sorted(set(r['sourceNotes']))
 selected=next((r[k] for k in ['austin','texas','national'] if r.get(k) and r[k].get('p10')),None)
 r['planningProxy']={'method':'OEWS_10th_percentile_of_employed_workforce','amount':selected['p10'],'p25Sensitivity':selected['p25'],'medianContext':selected['median'],'geography':selected['location'],'geographyFallback':selected['location']!='Austin-Round Rock-San Marcos, TX','sourceUrl':r['sourceUrl'],'referencePeriod':'May 2025','units':'gross annual wage and salary earnings','verifiedStartingSalary':False,'qualificationStage':'Qualified-role employee wage distribution; first paid preparation not established'}
 t=tm.get(soc,{});tk='austin' if t.get('austin',0)>0 else 'statewide' if t.get('statewide',0)>0 else None
 r['twcEntryProxy']={'amount':t[tk] if tk else None,'geography':{'austin':'Austin-Round Rock-San Marcos, TX','statewide':'Texas'}.get(tk),'definition':'Mean wage of lowest-paid third of the selected occupational workforce; not measured first-job earnings','referencePeriod':'2025 annual wages','sourceUrl':f'https://texaswages.com/MSAWages/MSASocDetails?soc={soc}&wgeType=entrywg','dataUrl':twc['sourceUrl'],'methodologyUrl':'https://texaswages.com/Home/About','verifiedStartingSalary':False}
 r['limitations']=['Occupational percentiles mix experience levels and do not establish a starting salary.','Self-employed workers, unincorporated owners/partners and unpaid family workers are excluded.','Annual wages may reflect annualization of wage rates and do not guarantee full-year employment.','Preparation cost, grants, debt service, admission, licensing and specific initial paid stage need separate verification.']
 r['qualificationReview']=None
 if soc in postdoc:
  u,n=postdoc[soc];r['qualificationReview']={'code':'earlier_paid_preparation_unverified','note':n,'sourceUrl':base+u}
 if soc in experience:
  u,n=experience[soc];r['qualificationReview']={'code':'related_experience_typically_required','note':n,'sourceUrl':base+u}
 if broad:
  r['limitations'].append('O*NET reports this specialty under '+broad+'; the wage is not specialty-specific.')
 if soc=='15-1243':r['limitations'].append('Database architect workforce includes experienced database administrators; specialty entry path needs separate verification before claiming first-stage coverage.')
 if soc.startswith('27-'):r['limitations'].append('Arts/media self-employed and project-based routes may have different earnings and irregular hours; employee wage data do not establish those earnings.')
 # Owner can display every proxy transparently. Do not silently convert blocked cases to earliest-stage sustains=true.
 r['qualifiedRoleProxyCoverageCandidate']=not r['qualificationReview'] and soc not in broadReview
 r['firstPaidStageCoverageCandidate']=False
 d['researchPolicy']={'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'wageSource':'U.S. Bureau of Labor Statistics May 2025 OEWS, exposed by official O*NET OnLine','releaseDate':'2026-05-15','tablesUrl':'https://www.bls.gov/oes/tables.htm','methodologyUrl':'https://www.bls.gov/oes/2025/may/oes_tec.htm','percentileGuidanceUrl':'https://www.bls.gov/oes/earnings.htm','recommendation':'Expose qualified-role p10 planning proxy and p25 sensitivity separately from verified first paid stage; do not treat broader-SOC specialties, experience-required roles or unverified earlier paid preparation as first-stage coverage. Keep unknown preparation costs explicit.'}
(p/'pay-evidence.json').write_text(json.dumps(d,indent=2)+'\n')
# Keep only the 30 relevant wage rows in new provenance snapshot; full same API payload already exists in data-sources.
twc['fullSourceRowCount']=twc.get('fullSourceRowCount',len(twc['rows']));twc['rows']=[r for r in twc['rows'] if r['soc'] in {x['wageSoc'] for x in d['rows']}];(p/'twc-2025-msa-entrywg-source.json').write_text(json.dumps(twc,indent=2)+'\n')
print('Rows',len(d['rows']),'proxy candidates',sum(x['qualifiedRoleProxyCoverageCandidate'] for x in d['rows']))
