#!/usr/bin/env python3
"""Re-read official wage evidence for the frozen 50-role commonness selection. No app edits."""
import json,re,hashlib,urllib.request,concurrent.futures
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
SELECTION=ROOT/'validation/commonness-priority-50-2026-10-16.json'
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,s):self.parts.append(s)
def get(url):
 raw=urllib.request.urlopen(url,timeout=35).read();p=Text();p.feed(raw.decode());return re.sub(r'\s+',' ',' '.join(p.parts)),hashlib.sha256(raw).hexdigest()
def metro(text,geo):
 pattern=re.escape(geo)+r'\s+\$([\d,.]+)\s+\$([\d,.]+)\s+\$([\d,.]+)\s+\$([\d,.]+)\s+\$([\d,.]+)'
 return [[float(s.replace(',',''))for s in m]for m in re.findall(pattern,text)]
def main():
 selected=json.loads(SELECTION.read_text())['records'];twc={k:{r['soc']:r for r in json.loads((ROOT/f'data-sources/twc-2025-msa-{k}.json').read_text())}for k in ['entrywg','median','experience','mean']};snapshots=[]
 def audit(row):
  soc=row['soc'];bs={'31-1122':'31-1120','21-1014':'21-1018'}.get(soc[:7],soc[:7]);urls=[f'https://www.onetonline.org/link/localwages/{soc}?st=TX',f'https://www.onetonline.org/link/localwages/{soc}?zip=75201'];sources=[]
  try:
   text,sha=get(urls[0]);url=urls[0];sources.append({'url':url,'sha256':sha});metros=[('austin','Austin-Round Rock-San Marcos, TX'),('dallas','Dallas-Fort Worth-Arlington, TX'),('houston','Houston-Pasadena-The Woodlands, TX')]
   if not metro(text,metros[0][1]):
    tz,sz=get(urls[1]);sources.append({'url':urls[1],'sha256':sz})
    if metro(tz,metros[0][1]):text=tz;url=urls[1];sha=sz
   found=next(((key,geo,metro(text,geo))for key,geo in metros if metro(text,geo)),None)
   if not found:return{'id':row['id'],'soc':soc,'status':'missing_exact_occupation_metro','sources':sources}
   key,geo,values=found;annual=next((v for v in values if v[2]>=1000),None);hourly=next((v for v in values if v[2]<1000),None);v=annual or hourly
   snapshots.append({'id':row['id'],'url':url,'rawHTMLSHA256':sha,'referencePeriod':'May 2025','checkedAt':'2026-10-16','visibleText':text})
   limitations=['Employee wage estimates exclude self-employed workers, unincorporated owners, and business profit.','TWC entry proxy is the mean of the lowest-paid third, not observed pay at a particular year. Experience scenarios are separate editorial assumptions.']
   if bs!=soc[:7]:limitations.append('BLS combined wage category; does not isolate this O*NET role.')
   if row['id']in['restaurant-server','hairdresser','real-estate-agent','insurance-sales-agent','photographer','delivery-driver','farmworker-crops','personal-care-aide']:
    limitations.append('Hours, seasonal or part-time schedules, tips or commissions, unpaid gaps, and business costs can change annual earnings. Do not treat full-time annualization as guaranteed work.')
   if row['id']in['marketing-manager','management-analyst','general-operations-manager','medical-services-manager','restaurant-manager']:
    limitations.append('First qualified role typically follows related work; entry to this occupation is not necessarily a first job after school.')
   twcEntry=twc['entrywg'].get(bs,{}).get(key)or None
   return{'id':row['id'],'soc':soc,'title':row['title'],'wageSOC':bs,'wageMapping':'combined_BLS_category'if bs!=soc[:7]else'exact_occupation','status':'sourced','earnings':{'status':'sourced','publisher':'U.S. Bureau of Labor Statistics via O*NET OnLine','dataset':'OEWS May 2025','soc':soc,'wageSOC':bs,'p10':v[0],'p25':v[1],'median':v[2],'p75':v[3],'p90':v[4],'geography':geo,'fallback':key!='austin','fallbackRegion':key if key!='austin'else None,'referencePeriod':'May 2025','dollarYear':2025,'checkedAt':'2026-10-16','units':'gross annual employee wage'if annual else'gross hourly employee wage','annualPublished':bool(annual),'annualization':'Annual wages generally use 2,080 hours; teachers reported annual contract wages. This does not ensure year-round full-time work.','population':'Wage and salary workers; self-employed workers excluded','sourceURL':url,'methodURL':'https://www.bls.gov/oes/oes_ques.htm','sourceWageYears':sorted(set(re.findall(r'(20\d\d) wage data',text)))},'entryProxy':{'amount':twcEntry,'soc':bs,'publisher':'Texas Workforce Commission','geography':geo,'referencePeriod':'2025 annual wages','dollarYear':2025,'checkedAt':'2026-10-16','sourceURL':f'https://texaswages.com/MSAWages/MSASocDetails?soc={bs}&wgeType=entrywg','dataURL':'https://texaswages.com/api/MSAAnnual/entrywg','methodologyURL':'https://texaswages.com/Home/About','definition':'Average wage of the lowest-paid one-third in the selected occupation and location. Not measured earnings by experience.','fallback':key!='austin'},'sources':sources,'limitations':limitations}
  except Exception as exc:return{'id':row['id'],'soc':soc,'status':'fetch_error','error':str(exc),'sources':sources}
 with concurrent.futures.ThreadPoolExecutor(max_workers=6)as pool:rows=list(pool.map(audit,selected))
 out={'checkedAt':'2026-10-16','selection':str(SELECTION.relative_to(ROOT)),'summary':{'selected':len(rows),'sourced':sum(r['status']=='sourced'for r in rows),'annual':sum(r.get('earnings',{}).get('annualPublished',False)for r in rows),'fallbacks':[r['id']for r in rows if r.get('earnings',{}).get('fallback')],'entryMissing':[r['id']for r in rows if not r.get('entryProxy',{}).get('amount')],'errors':[r for r in rows if r['status']!='sourced']},'records':rows}
 (ROOT/'validation/commonness-priority-50-wages-2026-10-16.json').write_text(json.dumps(out,indent=2)+'\n');(ROOT/'data-sources/commonness-onet-wage-pages-2025.json').write_text(json.dumps({'checkedAt':'2026-10-16','snapshots':snapshots},indent=2)+'\n');print(json.dumps(out['summary'],indent=2))
if __name__=='__main__':main()
