from pathlib import Path
from html import escape
import json,re,hashlib

here=Path(__file__).resolve().parent
data=json.loads((here/'payload.json').read_text())
target=Path('/Users/muratbaykal/.codex/visualizations/2026/10/16/01a14334-7fd6-78e1-b4e6-d8b0ce0e3501/protected-confirmation-study.html')
h=lambda value:escape(str(value),quote=True)
groups={'development':'Development','holdout':'Original holdout','holdout049':'Fresh holdout','holdout056':'Expansion holdout','grok075':'Grok evaluation'}
names={'baseline':'Current control','failed':'Previous focused test','protected':'Protected sets'}
main=[s for s in data['summaries'] if s['id'] in ['original','grok075']]
charts=[]
for s in main:
 metrics=[]
 for label,key in [('Strong match','strong'),('College / graduate','degreeFirst3')]:
  bars=[]
  for arm,title in names.items():
   n=s[arm][key];total=s[arm]['models'];color='var(--foreground)' if arm=='baseline' else 'var(--viz-series-1)' if arm=='protected' else 'var(--viz-series-2)'
   opacity=';opacity:.55' if arm=='baseline' else ''
   bars.append(f'<div class="pc-series" data-arm-row="{arm}"><div class="pc-bar-label"><span>{title}</span><span class="tabular-nums">{n} / {total:,}</span></div><div class="progress" role="progressbar" aria-label="{h(label)} · {title} · {h(s["label"])}" aria-valuenow="{n}" aria-valuemin="0" aria-valuemax="{total}"><div class="progress-bar" style="width:{100*n/total:.1f}%;background:{color}{opacity}"></div></div></div>')
  metrics.append(f'<div class="pc-metric"><h4>{label}</h4>{"".join(bars)}</div>')
 charts.append(f'<section aria-label="{h(s["label"])}"><h3>{h(s["label"])}</h3>{"".join(metrics)}</section>')

strong=sum(s['protected']['strong']-s['baseline']['strong'] for s in main)
degree=sum(s['protected']['degreeFirst3']-s['baseline']['degreeFirst3'] for s in main)
remaining=sum(s['protected']['models']-s['protected']['strong'] for s in main)
remaining_degree=sum(s['protected']['models']-s['protected']['degreeFirst3'] for s in main)
overall=f'<span>Versus current: <strong>{strong:+d} students with strong matches</strong></span><span><strong>{degree:+d} with college / graduate matches</strong></span><span>{remaining} students still without a strong match · {remaining_degree} without a college / graduate match in the first three</span>'
splits=''.join(f'<tr><td>{h(s["label"])}</td><td>{s["baseline"]["models"]}</td><td class="text-nowrap">{s["baseline"]["strong"]} → {s["protected"]["strong"]}</td><td class="text-nowrap">{s["baseline"]["degreeFirst3"]} → {s["protected"]["degreeFirst3"]}</td><td>{s["versusCurrent"]["gainedDegreeFirst3"]} gained / {s["versusCurrent"]["lostDegreeFirst3"]} lost</td></tr>' for s in data['summaries'] if s['id']!='original')
recovery=''.join(f'<div class="pc-state"><strong>{h(s["label"])}</strong><span>{s["recoveredCollegeConnections"]} of {s["priorCollegeLosses"]} college career connections recovered</span><span>{s["stillMissedCollegeConnections"]} prior losses not recovered</span></div>' for s in main)
curves=[]
for s in main:
 rows=''.join(f'<tr><td>{60+c["budget"]}</td><td>{c["baseline"]["strong"]} / {c["targeted"]["strong"]}</td><td>{c["baseline"]["degreeFirst3"]} / {c["targeted"]["degreeFirst3"]}</td></tr>' for c in s['curves'])
 curves.append(f'<div><h3>{h(s["label"])}</h3><div class="table-responsive"><table class="table table-sm"><thead><tr><th>Total questions</th><th>Strong · control / protected</th><th>College · control / protected</th></tr></thead><tbody>{rows}</tbody></table></div></div>')
breadth=''.join(f'<h3>{h(s["label"])}</h3><div class="text-small">Students with strong options outside bachelor/graduate routes: {s["baseline"]["noncollegeAny"]} → {s["protected"]["noncollegeAny"]} · distinct confirmed careers: {s["baseline"]["distinctCareers"]} → {s["protected"]["distinctCareers"]} · different question sets: {s["baseline"]["models"]-s["allocationParity"]["sameQuestionSet"]}</div>' for s in main)

def response(a):
 if a['response']=='unfamiliar':return 'Unknown'
 if a.get('selected'):
  options={o['id']:o['text'] for o in data['questions'][a['id']].get('options',[])}
  return '; '.join(options.get(x,x) for x in a['selected'])
 return {'yes':'Yes','no':'No'}.get(a['response'],a['response'])

def answers(items,initial):
 if not items:return '<div class="text-small">No career-scoped answer difference in this view.</div>'
 rows=[]
 for a in items:
  assert a['id'] in data['questions']
  prompt=h(data['questions'][a['id']]['prompt']) if initial else ''
  rows.append(f'<li><span data-qref="{h(a["id"])}">{prompt}</span><div class="text-small">{h(response(a))}</div></li>')
 return '<ul>'+''.join(rows)+'</ul>'

outcomes={'recovered':'Recovered from the previous focused test','still-missed':'Previously lost college connection not recovered','new-loss':'College connection newly lost versus current control','noncollege-loss':'Non-college connection newly lost versus current control','new-gain':'Newly gained versus current control','ranking-only':'Still confirmed; outside the first three results'}
default=[(i,c) for i,c in enumerate(data['cases']) if c['kind']=='recovered']
initial_id=default[0][0]
case_options=''.join(f'<option value="{position}">{h(c["name"])} · {h(c["title"])} · {h(groups[c["cohort"]])}</option>' for position,(i,c) in enumerate(default))
case_nodes=[]
for i,c in enumerate(data['cases']):
 initial=i==initial_id
 label=f'{c["name"]} · {c["title"]} · {groups[c["cohort"]]}'
 states=''.join(f'<span>{label}: {"Strong match" if c[key] else "Unconfirmed"}</span>' for label,key in [('Current','currentStrong'),('Previous test','failedStrong'),('Protected','protectedStrong')])
 pay=f'<div class="text-small">Existing entry-pay estimate: ${round(c["entry"]):,} / year</div>' if c['entry'] else ''
 e=c.get('evidence')
 evidence=f'<div class="text-small">Protected evidence: {e["contexts"]} activity contexts · {e["interests"]} defining interests · {e["contrary"]} contrary answers</div>' if e else ''
 heading='Newly asked versus previous test' if c['protectedStrong'] else 'Positive control questions not asked'
 shown=c['newlyAsked'] if c['protectedStrong'] else c['omitted']
 number=f'Case 1 of {len(default)}' if initial else ''
 hide='' if initial else ' hidden'
 case_nodes.append(f'<article class="pc-case" data-case-id="{i}" data-cohort="{h(c["cohort"])}" data-kind="{h(c["kind"])}" data-label="{h(label)}"{hide}><div class="text-small"><span class="pc-case-number">{number}</span> · {h(groups[c["cohort"]])} · {h(c["id"])}</div><h3>{h(c["name"])} · {h(c["title"])}</h3><div>{h(outcomes[c["kind"]])}</div><div class="pc-state text-small">{states}</div>{pay}{evidence}<h4>{heading}</h4>{answers(shown,initial)}<details><summary>All related answers in protected run</summary>{answers(c["answered"],initial)}</details></article>')
questions=''.join(f'<span data-qid="{h(qid)}">{h(q["prompt"])}</span>' for qid,q in data['questions'].items())
v=data['validation'];checks=f'{v["models"]:,} students · {v["freshArms"]:,} fresh replays · exact control parity · canonical checkpoints checked · unmapped answers: 0 · prototype writes: 0'
blocks={'CHARTS':''.join(charts),'OVERALL':overall,'SPLITS':splits,'RECOVERY':recovery,'CASE_OPTIONS':case_options,'CASES':''.join(case_nodes),'CURVES':''.join(curves),'BREADTH':breadth,'CHECKS':checks,'QUESTIONS':questions}
fragment=(here/'template.html').read_text()
for key,value in blocks.items():
 assert fragment.count('__'+key+'__')==1
 fragment=fragment.replace('__'+key+'__',value)
assert not re.search(r'__[A-Z]+__',fragment)
assert len(fragment.encode())<1_000_000
target.write_text(fragment)
assert fragment.count('class="pc-case"')==len(data['cases'])
assert fragment.count('data-qid=')==len(data['questions'])
print(json.dumps({'bytes':target.stat().st_size,'cases':len(data['cases']),'questions':len(data['questions']),'scriptBytes':len(re.search(r'<script>(.*?)</script>',fragment,re.S).group(1)),'sourcePayloadSHA256':hashlib.sha256((here/'payload.json').read_bytes()).hexdigest()},indent=2))
