#!/usr/bin/env python3
"""Add a primary-source alternate Austin table and small-sample posting estimates.
Keeps the original failed state-only lookup in the audit history.
"""
import json,re,urllib.request,hashlib
from html import unescape
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src='https://www.onetonline.org/link/localwages/27-1021.00?zip=75201'
data=urllib.request.urlopen(src,timeout=20).read();html=data.decode()
row=next(r for r in re.findall(r'<tr\b[^>]*>(.*?)</tr>',html,re.S) if 'Annual Median (50%)' in r and 'data-title="Location">Austin-Round Rock-San Marcos, TX</td>' in r)
values={}
for title,key in [('Annual QL (25%)','p25'),('Annual Median (50%)','median'),('Annual QU (75%)','p75')]:
 text=unescape(re.sub('<[^>]+>',' ',re.search('data-title="'+re.escape(title)+'"[^>]*>(.*?)</td>',row,re.S)[1])).strip();assert re.fullmatch(r'\$[\d,]+',text);values[key]=int(text.replace('$','').replace(',',''))
audit=json.loads((root/'validation/austin-wage-source-audit.json').read_text());records={r['id']:r for r in audit['records']}
records['industrial-design']={**records['industrial-design'],**values,'status':'sourced','reason':'','sourceURL':src,'sha256':hashlib.sha256(data).hexdigest(),'lookupNote':'State-only view omits metro rows when Texas statewide pay is suppressed; Dallas ZIP view exposes the exact Austin row. No Dallas wage substituted.'}
# Manually reviewed official Indeed salary pages, 2026-10-16. Search snippets differed
# for Austin, so the directly opened source page (5 posts) is the retained snapshot.
records['tattoo']={'id':'tattoo','soc':'27-1019.00','status':'posting_estimate','mapping':'title_posting_estimate','geography':'Austin, Texas','currency':'USD','dollarYear':2026,'referencePeriod':'Updated June 8, 2026 · prior 36 months','checkedAt':'2026-10-16','dataset':'Indeed salary-bearing job postings','publisher':'Indeed','population':'Salary-bearing job postings; small nonrepresentative sample. Contract status and studio expenses are not established.','median':None,'average':65395,'p25':None,'p75':None,'sampleSize':5,'sourceURL':'https://www.indeed.com/career/tattoo-artist/salaries/Austin--TX','methodURL':'https://www.indeed.com/career/tattoo-artist/salaries/Austin--TX','reason':'Use as a provisional planning input, not an employee median or studio-owner profit. Regional comparisons are separate city posting averages, not quartiles or experience bands.','annualization':'Uses the publisher’s annual base-pay estimate; collected client revenue and business expenses are not supplied.','confidence':'low','regionalComparisons':[{'id':'dallas','city':'Dallas','average':63259,'sampleSize':2,'updatedAt':'2026-04-07','sourceURL':'https://www.indeed.com/career/tattoo-artist/salaries/Dallas--TX'},{'id':'houston','city':'Houston','average':62774,'sampleSize':6,'updatedAt':'2026-07-06','sourceURL':'https://www.indeed.com/career/tattoo-artist/salaries/Houston--TX'}],'reviewNote':'Rejected Salary.com tattoo estimates because the published role description instead described generic commercial illustration. Do not borrow its percentiles or experience curve.'}
output={'release':'2026-10-16-v2','retrievedAt':'2026-10-16','records':[records['industrial-design'],records['tattoo']],'choice':'61 Austin BLS exact occupation distributions;1 Austin posting average with Dallas/Houston comparisons. No speculative percentile or experience curve.'}
(root/'validation/wage-fallback-evidence.json').write_text(json.dumps(output,indent=2)+'\n')
(root/'dist/austin-wages.js').write_text('// Austin wage snapshot; one clearly labeled Indeed posting estimate. See validation receipts.\nexport const AUSTIN_WAGE_RELEASE="austin-2026-10-16-v2";\nexport const austinWages='+json.dumps(records,indent=2)+';\n')
print(json.dumps(values));print('61 official Austin distributions;1 posting estimate with2 regional comparisons')
