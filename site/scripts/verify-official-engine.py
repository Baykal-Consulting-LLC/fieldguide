"""Compare fictional profiles with public official scoring and independent correlation arithmetic."""
import json,math,html,re,urllib.request,urllib.parse,hashlib,pathlib
inputs=json.loads(pathlib.Path('validation/official-engine-persona-inputs.json').read_text())
items=json.loads(pathlib.Path('data-sources/onet-short-form-60-official.json').read_text())['response']['question']
report={'date':'2026-10-17','scope':'Fictional activity-level student profiles. Official server scoring comparison and independent arithmetic checks; not a human validation study.','instrument':'O*NET Interest Profiler Short Form, 60 items','profiles':[],'issues':[]}
for row in inputs:
 code=''.join(str(row['answers']['onet-sf-'+str(i).zfill(2)]) for i in range(1,61))
 url='https://services.onetcenter.org/demo?'+urllib.parse.urlencode({'url':'mnm/interestprofiler/results?answers='+code})
 page=urllib.request.urlopen(url).read().decode();block=re.search(r'<div id="response-content-html"[^>]*>(.*?)</div>',page,re.S).group(1);response=json.loads(html.unescape(re.sub('<[^>]+>','',block)).replace('\xa0',' '))
 scores=[next(r['score'] for r in response['result'] if r['code']==name) for name in ['realistic','investigative','artistic','social','enterprising','conventional']]
 official_ok=scores==row['raw'];errors=[];checked=0
 for c in row['comparisons']:
  if c['r'] is None:continue
  a=scores;b=c['vector'];n=6
  numerator=n*sum(x*y for x,y in zip(a,b))-sum(a)*sum(b)
  denominator=math.sqrt((n*sum(x*x for x in a)-sum(a)**2)*(n*sum(y*y for y in b)-sum(b)**2))
  independent=numerator/denominator;checked+=1
  if abs(c['r']-independent)>1e-10:errors.append(c['id'])
 out={'id':row['id'],'officialScores':scores,'localScores':row['raw'],'officialScoresAgree':official_ok,'correlationsIndependentlyChecked':checked,'correlationErrors':errors,'officialSourceURL':url,'officialPageSHA256':hashlib.sha256(page.encode()).hexdigest()}
 report['profiles'].append(out)
 if not official_ok or errors:report['issues'].append(row['id'])
p=pathlib.Path('validation/official-engine-verification-2026-10-17.json');p.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'profiles':len(report['profiles']),'sixScoreComparisons':6*len(report['profiles']),'correlationComparisons':sum(r['correlationsIndependentlyChecked'] for r in report['profiles']),'issues':report['issues']}))
if report['issues']:raise SystemExit(1)
