#!/usr/bin/env python3
"""Read every catalog SOC from the published Texas tables; preserve local gaps."""
import concurrent.futures,datetime,hashlib,json,re,urllib.request
from html import unescape
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def fetch(record):
 out={'id':record['id'],'soc':record['soc'],'sourceURL':f"https://www.onetonline.org/link/localwages/{record['soc']}?st=TX",'geography':'Austin–Round Rock–San Marcos, Texas metro','checkedAt':'2026-10-16'}
 if record['id']=='tattoo':return dict(out,status='not_available',reason='No tattoo-specific local employee wage series. Broader artist wages are not tattoo pay.',median=None,p25=None,p75=None)
 try:
  data=urllib.request.urlopen(out['sourceURL'],timeout=20).read();s=data.decode();out['sha256']=hashlib.sha256(data).hexdigest();text=re.sub(r'\s+',' ',unescape(re.sub('<[^>]+>',' ',re.sub(r'<script\b[^>]*>.*?</script>','',s,flags=re.S))))
  years=re.findall(r'(20\d\d) wage data',text);out['sourceWageYears']=sorted(set(years));out['referencePeriod']='May 2025' if '2025' in years else None
  annualRows=[row for row in re.findall(r'<tr\b[^>]*>(.*?)</tr>',s,re.S) if 'Annual Median (50%)' in row]
  for label,key in [('Austin-Round Rock-San Marcos, TX','local'),('Texas','state')]:
   row=next((r for r in annualRows if re.search(r'data-title="Location">'+re.escape(label)+r'</td>',r)),None)
   vals={}
   for title,dest in [('Annual QL (25%)','p25'),('Annual Median (50%)','median'),('Annual QU (75%)','p75')]:
    m=re.search(r'data-title="'+re.escape(title)+r'"[^>]*>(.*?)</td>',row or '',re.S);v=unescape(re.sub('<[^>]+>',' ',m[1])).strip() if m else ''
    vals[dest]=int(v.replace('$','').replace(',','')) if re.fullmatch(r'\$[\d,]+',v) else None
   out[key]=vals
  out.update(out.pop('local'));out['status']='sourced' if out['median'] is not None and out['referencePeriod'] else 'not_available';out['reason']='Austin wage is not published for this occupation in the reviewed table.' if out['status']!='sourced' else ''
 except Exception as e:out.update(status='unavailable',reason=str(e),median=None,p25=None,p75=None)
 return out
if __name__=='__main__':
 rows=json.loads((ROOT/'validation/catalog-audit-input.json').read_text())
 with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:results=list(pool.map(fetch,rows))
 output={'release':'2026-10-16','metro':'Austin–Round Rock–San Marcos, TX','period':'May 2025','publisher':'BLS via O*NET OnLine','population':'Employees; self-employed excluded','records':results,'summary':{s:sum(r['status']==s for r in results)for s in ['sourced','not_available','unavailable']}}
 (ROOT/'validation/austin-wage-source-audit.json').write_text(json.dumps(output,indent=2)+'\n');print(json.dumps(output['summary']));print(json.dumps([{'id':r['id'],'reason':r.get('reason')}for r in results if r['status']!='sourced']))
