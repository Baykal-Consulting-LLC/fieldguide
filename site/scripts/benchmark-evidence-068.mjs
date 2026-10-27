import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync,gzipSync} from 'node:zlib';
import {currentModelStates} from './current-model-states.mjs';
import {cohort056Cases} from './cohort-056-source.mjs';
import {applyBroadFollowups052} from '../dist/broad-followups-052-replay.js';
import {applyExplorerReviews053} from '../dist/explorer-053-replay.js';
import {applyModelContext056,explorerResults,explorerCareerQuestions,explorerAnswer} from '../dist/open-explorer-056.js';
import {saveExplorerAnswer} from '../dist/explorer-053-state.js';
import {educationRoutesFor} from '../dist/education-routes.js';
import {explorerBudget} from '../dist/explorer-053-budget.js';
import {systemCohort,bachelorGraduate} from '../analytics/performance/src/content/shared/system-match-metrics.js';
import {topics,methods} from '../calibration/cohort-056/spec.mjs';
import {rules,connect,structuredLedger,proposeCareers} from '../prototypes/targeted-067/engine.mjs';
import {authoredEvidence} from '../research/targeted-067/review.mjs';

const root='research/evidence-068/'; fs.mkdirSync(root,{recursive:true});
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p));
const sha=x=>createHash('sha256').update(x).digest('hex');
const manifest=read('dist/developer/current-cohort-data.json');
const baselineRows=manifest.parts.flatMap(p=>read('dist/developer/'+p.url).rows).filter(r=>r.phase!=='diagnostic049');
const baseline=new Map(baselineRows.map(r=>[r.id,r]));
const profiles=new Map(read('calibration/cohort-056/profiles.json').map(p=>[p.id,p]));
const cases=[...currentModelStates().filter(({c})=>baseline.has(c.id)).map(({c,state})=>({c,state:applyExplorerReviews053(applyBroadFollowups052(state,c.id),c.id)})),...cohort056Cases().map(c=>({c,state:c.experimentState}))].map(({c,state})=>({c,state:applyModelContext056(state,c)}));
assert.equal(cases.length,1000); assert.equal(new Set(cases.map(x=>x.c.id)).size,1000);
const files=['scripts/benchmark-evidence-068.mjs','prototypes/targeted-067/engine.mjs','research/targeted-067/review.mjs','calibration/cohort-056/profiles.json','calibration/cohort-056/spec.mjs','dist/open-explorer.js','dist/open-explorer-056.js','dist/explorer-053-state.js','dist/education-routes.js','dist/explorer-053-budget.js'];
const freeze={version:1,baselineRunId:manifest.runId,rulesVersion:'evidence-067-v1',policy:'Freeze shared 0.67 rules before a full 1,000-case replay. No 0.66 per-model answer overrides. Four existing authored ledgers only; all other authored facts remain unencoded. Same rules for development and every holdout. Retain known answers and review holds; missing interests stay unknown. No live matching change.',files:Object.fromEntries(files.map(p=>[p,sha(fs.readFileSync(p))])),plan:cases.map(({c,state})=>({id:c.id,cohort:systemCohort(c),stateHash:sha(JSON.stringify(state)),profileHash:sha(JSON.stringify(profiles.get(c.id)||c.biography))}))};
if(fs.existsSync(root+'freeze-001.json'))assert.deepEqual(read(root+'freeze-001.json'),freeze); else fs.writeFileSync(root+'freeze-001.json',JSON.stringify(freeze,null,2)+'\n');
const valueAt=(o,p)=>p.split('.').reduce((x,k)=>x?.[k],o);
for(const[id,features]of Object.entries(authoredEvidence)){const c=cases.find(x=>x.c.id===id).c;for(const refs of Object.values(features))for(const ref of refs)assert.ok(valueAt(c.biography,ref.path)?.includes(ref.quote),'Source quote mismatch '+id);}

const rows=[];
for(const {c,state}of cases){
 const original=JSON.stringify(state),p=profiles.get(c.id),base=baseline.get(c.id),s=structuredClone(state);
 const before=explorerResults(state),supportedBefore=before.rows.filter(r=>r.specific.supported);
 assert.deepEqual(supportedBefore.map(x=>x.id),base.supported.map(x=>x.id),'Baseline support differs: '+c.id);
 assert.deepEqual(supportedBefore.slice(0,3).map(x=>x.id),base.top.map(x=>x.id),'Baseline Top differs: '+c.id);
 const ledger=p?structuredLedger(p,{topics,methods}):{yes:authoredEvidence[c.id]||{},no:{}};
 const checks=[];
 for(const id of Object.keys(rules))for(const q of explorerCareerQuestions(id).filter(q=>q.kind==='specific')){
  const existing=explorerAnswer(s,'profession',id,q),decision=connect(ledger,id,q.domain),retained=!!existing?.reviewHold||['yes','no'].includes(existing?.response);
  if(!retained&&decision.response==='yes')saveExplorerAnswer(s,{kind:'profession',scope:id,questionId:q.id,payload:{response:'yes',source:'profile-inferred',confidence:'medium',evidence:'Research typed evidence: '+decision.evidence.map(e=>e.feature+': '+e.quote).join(' · ')},at:'2026-10-21T05:00:00.000Z'});
  checks.push({careerId:id,questionId:q.id,domain:q.domain,prompt:q.prompt,before:existing??null,decision,retained,after:explorerAnswer(s,'profession',id,q)??null});
 }
 const after=explorerResults(s),support=after.rows.filter(r=>r.specific.supported);
 const compact=x=>({id:x.id,title:x.o.title,fields:x.fields,routes:educationRoutesFor(x.o),budget:explorerBudget(s,x.o),supported:x.specific.supported,evidence:x.specific.evidence,missing:x.specific.missing,contrary:x.specific.contrary});
 const beforeTop=supportedBefore.slice(0,3).map(compact),afterTop=support.slice(0,3).map(compact);
 const ids=new Set(base.supported.map(x=>x.id)),newSupported=support.filter(x=>!ids.has(x.id)).map(compact);
 assert.ok(base.supported.every(x=>support.some(y=>y.id===x.id)),'Supported evidence lost: '+c.id);
 const proposals=proposeCareers(ledger),candidates=proposals.map(id=>after.rows.find(x=>x.id===id)).filter(x=>x&&!x.specific.supported).map(compact);
 assert.equal(JSON.stringify(state),original,'Source state mutated: '+c.id);
 rows.push({id:c.id,name:base.name,phase:c.phase,cohort:systemCohort(c),source:p?'Structured profile':'Authored profile',encoded:!!Object.keys(ledger.yes).length,ledger,checks,beforeTop,afterTop,newSupported,candidates,afterSupported:support.map(compact),gainedTop:!beforeTop.length&&!!afterTop.length,lostTop:!!beforeTop.length&&!afterTop.length,gainedDegree:!beforeTop.some(bachelorGraduate)&&afterTop.some(bachelorGraduate),lostDegree:beforeTop.some(bachelorGraduate)&&!afterTop.some(bachelorGraduate),changed:JSON.stringify(beforeTop.map(x=>x.id))!==JSON.stringify(afterTop.map(x=>x.id))});
 if(rows.length%100===0)console.log('Evidence benchmark: '+rows.length+' / 1000');
}
const summary=Object.fromEntries(['all','development','holdout','holdout049','holdout056'].map(g=>{
 const rs=rows.filter(r=>g==='all'||r.cohort===g),count=f=>rs.filter(f).length;
 return[g,{models:rs.length,beforeTop:count(r=>r.beforeTop.length),afterTop:count(r=>r.afterTop.length),beforeDegree:count(r=>r.beforeTop.some(bachelorGraduate)),afterDegree:count(r=>r.afterTop.some(bachelorGraduate)),beforeCovers:count(r=>r.beforeTop.some(p=>p.budget.covers===true)),afterCovers:count(r=>r.afterTop.some(p=>p.budget.covers===true)),gainedTop:count(r=>r.gainedTop),lostTop:count(r=>r.lostTop),gainedDegree:count(r=>r.gainedDegree),lostDegree:count(r=>r.lostDegree),changed:count(r=>r.changed),newClaims:rs.reduce((n,r)=>n+r.newSupported.length,0),encoded:count(r=>r.encoded),authored:count(r=>r.source==='Authored profile'),checksAdded:rs.reduce((n,r)=>n+r.checks.filter(t=>!t.retained&&t.decision.response==='yes').length,0),retainedConflicts:rs.reduce((n,r)=>n+r.checks.filter(t=>t.retained&&t.before?.response==='no'&&t.decision.response==='yes').length,0)}];
}));
assert.deepEqual([summary.all.models,summary.development.models,summary.holdout.models,summary.holdout049.models,summary.holdout056.models],[1000,758,30,12,200]);
assert.equal(summary.all.beforeTop,789);assert.equal(summary.all.beforeDegree,653);
for(const[p,h]of Object.entries(freeze.files))assert.equal(sha(fs.readFileSync(p)),h);
const out={experiment:'evidence-068-v1',baselineRunId:manifest.runId,rulesVersion:freeze.rulesVersion,freezeSHA256:sha(JSON.stringify(freeze)),summary,rules,limitations:['Research replay of frozen synthetic profiles; not observed student outcomes or validated accuracy. New Yes evidence is simulated and medium confidence.','Only four profession rules are tested. Of 172 authored profiles, only four have the previously frozen typed source annotations. The other authored interests remain unencoded, not absent. The 828 structured profiles can supply only scoped mathematics facts under these rules.','No new capture questions were administered; proposed questions are not validated scales. No 0.66 per-model answer lookup, text classifier, salary bonus, degree quota or lowered support threshold.','Holdout splits remain separate. Earlier profiles and aggregate outcomes have been inspected, so these are diagnostic holdouts, not pristine validation.','Known Yes/No answers and review holds are preserved. A retained No can block a new connection; the conflict remains for review.','Earnings and budgets are unchanged. Missing pay stays unassessed. Bachelor / graduate means a recognized college or graduate catalog route; associate programs remain separate.'],checks:{models:1000,sourceStatesChanged:0,originalPreferencesAdded:0,knownAnswersOverwritten:0,holdsOverwritten:0,supportedCareersLost:0,liveFlowChanges:0},rows};
fs.writeFileSync(root+'results.json.gz',gzipSync(JSON.stringify(out),{level:9}));
fs.writeFileSync(root+'summary.json',JSON.stringify({...out,rows:undefined},null,2)+'\n');
fs.writeFileSync('dist/developer/evidence-benchmark-068.json.gz',gzipSync(JSON.stringify(out),{level:9}));
console.log(JSON.stringify(summary,null,2));
export {out as evidenceBenchmark068};
