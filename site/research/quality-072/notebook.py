from pathlib import Path
import nbformat as nbf
from nbclient import NotebookClient
R=Path(__file__).resolve().parents[2];O=R.parent/'outputs'
nb=nbf.v4.new_notebook(metadata={'kernelspec':{'name':'quality072','display_name':'Quality review 072','language':'python'}})
nb.cells=[nbf.v4.new_markdown_cell('''# Match-quality review · research 0.71

**Decision:** repair the prototype's follow-up wiring and evidence provenance before a live rollout. Preserve grounded career connections, unknown interests and separate holdouts. This notebook independently reconciles the read-only case review, then visualizes the remaining queues and broad-pattern disagreements. None of these counts is a fit-accuracy estimate.'''),nbf.v4.new_code_cell('''from pathlib import Path
import gzip,json,hashlib
from collections import Counter
import matplotlib.pyplot as plt
start=Path.cwd(); R=next(p/'site' for p in [start,*start.parents] if (p/'site/research/evidence-071/results.json.gz').exists()); H=R/'research/quality-072'; O=R.parent/'outputs'
B=json.loads(gzip.decompress((R/'research/evidence-071/results.json.gz').read_bytes()))
A=json.loads(gzip.decompress((H/'audit.json.gz').read_bytes()))
S=json.loads((H/'summary.json').read_text())
assert len(B['rows'])==len({r['id'] for r in B['rows']})==1000
for file,sha in A['hashes'].items():
    assert hashlib.sha256((R/file).read_bytes()).hexdigest()==sha,file
freeze=json.loads((R/'research/evidence-071/freeze-001.json').read_text())
for file,sha in freeze['files'].items():
    assert hashlib.sha256((R/file).read_bytes()).hexdigest()==sha,file
print({'models':1000,'reconstructed':len(A['rows']),'new_claims':sum(len(r['newSupported']) for r in B['rows']),'specialist_reclassifications':sum(len(r['reclassified']) for r in B['rows'])})
'''),nbf.v4.new_markdown_cell('''## Independently reconcile the remaining queues

The unit is a model. Primary queues partition the 309 without a bachelor/graduate Top. A rule-level binding is not independently validated career suitability. Explicit Unsure, No and holds remain unresolved; a one-check case is not a guaranteed recovery.'''),nbf.v4.new_code_cell('''def deg(ps): return any(x['key'] in ('college','graduate') for p in ps for x in p['routes'])
rs=[r for r in A['rows'] if not deg(r['top'])]
labels={'below-cap':'Degree already outside Top three','activity':'Incomplete activity evidence','binding':'Unasked rule links to inspect','one-check':'One defining check unresolved','broader':'Broader exploration','exposure':'No typed evidence'}
keys=list(labels)
queue={}
for r in rs:
    safe=[c for c in r['candidates'] if not c['supported'] and not c.get('confirmation') and not c['negativeTopics'] and not any(q['response']=='no' or q['hold'] for q in c['checks'])]
    if r['degreeOutsideTop']: k='below-cap'
    elif any(len(c['checks'])==2 and all(q['response']=='yes' for q in c['checks']) and len(c['taskDomains'])<2 for c in safe): k='activity'
    elif any(c['checks'] and any(q['response'] is None for q in c['checks']) and all(q['response']=='yes' or q['response'] is None and q['bindingSatisfied'] for q in c['checks']) for c in safe): k='binding'
    elif any(c['checks'] and sum(q['response']!='yes' for q in c['checks'])==1 and c['specificDomains'] for c in safe): k='one-check'
    elif r['ledger']['yes']: k='broader'
    else: k='exposure'
    queue[r['id']]=k
counts=Counter(queue.values())
assert counts==Counter({k:v['models'] for k,v in S['remaining'].items()})
assert len(rs)==309 and sum(r['noTop'] for r in rs)==182
assert sum(not deg(r['afterSupported']) for r in B['rows'])==242
assert Counter(r['cohort'] for r in B['rows'])==Counter(development=758,holdout=30,holdout049=12,holdout056=200)
print(dict(counts))
a=[sum(queue[r['id']]==k and r['noTop'] for r in rs) for k in keys]
b=[sum(queue[r['id']]==k and not r['noTop'] for r in rs) for k in keys]
fig,ax=plt.subplots(figsize=(11,4.8));ax.barh(list(labels.values()),a,label='No supported Top',color='#3e7694');ax.barh(list(labels.values()),b,left=a,label='Has non-degree Top',color='#93b49d')
for i,(x,y) in enumerate(zip(a,b)):ax.text(x+y+1.5,i,str(x+y),va='center')
ax.invert_yaxis();ax.set_xlim(0,150);ax.set_xlabel('Models · mutually exclusive primary queues');ax.set_title('309 models without a bachelor/graduate Top');ax.spines[['top','right']].set_visible(False);ax.legend(loc='lower right');fig.tight_layout();fig.savefig(O/'match-quality-review-072-gaps.png',dpi=160);plt.show()
'''),nbf.v4.new_markdown_cell('''## Specific evidence is not the same as overall pattern agreement

A negative correlation means a different six-theme interest pattern; it does not prove an explicit task preference is false. An unavailable value is not zero. The case CSV identifies all flagged claims. No arbitrary new score threshold is introduced.'''),nbf.v4.new_code_cell('''claims=[(r,p) for r in B['rows'] for p in r['newSupported']]
assert len(claims)==113
bins=['Negative correlation','Non-negative correlation','Unavailable']
top=[];other=[]
for label in bins:
    group=[(r,p) for r,p in claims if ('Unavailable' if p['r'] is None else 'Negative correlation' if p['r']<0 else 'Non-negative correlation')==label]
    top.append(sum(any(t['id']==p['id'] for t in r['afterTop']) for r,p in group));other.append(len(group)-top[-1])
assert [top[0]+other[0],top[0],top[2]+other[2]]==[17,8,1]
fig,ax=plt.subplots(figsize=(10,3.6));ax.barh(bins,top,label='In Top three',color='#3e7694');ax.barh(bins,other,left=top,label='Supported alternative',color='#b5bfc6')
for i,(x,y) in enumerate(zip(top,other)):ax.text(x+y+1,i,str(x+y),va='center')
ax.invert_yaxis();ax.set_xlim(0,105);ax.set_xlabel('New model-career claims · not unique models');ax.set_title('113 new supported claims: overall pattern agreement');ax.spines[['top','right']].set_visible(False);ax.legend(loc='lower right');fig.tight_layout();fig.savefig(O/'match-quality-review-072-patterns.png',dpi=160);plt.show()
q=[q for q in B['questionCounts'] if q['kind']=='evidence']
assert len(q)==7 and sum(x['all']['offered'] for x in q)==553 and sum(x['all']['positive'] for x in q)==91
print('Seven evidence items: 553 offers, 91 grounded positive answers. Interface probes separately establish that these items are not consumed by matching.')
'''),nbf.v4.new_markdown_cell('''## Takeaways and limits

- Keep the sensible task-to-career connections. Inspect broad-pattern disagreement instead of automatically vetoing a concrete interest.
- Fix the seven unconsumed follow-up answer types and scope reusable questions to the actual unresolved construct.
- Review nine unasked-rule cases without auto-filling uncertainty. The other primary queues need real new information or fair exposure.
- All 44 specialist reclassifications are supported by absent specialty evidence. Neither specialty has a positive fact in the frozen cohort; add separate controls rather than rewriting profiles.
- All holdouts remain separate and have already been inspected. This is a systematic rule/provenance review with selected deeper individual judgments, not a blinded independent career assessment.
- No live matching, saved answers, earnings, profiles or frozen benchmark outcomes changed. See the Markdown report and per-claim/gap CSVs for case details.''')]
nbf.validate(nb);p=O/'match-quality-review-072.ipynb';nbf.write(nb,p)
client=NotebookClient(nb,timeout=180,kernel_name='quality072',resources={'metadata':{'path':str(R.parent)}})
client.execute();nb.metadata['kernelspec']={'name':'python3','display_name':'Python 3','language':'python'};nbf.validate(nb);nbf.write(nb,p)
print('Executed and validated',p)
