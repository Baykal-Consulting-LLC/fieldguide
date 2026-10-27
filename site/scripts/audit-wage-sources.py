#!/usr/bin/env python3
"""Re-read all sourced national employee wage tables. Does not modify app data.
O*NET is the app's original display source; agreement is a transcription/freshness
check, not independent confirmation of the upstream BLS statistical estimate.
"""
import concurrent.futures, datetime, hashlib, json, re, urllib.request
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class VisibleText(HTMLParser):
 def __init__(self):super().__init__();self.hidden=0;self.parts=[]
 def handle_starttag(self,tag,attrs):
  if tag in ['script','style']:self.hidden+=1
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.hidden=max(0,self.hidden-1)
 def handle_data(self,data):
  if not self.hidden:self.parts.append(data)
def read(row):
 url=row['earnings']['sourceURL'];out={'id':row['id'],'soc':row['soc'],'sourceURL':url,'expected':[row['earnings'][k] for k in ['p25','median','p75']],'periodExpected':row['earnings']['referencePeriod']}
 try:
  data=urllib.request.urlopen(url,timeout=20).read();p=VisibleText();p.feed(data.decode());text=re.sub(r'\s+',' ',' '.join(p.parts));out['sha256']=hashlib.sha256(data).hexdigest()
  matches=re.findall(r'United States\s+\$([\d,]+)\s+\$([\d,]+)\s+\$([\d,]+)\s+\$([\d,]+)\s+\$([\d,]+)',text)
  annual=next((m for m in matches if int(m[2].replace(',',''))>1000),None)
  years=re.findall(r'(20\d\d) wage data',text);out['sourceWageYears']=sorted(set(years));out['observed']=list(map(lambda x:int(x.replace(',','')),annual[1:4])) if annual else None
  out['status']='match' if out['observed']==out['expected'] and '2025' in years else 'review' if annual else 'unparsed'
 except Exception as e:out.update(status='unavailable',error=str(e))
 return out
if __name__=='__main__':
 records=json.loads((ROOT/'validation/catalog-audit-input.json').read_text());rows=[r for r in records if r['earnings']['status']=='sourced']
 with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:results=list(pool.map(read,rows))
 out={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceFamily':'BLS via O*NET; same upstream series as app','independentStatisticalConfirmation':False,'results':results,'summary':{s:sum(r['status']==s for r in results)for s in ['match','review','unparsed','unavailable']},'tattoo':{'status':'not_available','substituteBroaderArtistWage':False}}
 (ROOT/'validation/wage-source-audit.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out['summary']))
