"""Independent arithmetic plus optional fresh public O*NET demo comparison.
Run: python3 research/validation-053-external/compare.py [--live]
No credentials, real profiles, accounts, browser storage, or third-party signup.
The default run is offline against frozen input/response fixtures.
"""
import json, math, pathlib, hashlib, re, html, urllib.request, urllib.parse, sys, datetime, time
D=pathlib.Path(__file__).parent

def pearson(a,b):
    if a is None or b is None or len(a)!=6 or len(b)!=6 or any(x is None for x in a+b): return None
    # Sums/products identity independent of JS's centered-vector loop.
    n=6; num=n*sum(x*y for x,y in zip(a,b))-sum(a)*sum(b)
    den1=n*sum(x*x for x in a)-sum(a)**2; den2=n*sum(x*x for x in b)-sum(b)**2
    if den1<=1e-12 or den2<=1e-12: return None
    return max(-1,min(1,num/math.sqrt(den1*den2)))

def ranks(values):
    out=[0]*len(values);ordered=sorted(range(len(values)),key=lambda i:values[i]);i=0
    while i<len(ordered):
        j=i+1
        while j<len(ordered) and values[ordered[j]]==values[ordered[i]]: j+=1
        for q in ordered[i:j]: out[q]=(i+j-1)/2+1
        i=j
    return out

def spearman(a,b):
    if len(a)!=len(b) or len(a)<2:return None
    aa=ranks(a);bb=ranks(b);am=sum(aa)/len(a);bm=sum(bb)/len(b)
    num=sum((x-am)*(y-bm) for x,y in zip(aa,bb));den=math.sqrt(sum((x-am)**2 for x in aa)*sum((y-bm)**2 for y in bb))
    return num/den if den else None

def kendall(a,b):
    c=d=ta=tb=0
    for i in range(len(a)):
        for j in range(i):
            x=(a[i]>a[j])-(a[i]<a[j]);y=(b[i]>b[j])-(b[i]<b[j])
            if x==0 and y==0:continue
            if x==0:ta+=1
            elif y==0:tb+=1
            elif x==y:c+=1
            else:d+=1
    den=math.sqrt((c+d+ta)*(c+d+tb));return (c-d)/den if den else None

def jaccard(a,b):
    a=set(a);b=set(b);return len(a&b)/len(a|b) if a|b else None

def topk(values,ids,k):
    # Include ties crossing the cutoff; exact IDs avoid title or specialty conflation.
    v=sorted(values,reverse=True);cut=v[min(k,len(v))-1];return {i for i,x in zip(ids,values) if x>=cut-1e-12}

def tier(r):return None if r is None else 3 if r>=.729 else 2 if r>=.608 else 1 if r>=0 else 0

def demo(path):
    url='https://services.onetcenter.org/demo?'+urllib.parse.urlencode({'url':path})
    req=urllib.request.Request(url,headers={'User-Agent':'Fieldguide synthetic interoperability check (public documentation demo)'})
    with urllib.request.urlopen(req,timeout=35) as response:page=response.read();status=response.status
    block=re.search(r'<div id="response-content-html"[^>]*>(.*?)</div>',page.decode(),re.S)
    if not block:raise ValueError('Demo response block unavailable')
    data=json.loads(html.unescape(re.sub('<[^>]+>','',block.group(1))).replace('\xa0',' '))
    return {'url':url,'httpStatus':status,'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'htmlSHA256':hashlib.sha256(page).hexdigest(),'response':data}

def run(live=False):
    raw=(D/'frozen-inputs.json').read_bytes();inputs=json.loads(raw);careers=inputs['careers'];themes='RIASEC';local=[];errors=[];maxerr=0;compared=0
    for row in inputs['rows']:
        totals=[sum(v-1 for q,v in zip(inputs['instrument']['items'],row['answers']) if q['theme']==t) for t in themes] if all(v is not None for v in row['answers']) else None
        if totals!=row['raw']:errors.append({'id':row['id'],'issue':'six-score-sums'})
        reference=[pearson(totals,c['vector']) for c in careers];indices=[i for i,(a,b) in enumerate(zip(reference,row['correlations'])) if a is not None and b is not None]
        for i,(a,b) in enumerate(zip(reference,row['correlations'])):
            if (a is None)!=(b is None): errors.append({'id':row['id'],'issue':'null-mismatch','career':careers[i]['id']})
            elif a is not None:
                compared+=1;maxerr=max(maxerr,abs(a-b))
                if abs(a-b)>1e-10:errors.append({'id':row['id'],'issue':'arithmetic','career':careers[i]['id']})
        # Rank metrics round only below arithmetic acceptance tolerance, avoiding FP-only false rank differences.
        a=[round(reference[i],10) for i in indices];b=[round(row['correlations'][i],10) for i in indices];ids=[careers[i]['soc'] for i in indices]
        unique={};duplicate=[]
        for i in indices:
            soc=careers[i]['soc']
            if soc in unique:
                if abs(reference[i]-unique[soc])>1e-10:duplicate.append(soc)
            else:unique[soc]=reference[i]
        local.append({'id':row['id'],'phase':row['phase'],'scoreAgreement':totals==row['raw'],'comparisons':len(indices),'spearman':spearman(a,b),'kendallTauB':kendall(a,b),'topKJaccard':{str(k):jaccard(topk(a,ids,k),topk(b,ids,k)) if a else None for k in [5,10,20,50]},'conflictingDuplicateSOC':duplicate})
    fixtures=D/'live-responses.json'
    if live:
        if fixtures.exists():raise RuntimeError('Live fixture exists. Preserve it; use a new dated directory for a future rerun.')
        panel=[r for r in inputs['rows'] if r['id'] in inputs['livePanel']['ids']]
        for id,value in [('all-dislike',1),('all-unsure',3),('all-love',5)]:panel.append({'id':id,'phase':'edge','answers':[value]*60,'raw':[(value-1)*10]*6})
        changed=list(panel[0]['answers']);changed[0]=changed[0]%5+1
        panel.append({'id':'one-item-change','phase':'edge','answers':changed,'raw':[sum(v-1 for q,v in zip(inputs['instrument']['items'],changed) if q['theme']==t) for t in themes]})
        captures={'questions':demo('mnm/interestprofiler/questions?start=1&end=60'),'profiles':[]}
        for row in panel:
            code=''.join(map(str,row['answers']));entry={'id':row['id'],'phase':row['phase'],'expectedScores':row['raw'],'answerSHA256':hashlib.sha256(code.encode()).hexdigest(),'score':demo('mnm/interestprofiler/results?answers='+code),'careers':demo('mnm/interestprofiler/careers?answers='+code+'&start=1&end=1000')}
            captures['profiles'].append(entry);print('Captured '+row['id'],flush=True);time.sleep(.2)
        fixtures.write_text(json.dumps(captures,indent=2)+'\n')
    live_result=[];question_agreement=None
    if fixtures.exists():
        capture=json.loads(fixtures.read_text());qs=capture['questions']['response']['question'];question_agreement=all(x['index']==y['index'] and x['text']==y['text'] and x['area']=={'R':'realistic','I':'investigative','A':'artistic','S':'social','E':'enterprising','C':'conventional'}[y['theme']] for x,y in zip(qs,inputs['instrument']['items'])) and len(qs)==60
        names=['realistic','investigative','artistic','social','enterprising','conventional'];byid={r['id']:r for r in inputs['rows']}
        for entry in capture['profiles']:
            response=entry['score']['response'];scores=[next(x['score'] for x in response['result'] if x['code']==n) for n in names];row=byid.get(entry['id']);expected=row['raw'] if row else entry.get('expectedScores');
            if expected is None and entry['id'] in ['all-dislike','all-unsure','all-love']:expected=[{'all-dislike':0,'all-unsure':20,'all-love':40}[entry['id']]]*6
            if expected is None and entry['id']=='one-item-change':
                original=byid[inputs['livePanel']['ids'][0]];changed=list(original['answers']);changed[0]=changed[0]%5+1;expected=[sum(v-1 for q,v in zip(inputs['instrument']['items'],changed) if q['theme']==t) for t in themes]
            remote=entry['careers']['response'];returned=remote.get('career',[]);ref={c['soc']:pearson(scores,c['vector']) for c in careers if c['vector']};valid={soc:r for soc,r in ref.items() if r is not None}
            overlap=[x for x in returned if x['code'] in valid];bad=[{'soc':x['code'],'remote':x['fit'],'reference':tier(valid[x['code']])} for x in overlap if {'Best':3,'Great':2,'Good':1}[x['fit']]!=tier(valid[x['code']])]
            localStrong={soc for soc,r in valid.items() if r>=.608};remoteStrong={x['code'] for x in returned if x['fit'] in ('Best','Great') and x['code'] in valid}
            live_result.append({'id':entry['id'],'phase':entry['phase'],'scoreAgreement':scores==expected,'officialScores':scores,'returned':len(returned),'total':remote.get('total'),'paginationComplete':len(returned)==remote.get('total',0),'sharedReturnedSOC':len(overlap),'fitCategoryAgreement':len(overlap)-len(bad),'fitCategoryDisagreements':bad,'strongSetJaccardOnSharedCatalog':jaccard(localStrong,remoteStrong),'localStrongMissingRemote':sorted(localStrong-remoteStrong),'officialStrongOutsideCatalog':len([x for x in returned if x['fit'] in ('Best','Great') and x['code'] not in ref]),'flatProfile':len(set(scores))==1,'rankMetrics':None,'rankMetricsReason':'Service returns fit categories then alphabetical order, not numeric correlations. Do not pretend its display order is correlation rank.'})
    report={'createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'inputSHA256':hashlib.sha256(raw).hexdigest(),'scope':'Independent formula agreement and live official O*NET Short Form interoperability, not predictive validity or commercial service agreement. Original and fresh holdouts and diagnostic variants remain separate. No actual student data.', 'local':{'profiles':len(local),'baseProfiles':sum(r['phase']!='diagnostic049' for r in local),'diagnosticProfiles':sum(r['phase']=='diagnostic049' for r in local),'careerRows':len(careers),'correlationComparisons':compared,'maxAbsoluteError':maxerr,'errors':errors,'rows':local},'live':{'service':'O*NET public API Version 2 demo','fixtureSHA256':hashlib.sha256(fixtures.read_bytes()).hexdigest() if fixtures.exists() else None,'questionItemAgreement':question_agreement,'profiles':live_result},'commercialVendorRuns':0}
    (D/'results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'models':len(local),'correlations':compared,'maxerr':maxerr,'errors':len(errors),'liveProfiles':len(live_result),'fitDisagreements':sum(len(x['fitCategoryDisagreements']) for x in live_result)}));return report
if __name__=='__main__':run('--live' in sys.argv)
