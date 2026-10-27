import json, gzip, math, pathlib, collections
root = pathlib.Path('.')
source = root / 'reproduction.json.gz'
if not source.exists(): source = root / 'research/onet-benchmark-057/reproduction.json.gz'
d = json.loads(gzip.decompress(source.read_bytes()))
def pearson(a,b):
    if b is None or any(x is None for x in a): return None
    n=len(a); sa=sum(a); sb=sum(b)
    den=(n*sum(x*x for x in a)-sa*sa)*(n*sum(x*x for x in b)-sb*sb)
    return (n*sum(x*y for x,y in zip(a,b))-sa*sb)/math.sqrt(den) if den>0 else None
max_error=0; checked=0; phase=collections.defaultdict(lambda:dict(models=0,current=0,strong=0,degree=0))
for r in d['rows']:
    candidates=[]
    for i,c in enumerate(d['catalog']):
        score=pearson(r['raw'],c['vector'])
        if score is not None:
            max_error=max(max_error,abs(score-r['scores'][i])); checked+=1
        candidates.append(dict(c,r=score if r['eligible'] else None))
    selected=[]
    for zone in range(1,6):
        positive=[c for c in candidates if c['zone']==zone and c['r'] is not None and c['r']>=0]
        strong=[c for c in positive if c['r']>=.608]
        filler=sorted([c for c in positive if c['r']<.608],key=lambda c:(-c['r'],c['id']))[:max(0,10-len(strong))]
        selected.extend(strong+filler)
    assert set(c['id'] for c in selected)==set(r['selected']),r['id']
    strong=[c for c in selected if c['r']>=.608]
    assert set(c['id'] for c in strong)==set(r['strong']),r['id']
    p=phase[r['phase']];p['models']+=1;p['current']+=bool(r['top']);p['strong']+=bool(strong)
    p['degree']+=any(any(x['key'] in ['college','graduate'] for x in c['routes'])for c in strong)
assert len(d['rows'])==1000 and max_error<1e-9
print(json.dumps(dict(models=len(d['rows']),correlations_checked=checked,max_error=max_error,cohorts=phase),indent=2))
